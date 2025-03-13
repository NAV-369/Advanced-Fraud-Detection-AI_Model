import api from './authService';
import { endpoints } from './config';

export interface FraudMetrics {
  totalTransactions: number;
  fraudulentTransactions: number;
  fraudRate: number;
  averageFraudAmount: number;
  totalFraudAmount: number;
  recentTransactions: Array<{
    id: string;
    amount: number;
    timestamp: string;
    status: 'approved' | 'flagged' | 'review';
    riskScore: number;
  }>;
  fraudByDay: Array<{
    date: string;
    count: number;
  }>;
  fraudByType: Array<{
    type: string;
    count: number;
  }>;
}

export const fetchFraudMetrics = async (): Promise<FraudMetrics> => {
  const response = await api.get(endpoints.metrics);
  return response.data;
};

export const predictFraud = async (features: number[]): Promise<{
  fraudProbability: number;
  confidence: number;
  isAlert: boolean;
}> => {
  const response = await api.post(endpoints.predict, { features });
  return response.data;
}; 