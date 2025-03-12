import axios from 'axios';
import { FraudMetrics } from '../types/metrics';
import { mockFraudMetrics } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || false;

// Add response time simulation for development
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchFraudMetrics = async (): Promise<FraudMetrics> => {
  if (USE_MOCK_DATA) {
    await simulateDelay(1000);
    return mockFraudMetrics;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/metrics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching fraud metrics:', error);
    throw error;
  }
};

export const predictFraud = async (features: number[]): Promise<{
  fraudProbability: number;
  confidence: number;
  isAlert: boolean;
}> => {
  if (USE_MOCK_DATA) {
    await simulateDelay(500);
    
    // Extract features
    const [amount, hour, day, customerAge, accountAge] = features;
    
    // Calculate risk based on features
    let riskScore = 0;
    
    // Higher amounts increase risk
    riskScore += Math.min((amount / 1000) * 0.3, 0.3);
    
    // Late night hours (22-6) increase risk
    if (hour >= 22 || hour <= 6) {
      riskScore += 0.2;
    }
    
    // Weekend transactions slightly riskier
    if (day >= 5) {
      riskScore += 0.1;
    }
    
    // Very young or very old accounts are riskier
    if (accountAge < 30 || accountAge > 3000) {
      riskScore += 0.15;
    }
    
    // Add some randomness (±10%)
    riskScore += (Math.random() * 0.2 - 0.1);
    
    // Clamp between 0 and 1
    riskScore = Math.max(0, Math.min(1, riskScore));
    
    return {
      fraudProbability: riskScore,
      confidence: 0.8 + (Math.random() * 0.15),  // High confidence for mock data
      isAlert: riskScore > 0.7
    };
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/predict`, {
      features
    });
    return response.data;
  } catch (error) {
    console.error('Error predicting fraud:', error);
    throw error;
  }
}; 