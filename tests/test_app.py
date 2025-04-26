import pytest
import json
import os
import numpy as np
from api.app import create_app

@pytest.fixture
def client():
    """Create a test client for the app."""
    # For testing, we use mock predictions to avoid needing the actual model
    app = create_app({
        'TESTING': True,
        'USE_MOCK_PREDICTIONS': True,
        'SECRET_KEY': 'test-key'
    })
    
    with app.test_client() as client:
        yield client

def test_home_endpoint(client):
    """Test the home endpoint."""
    response = client.get('/')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'online'
    assert 'endpoints' in data

def test_health_endpoint(client):
    """Test the health endpoint."""
    response = client.get('/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'healthy'
    assert 'using_mock_predictions' in data
    assert 'timestamp' in data

def test_metrics_endpoint(client):
    """Test the metrics endpoint."""
    response = client.get('/metrics')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'totalTransactions' in data
    assert 'fraudRate' in data
    assert 'fraudByHour' in data
    assert 'fraudHeatmap' in data

def test_login_endpoint_success(client):
    """Test successful login."""
    response = client.post('/auth/login', 
                          json={'email': 'admin@fraud-detection.com', 'password': 'admin123'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'token' in data
    assert data['user']['role'] == 'admin'

def test_login_endpoint_failure(client):
    """Test failed login."""
    response = client.post('/auth/login', 
                          json={'email': 'admin@fraud-detection.com', 'password': 'wrong_password'})
    assert response.status_code == 401

def test_predict_endpoint(client):
    """Test the predict endpoint."""
    # Sample features: amount, hour, day, customer_age, account_age
    features = [1000.0, 12, 3, 35, 180]
    response = client.post('/predict', json={'features': features})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'fraudProbability' in data
    assert 'confidence' in data
    assert 'isAlert' in data
    assert 'using_mock' in data
    assert isinstance(data['fraudProbability'], float)
    
def test_predict_endpoint_invalid_input(client):
    """Test the predict endpoint with invalid input."""
    response = client.post('/predict', json={'wrong_key': [1, 2, 3]})
    assert response.status_code == 400
    
def test_register_endpoint(client):
    """Test the register endpoint."""
    response = client.post('/auth/register', 
                          json={'email': 'newuser@example.com', 'password': 'password123'})
    assert response.status_code == 201
    
    # Test login with the new user
    response = client.post('/auth/login', 
                          json={'email': 'newuser@example.com', 'password': 'password123'})
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['user']['role'] == 'user'

def test_transactions_endpoint(client):
    """Test the transactions endpoint."""
    response = client.get('/transactions')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'transactions' in data
    assert 'count' in data
    assert 'using_real_data' in data
    assert isinstance(data['transactions'], list)
    
    # Check transaction structure if any returned
    if data['count'] > 0:
        transaction = data['transactions'][0]
        assert 'id' in transaction
        assert 'time' in transaction
        assert 'amount' in transaction
        assert 'isFraud' in transaction 