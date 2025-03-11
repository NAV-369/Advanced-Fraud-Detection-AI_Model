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

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(
    filename='api.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Load model
MODEL_PATH = Path('../best_model_LightGBM_20250310_193850.joblib')
try:
    model = joblib.load(MODEL_PATH)
    logging.info(f"Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    logging.error(f"Model loading failed: {str(e)}")
    raise RuntimeError("Model loading failed") from e

def generate_demo_metrics():
    """Generate demo metrics for development"""
    total_transactions = random.randint(8000, 12000)
    fraud_count = random.randint(200, 400)
    fraud_rate = (fraud_count / total_transactions) * 100
    
    # Generate hourly fraud data
    fraud_by_hour = []
    for hour in range(24):
        fraud_by_hour.append({
            "hour": hour,
            "fraud_count": random.randint(5, 30)
        })
    
    # Generate heatmap data
    heatmap_data = []
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    for day_idx, day in enumerate(days):
        for hour in range(24):
            heatmap_data.append({
                "id": f"{day}-{hour}",
                "data": [
                    {
                        "x": str(hour),
                        "y": day,
                        "value": random.randint(1, 20)
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
        # In production, replace with actual metrics calculation
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
        
        # Model prediction
        proba = model.predict_proba(features)[0][1]
        confidence = abs(proba - 0.5) * 2  # Scale confidence based on distance from decision boundary
        
        # Log prediction
        logging.info(f"Prediction request - Features: {features.tolist()}, Probability: {proba:.4f}")
        
        return jsonify({
            "fraudProbability": float(proba),
            "confidence": float(confidence),
            "threshold": 0.5,
            "isAlert": proba >= 0.5
        })
    
    except Exception as e:
        logging.error(f"Prediction error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_version": str(model.__class__).split("'")[1],
        "model_loaded": True,
        "timestamp": datetime.now().isoformat()
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)