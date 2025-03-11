export interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: 'primary' | 'error' | 'warning' | 'success';
  trend?: number;
}

export interface HeatMapDatum {
  x: number;
  y: number;
  value: number;
}

export interface HeatMapData {
  id: string;
  data: HeatMapDatum[];
}

export interface FraudMetrics {
  totalTransactions: number;
  fraudRate: number;
  avgTransactionValue: number;
  fraudByHour: Array<{
    hour: number;
    fraud_count: number;
  }>;
  fraudHeatmap: HeatMapData[];
} 