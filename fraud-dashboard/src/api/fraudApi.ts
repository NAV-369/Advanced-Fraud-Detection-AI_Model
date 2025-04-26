import axios from 'axios';
import { FraudMetrics } from '../types/metrics';
import config from './config';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://fraud-detection-api.onrender.com';

// Debug log
console.log('API Configuration:', { 
  API_BASE_URL
});

// Create axios instance without authentication
const api = axios.create({
  baseURL: API_BASE_URL,
  // Enable CORS credentials and add necessary headers
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000 // 15 seconds timeout
});

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.message === 'Network Error') {
      console.error('Network Error Details:', {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: API_BASE_URL
      });
    }
    return Promise.reject(error);
  }
);

export const fetchFraudMetrics = async (): Promise<FraudMetrics> => {
  try {
    console.log('Fetching metrics from:', `${API_BASE_URL}/metrics`);
    const response = await api.get(`/metrics`);
    console.log('Metrics API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching fraud metrics:', error);
    // Add more specific error handling
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server responded with error:', error.response.status, error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from server. Request:', error.request);
      }
      throw new Error(`Metrics API error: ${error.message} [${error.response?.status || 'No status'}]`);
    }
    throw error;
  }
};

export const fetchTransactions = async (): Promise<{
  transactions: Array<{
    id: number;
    time: number;
    amount: number;
    isFraud: boolean;
    v1: number;
    v2: number;
    v3: number;
    v4: number;
    v5: number;
  }>;
  count: number;
  using_real_data: boolean;
}> => {
  try {
    console.log('Fetching transactions from:', `${API_BASE_URL}/transactions`);
    const response = await api.get(`/transactions`);
    console.log('Transactions API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Transactions API error: ${error.message} [${error.response?.status || 'No status'}]`);
    }
    throw error;
  }
};

export const predictFraud = async (features: number[]): Promise<{
  fraudProbability: number;
  confidence: number;
  isAlert: boolean;
  using_mock?: boolean;
}> => {
  try {
    console.log('Sending prediction request to:', `${API_BASE_URL}/predict`, 'with features:', features);
    const response = await api.post(`/predict`, {
      features
    });
    console.log('Prediction API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error predicting fraud:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Prediction API error: ${error.message} [${error.response?.status || 'No status'}]`);
    }
    throw error;
  }
}; 