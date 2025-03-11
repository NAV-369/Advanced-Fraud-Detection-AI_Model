import { FC } from 'react';
import { 
  Box, 
  Paper, 
  Typography 
} from '@mui/material';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { FraudMetrics } from '../types/metrics';

interface LineChartProps {
  metrics: FraudMetrics | null;
}

export const LineChart: FC<LineChartProps> = ({ metrics }) => {
  // Transform data for the line chart
  const transformData = () => {
    if (!metrics?.fraudByHour) return [];
    
    return metrics.fraudByHour.map(item => ({
      hour: `${item.hour}:00`,
      fraudCount: item.fraud_count
    }));
  };

  const data = transformData();

  return (
    <Paper
      sx={{
        p: 3,
        height: 450,
        background: 'white',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', fontWeight: 600 }}>
            Fraud Activity by Hour
          </Typography>
          <Typography variant="body2" sx={{ color: '#4a5568' }}>
            Number of fraudulent transactions detected per hour
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 30
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="hour" 
              tick={{ fill: '#4a5568' }}
              tickLine={{ stroke: '#4a5568' }}
              axisLine={{ stroke: '#4a5568' }}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis 
              tick={{ fill: '#4a5568' }}
              tickLine={{ stroke: '#4a5568' }}
              axisLine={{ stroke: '#4a5568' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 8,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                border: 'none'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            <Line
              type="monotone"
              dataKey="fraudCount"
              name="Fraud Count"
              stroke="#e74c3c"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}; 