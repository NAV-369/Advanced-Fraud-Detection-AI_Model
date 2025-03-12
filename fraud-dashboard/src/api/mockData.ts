import { FraudMetrics } from '../types/metrics';

// Helper function to generate realistic fraud patterns
const generateFraudValue = (hour: number, day: number): number => {
  let baseValue = 5; // Base fraud rate
  
  // Time-based patterns
  if (hour >= 22 || hour <= 5) {
    // Higher fraud at night (10PM-5AM)
    baseValue *= 2.5;
  } else if (hour >= 9 && hour <= 17) {
    // Lower fraud during business hours
    baseValue *= 0.7;
  }
  
  // Day-based patterns
  if (day >= 5) {
    // Higher fraud on weekends
    baseValue *= 1.5;
  }
  
  // Peak hours (around lunch and evening)
  if (hour === 12 || hour === 13 || hour === 18 || hour === 19) {
    baseValue *= 1.3;
  }
  
  // Add controlled randomness (±30% variation)
  const randomFactor = 0.7 + Math.random() * 0.6;
  
  return Math.round(baseValue * randomFactor);
};

// Generate heatmap data with proper structure for visualization
const generateHeatmapData = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days.map((day, dayIndex) => ({
    id: day,
    data: Array.from({ length: 24 }, (_, hour) => ({
      x: hour,
      y: dayIndex,
      value: generateFraudValue(hour, dayIndex)
    }))
  }));
};

export const mockFraudMetrics: FraudMetrics = {
  totalTransactions: 15234,
  fraudRate: 2.3,
  avgTransactionValue: 156.78,
  fraudByHour: Array.from({ length: 24 }, (_, hour) => ({
    hour,
    fraud_count: generateFraudValue(hour, 3) // Use Wednesday as reference
  })),
  fraudHeatmap: generateHeatmapData()
}; 