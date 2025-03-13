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

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000", "http://frontend:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Configure logging
logging.basicConfig(
    filename='api.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Load model
MODEL_PATH = Path('./model/best_model_LightGBM_20250310_193850.joblib')
USE_MOCK_PREDICTIONS = True  # Set to False when model is ready

try:
    if not USE_MOCK_PREDICTIONS:
        if not MODEL_PATH.exists():
            logging.warning(f"Model file not found at {MODEL_PATH}. Using mock predictions.")
            USE_MOCK_PREDICTIONS = True
        else:
            model = joblib.load(MODEL_PATH)
            logging.info(f"Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    logging.error(f"Model loading failed: {str(e)}. Using mock predictions.")
    USE_MOCK_PREDICTIONS = True

def generate_demo_metrics():
    """Generate demo metrics for development"""
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
    heatmap_data = []
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    for day_idx, day in enumerate(days):
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
                
            # Add some randomness
            value = max(1, base_value + random.randint(-2, 2))
            
            heatmap_data.append({
                "id": f"{day}-{hour}",
                "data": [
                    {
                        "x": str(hour),
                        "y": day,
                        "value": value
                    }
                ]
            })
    
    return {
        "totalTransactions": total_transactions,
        "fraudRate": fraud_rate,
        "avgTransactionValue": random.uniform(50, 200),
        "fraudByHour": fraud_by_hour,
        "fraudHeatmap": heatmap_data
    }

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    """Endpoint for fraud metrics dashboard"""
    try:
        metrics = generate_demo_metrics()
        return jsonify(metrics)
    except Exception as e:
        logging.error(f"Metrics error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    """Endpoint for fraud predictions"""
    try:
        # Input validation
        data = request.json
        if not data or 'features' not in data:
            return jsonify({"error": "Invalid input format"}), 400
            
        features = np.array(data['features']).reshape(1, -1)
        
        if USE_MOCK_PREDICTIONS:
            # Mock prediction logic
            amount, hour, day, customer_age, account_age = features[0]
            
            # Calculate risk score based on features
            risk_score = 0
            
            # Amount-based risk
            risk_score += min((amount / 1000) * 0.3, 0.3)
            
            # Time-based risk
            if hour >= 22 or hour <= 6:
                risk_score += 0.2
            
            # Day-based risk
            if day >= 5:  # Weekend
                risk_score += 0.1
            
            # Account age risk
            if account_age < 30 or account_age > 3000:
                risk_score += 0.15
            
            # Add slight randomness
            risk_score += (random.random() * 0.2 - 0.1)
            
            # Clamp between 0 and 1
            risk_score = max(0, min(1, risk_score))
            
            proba = risk_score
            confidence = 0.8 + (random.random() * 0.15)
        else:
            # Real model prediction
            proba = model.predict_proba(features)[0][1]
            confidence = abs(proba - 0.5) * 2
        
        # Log prediction
        logging.info(f"Prediction request - Features: {features.tolist()}, Probability: {proba:.4f}")
        
        return jsonify({
            "fraudProbability": float(proba),
            "confidence": float(confidence),
            "isAlert": proba > 0.7
        })
    
    except Exception as e:
        logging.error(f"Prediction error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "using_mock_predictions": USE_MOCK_PREDICTIONS,
        "model_loaded": not USE_MOCK_PREDICTIONS,
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)