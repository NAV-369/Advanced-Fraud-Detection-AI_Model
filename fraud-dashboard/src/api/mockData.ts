import { FraudMetrics } from '../types/metrics';

export const mockFraudMetrics: FraudMetrics = {
  totalTransactions: 15234,
  fraudRate: 2.3,
  avgTransactionValue: 156.78,
  fraudByHour: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    fraud_count: Math.floor(Math.random() * 50) + 10
  })),
  fraudHeatmap: [
    {
      id: 'weekday',
      data: Array.from({ length: 7 * 24 }, (_, i) => ({
        x: i % 24,  // hour
        y: Math.floor(i / 24),  // day
        value: Math.floor(Math.random() * 100)
      }))
    }
  ]
}; 