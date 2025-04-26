# api/serve_model.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import logging
from pathlib import Path
from datetime import datetime, timedelta
import random  # Only for demo data, remove in production
import os
import jwt
import hashlib
from functools import wraps

def create_app(test_config=None):
    """Create and configure the Flask app"""
    # Initialize Flask app
    app = Flask(__name__)
    
    # Apply test configuration if provided
    if test_config:
        app.config.update(test_config)
    
    # Enable CORS for all origins
    CORS(app, resources={
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Configure logging
    logging.basicConfig(
        filename='api.log',
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )

    # Use real predictions by default
    app.config['USE_MOCK_PREDICTIONS'] = os.environ.get('USE_MOCK_PREDICTIONS', 'False').lower() == 'true'

    # Secret key for JWT
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-for-jwt')

    # Mock user database (in production, use a real database)
    app.config['USERS'] = {
        'admin@fraud-detection.com': {
            'password': hashlib.sha256('admin123'.encode()).hexdigest(),
            'role': 'admin'
        },
        'user@fraud-detection.com': {
            'password': hashlib.sha256('user123'.encode()).hexdigest(),
            'role': 'user'
        }
    }

    # JWT token required decorator
    def token_required(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = None
            auth_header = request.headers.get('Authorization')
            
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
                
            if not token:
                return jsonify({'message': 'Token is missing!'}), 401
                
            try:
                data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
                current_user = data['email']
            except:
                return jsonify({'message': 'Token is invalid!'}), 401
                
            return f(current_user, *args, **kwargs)
        
        return decorated

    @app.route('/')
    def home():
        """Home endpoint"""
        return jsonify({
            "status": "online",
            "message": "Fraud Detection API is running",
            "endpoints": {
                "health": "/health",
                "metrics": "/metrics",
                "predict": "/predict",
                "auth": {
                    "login": "/auth/login",
                    "register": "/auth/register"
                }
            }
        })

    @app.route('/auth/login', methods=['POST'])
    def login():
        """Login endpoint"""
        auth = request.json
        
        if not auth or not auth.get('email') or not auth.get('password'):
            return jsonify({'message': 'Could not verify', 'WWW-Authenticate': 'Basic realm="Login required!"'}), 401
        
        email = auth.get('email')
        password = hashlib.sha256(auth.get('password').encode()).hexdigest()
        
        if email not in app.config['USERS'] or app.config['USERS'][email]['password'] != password:
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Generate JWT token
        token = jwt.encode({
            'email': email,
            'role': app.config['USERS'][email]['role'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        
        return jsonify({
            'token': token,
            'user': {
                'email': email,
                'role': app.config['USERS'][email]['role']
            }
        })

    @app.route('/auth/register', methods=['POST'])
    def register():
        """Register endpoint (for demo purposes)"""
        data = request.json
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Missing required fields'}), 400
        
        email = data.get('email')
        
        if email in app.config['USERS']:
            return jsonify({'message': 'User already exists'}), 409
        
        # Add new user
        app.config['USERS'][email] = {
            'password': hashlib.sha256(data.get('password').encode()).hexdigest(),
            'role': 'user'  # Default role
        }
        
        return jsonify({'message': 'User created successfully'}), 201

    # Load model
    MODEL_PATH = Path('best_model_LightGBM_20250310_193850.joblib')
    if not MODEL_PATH.exists():
        MODEL_PATH = Path('./model/best_model_LightGBM_with_time_features.joblib')
    if not MODEL_PATH.exists():
        MODEL_PATH = Path('./best_model_LightGBM_20250310_193850.joblib') 
    if not MODEL_PATH.exists():
        MODEL_PATH = Path('../best_model_LightGBM_20250310_193850.joblib')
    if not MODEL_PATH.exists():
        MODEL_PATH = Path('../notebooks/best_model_LightGBM_with_time_features.joblib')

    try:
        app.config['model'] = joblib.load(MODEL_PATH)
        logging.info(f"Model loaded successfully from {MODEL_PATH}")
    except Exception as e:
        logging.error(f"Model loading failed: {str(e)}. Using mock predictions as fallback.")
        app.config['USE_MOCK_PREDICTIONS'] = True

    def generate_demo_metrics():
        """Generate demo metrics for development"""
        # Use a seed for random number generation to ensure consistency
        random.seed(42)
        
        total_transactions = random.randint(8000, 12000)
        fraud_count = random.randint(200, 400)
        fraud_rate = (fraud_count / total_transactions) * 100
        
        # Generate hourly fraud data
        fraud_by_hour = []
        for hour in range(24):
            base_count = 10  # Base fraud count
            # Add time-based patterns
            if hour >= 22 or hour <= 5:
                # Higher fraud at night
                base_count = 20
            elif 9 <= hour <= 17:
                # Lower fraud during business hours
                base_count = 5
                
            count = base_count + random.randint(-3, 3)  # Add some randomness
            fraud_by_hour.append({
                "hour": hour,
                "fraud_count": max(0, count)  # Ensure non-negative
            })
        
        # Generate heatmap data
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        
        # Create a properly formatted heatmap for the frontend
        heatmap_entries = []
        
        # First generate fraud counts with patterns
        fraud_counts = []
        for day_idx, day in enumerate(days):
            day_factor = 1.5 if day_idx >= 5 else 1.0  # Weekend effect
            
            for hour in range(24):
                # Base value with patterns
                base_value = 10
                
                # Weekend pattern
                if day_idx >= 5:  # Weekend
                    base_value += 5
                
                # Night hours pattern
                if hour >= 22 or hour <= 5:
                    base_value += 8
                elif 9 <= hour <= 17:  # Business hours
                    base_value -= 3
                    
                # Add some randomness but keep it deterministic
                seed_value = day_idx * 100 + hour
                random.seed(seed_value)
                value = max(1, int(base_value * day_factor + random.randint(-2, 2)))
                fraud_counts.append(value)
        
        # Calculate max fraud for consistent scaling
        max_fraud = max(fraud_counts)
        
        # Create the heatmap entries
        for i, value in enumerate(fraud_counts):
            day_idx = i // 24
            hour = i % 24
            
            heatmap_entries.append({
                "x": hour,
                "y": day_idx,
                "value": value
            })
                
        heatmap_data = [{
            "id": "fraud-heatmap",
            "data": heatmap_entries
        }]
        
        # Reset the random seed to avoid affecting other operations
        random.seed()
        
        # Log the generated metrics
        logging.info(f"Generated demo metrics with {len(heatmap_entries)} heatmap points and max fraud: {max_fraud}")
        
        return {
            "totalTransactions": total_transactions,
            "fraudRate": fraud_rate,
            "avgTransactionValue": random.uniform(50, 200),
            "fraudByHour": fraud_by_hour,
            "fraudHeatmap": heatmap_data
        }

    @app.route('/health')
    def health():
        """Health check endpoint"""
        return jsonify({
            "status": "healthy",
            "using_mock_predictions": app.config['USE_MOCK_PREDICTIONS'],
            "timestamp": datetime.now().isoformat()
        })

    @app.route('/metrics', methods=['GET'])
    def get_metrics():
        """Endpoint for fraud metrics dashboard"""
        try:
            # Load real data instead of generating mock data
            try:
                # First try to load from deployment sample data directory
                data_path = Path('../data_deployment/creditcard_sample.csv')
                if not data_path.exists():
                    # Then try from data directory relative to workspace root
                    data_path = Path('../data/creditcard.csv')
                    if not data_path.exists():
                        # Then try from current directory
                        data_path = Path('./data/creditcard.csv')
                        if not data_path.exists():
                            data_path = Path('./data_deployment/creditcard_sample.csv')
                
                if data_path.exists():
                    df = pd.read_csv(data_path)
                    
                    # Calculate real metrics
                    total_transactions = len(df)
                    fraud_count = df[df['Class'] == 1].shape[0]
                    fraud_rate = (fraud_count / total_transactions) * 100
                    avg_transaction_value = df['Amount'].mean()
                    
                    # Calculate fraud by hour
                    # Convert Time column to hour of day (assuming Time is in seconds since first transaction)
                    df['Hour'] = (df['Time'] / 3600) % 24
                    df['Hour'] = df['Hour'].astype(int)
                    
                    fraud_by_hour = []
                    for hour in range(24):
                        hour_df = df[df['Hour'] == hour]
                        if len(hour_df) > 0:
                            fraud_count = hour_df[hour_df['Class'] == 1].shape[0]
                            fraud_by_hour.append({
                                "hour": hour,
                                "fraud_count": fraud_count
                            })
                        else:
                            fraud_by_hour.append({
                                "hour": hour,
                                "fraud_count": 0
                            })
                    
                    # Create heatmap data
                    # Map the Time to day of week (just for demonstration - assumes Time starts on a Monday)
                    df['DayOfWeek'] = ((df['Time'] / (3600 * 24)) % 7).astype(int)
                    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                    
                    # Format heatmap data to match frontend expectations
                    heatmap_data_formatted = []
                    heatmap_entries = []
                    
                    # First normalize the data for consistent display
                    fraud_counts = []
                    for day_idx, day in enumerate(days):
                        for hour in range(24):
                            # Filter data for this day and hour
                            day_hour_data = df[(df['DayOfWeek'] == day_idx) & (df['Hour'] == hour)]
                            if len(day_hour_data) > 0:
                                fraud_count = int(day_hour_data[day_hour_data['Class'] == 1].shape[0])
                                fraud_counts.append(fraud_count)
                            else:
                                fraud_counts.append(0)
                    
                    # Calculate max fraud count for consistent scaling
                    max_fraud = max(fraud_counts) if fraud_counts else 1
                    fraud_count_index = 0
                    
                    # Now create the heatmap entries
                    for day_idx, day in enumerate(days):
                        for hour in range(24):
                            fraud_count = fraud_counts[fraud_count_index]
                            fraud_count_index += 1
                            
                            heatmap_entries.append({
                                "x": hour,
                                "y": day_idx,
                                "value": fraud_count
                            })
                    
                    heatmap_data_formatted.append({
                        "id": "fraud-heatmap",
                        "data": heatmap_entries
                    })
                    
                    # Log the heatmap data for debugging
                    logging.info(f"Generated {len(heatmap_entries)} heatmap data points with max fraud count: {max_fraud}")
                    
                    # Return real metrics
                    return jsonify({
                        "totalTransactions": total_transactions,
                        "fraudRate": fraud_rate,
                        "avgTransactionValue": avg_transaction_value,
                        "fraudByHour": fraud_by_hour,
                        "fraudHeatmap": heatmap_data_formatted
                    })
                else:
                    # If data file doesn't exist, log the issue and fall back to generate_demo_metrics
                    logging.warning(f"Data file not found at {data_path}. Using generated metrics.")
                    return jsonify(generate_demo_metrics())
            except Exception as data_error:
                # If there's an error processing the data, log it and fall back
                logging.error(f"Error processing real data: {str(data_error)}. Using generated metrics.")
                return jsonify(generate_demo_metrics())
        except Exception as e:
            logging.error(f"Metrics error: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500

    @app.route('/predict', methods=['POST'])
    def predict():
        """Endpoint for fraud predictions"""
        try:
            # Input validation
            data = request.json
            if not data or 'features' not in data:
                return jsonify({"error": "Invalid input format"}), 400
                
            features = np.array(data['features']).reshape(1, -1)
            
            if app.config['USE_MOCK_PREDICTIONS']:
                # Mock prediction logic - only as a fallback
                # Use a deterministic approach to ensure consistent results for the same inputs
                amount, hour, day, customer_age, account_age = features[0]
                
                # Calculate risk score based on features
                risk_score = 0
                
                # Amount-based risk (30% weighting)
                risk_score += min((amount / 1000) * 0.3, 0.3)
                
                # Time-based risk (20% weighting)
                if hour >= 22 or hour <= 6:
                    risk_score += 0.2
                elif hour >= 12 and hour <= 14:  # Lunch hours
                    risk_score += 0.1
                
                # Day-based risk (15% weighting)
                if day >= 5:  # Weekend
                    risk_score += 0.15
                
                # Account age risk (25% weighting)
                if account_age < 30:
                    risk_score += 0.25  # Very new accounts
                elif account_age < 90:
                    risk_score += 0.15  # Newer accounts
                elif account_age > 3650:  # Over 10 years
                    risk_score += 0.10   # Very old accounts could be suspicious
                
                # Hash-based randomness for deterministic results (10% weighting)
                # Create a string representation of the features to hash
                feature_str = f"{amount:.1f}-{hour}-{day}-{customer_age}-{account_age}"
                # Use a hash function to get a deterministic value between 0-1
                hash_val = abs(hash(feature_str)) % 1000 / 1000.0
                # Add a small amount of "randomness" (but deterministic for the same input)
                risk_score += hash_val * 0.1
                
                # Clamp between 0 and 1
                risk_score = max(0, min(1, risk_score))
                
                proba = float(risk_score)
                confidence = float(0.7 + (hash_val * 0.25))  # Deterministic confidence
                is_alert = bool(proba > 0.7)
                using_mock = True
                
                logging.info(f"Using mock prediction for features: {features.tolist()}, result: {proba:.4f}")
            else:
                try:
                    # Real model prediction
                    if 'model' not in app.config:
                        return jsonify({"error": "Model not loaded. Please try again later."}), 500
                        
                    proba = float(app.config['model'].predict_proba(features)[0][1])
                    confidence = float(abs(proba - 0.5) * 2)
                    is_alert = bool(proba > 0.7)
                    using_mock = False
                    logging.info(f"Using real model prediction for features: {features.tolist()}, result: {proba:.4f}")
                except Exception as model_error:
                    logging.error(f"Model prediction error: {str(model_error)}. Falling back to mock prediction.")
                    return jsonify({"error": "Could not process prediction with model. Try different features."}), 400
            
            # Log prediction
            logging.info(f"Prediction request - Features: {features.tolist()}, Probability: {proba:.4f}")
            
            return jsonify({
                "fraudProbability": proba,
                "confidence": confidence,
                "isAlert": is_alert,
                "using_mock": using_mock
            })
        
        except Exception as e:
            logging.error(f"Prediction error: {str(e)}")
            return jsonify({"error": "Internal server error", "details": str(e)}), 500

    @app.route('/transactions', methods=['GET'])
    def get_transactions():
        """Endpoint for recent transactions"""
        try:
            # Load real transaction data
            try:
                # First try to load from deployment sample data directory
                data_path = Path('../data_deployment/creditcard_sample.csv')
                if not data_path.exists():
                    # Then try from data directory relative to workspace root
                    data_path = Path('../data/creditcard.csv')
                    if not data_path.exists():
                        # Then try from current directory
                        data_path = Path('./data/creditcard.csv')
                        if not data_path.exists():
                            data_path = Path('./data_deployment/creditcard_sample.csv')
                
                if data_path.exists():
                    df = pd.read_csv(data_path)
                    
                    # Limit to last 100 transactions for API response size
                    df = df.tail(100).copy()
                    
                    # Convert Time to hours for better readability
                    df['Time'] = (df['Time'] / 3600).round(2)
                    
                    # Prepare transactions list
                    transactions = []
                    for _, row in df.iterrows():
                        transactions.append({
                            'id': int(row.name),
                            'time': float(row['Time']),
                            'amount': float(row['Amount']),
                            'isFraud': bool(row['Class']),
                            'v1': float(row['V1']),
                            'v2': float(row['V2']),
                            'v3': float(row['V3']),
                            'v4': float(row['V4']),
                            'v5': float(row['V5'])
                        })
                    
                    return jsonify({
                        'transactions': transactions,
                        'count': len(transactions),
                        'using_real_data': True
                    })
                else:
                    # If data file doesn't exist, generate mock transactions
                    logging.warning(f"Data file not found at {data_path}. Using generated transactions.")
                    # Generate mock transactions
                    transactions = []
                    for i in range(100):
                        is_fraud = random.random() < 0.05  # 5% chance of fraud
                        amount = random.uniform(10, 1000) if not is_fraud else random.uniform(500, 5000)
                        transactions.append({
                            'id': i,
                            'time': random.uniform(0, 24),  # Hour of day
                            'amount': amount,
                            'isFraud': is_fraud,
                            'v1': random.uniform(-5, 5),
                            'v2': random.uniform(-5, 5),
                            'v3': random.uniform(-5, 5),
                            'v4': random.uniform(-5, 5),
                            'v5': random.uniform(-5, 5)
                        })
                    
                    return jsonify({
                        'transactions': transactions,
                        'count': len(transactions),
                        'using_real_data': False
                    })
            except Exception as data_error:
                logging.error(f"Error processing transaction data: {str(data_error)}. Using generated transactions.")
                return jsonify({"error": "Could not load transaction data"}), 500
        except Exception as e:
            logging.error(f"Transactions endpoint error: {str(e)}")
            return jsonify({"error": "Internal server error"}), 500

    return app

# Create the application instance
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5003))
    app.run(host='0.0.0.0', port=port)