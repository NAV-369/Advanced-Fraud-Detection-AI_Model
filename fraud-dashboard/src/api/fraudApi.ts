import axios from 'axios';
import { FraudMetrics } from '../types/metrics';
import { mockFraudMetrics } from './mockData';

const API_BASE_URL = 'http://localhost:8000/api';
const USE_MOCK_DATA = false;  // Set to false to use real API

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
    return {
      fraudProbability: Math.random(),
      confidence: Math.random(),
      isAlert: Math.random() > 0.5
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