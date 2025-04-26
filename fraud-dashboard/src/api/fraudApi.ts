import axios from 'axios';
import { FraudMetrics } from '../types/metrics';
import config from './config';

const API_BASE_URL = import.meta.env.VITE_API_URL || config.API_URL;

// Debug log
console.log('API Configuration:', { 
  API_BASE_URL
});

export const fetchFraudMetrics = async (): Promise<FraudMetrics> => {
  try {
    console.log('Fetching metrics from:', `${API_BASE_URL}/metrics`);
    const response = await axios.get(`${API_BASE_URL}/metrics`);
    console.log('Metrics API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching fraud metrics:', error);
    // Throw a more descriptive error
    if (axios.isAxiosError(error)) {
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
    const response = await axios.get(`${API_BASE_URL}/transactions`);
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
    const response = await axios.post(`${API_BASE_URL}/predict`, {
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