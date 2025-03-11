import { FC, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  SelectChangeEvent,
  useTheme
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { FraudMetrics, HeatMapData } from '../types/metrics';

interface FraudActivityVisualizationProps {
  metrics: FraudMetrics | null;
}

type ViewType = '3d-area' | 'radar' | 'stacked-bar';

// Day mapping
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Data structures for different visualizations
interface HourlyData {
  hour: string;
  Sunday: number;
  Monday: number;
  Tuesday: number;
  Wednesday: number;
  Thursday: number;
  Friday: number;
  Saturday: number;
  [key: string]: string | number;
}

interface DayData {
  day: string;
  value: number;
}

interface TimeBlockData {
  day: string;
  Morning: number;
  Afternoon: number;
  Evening: number;
  Night: number;
  [key: string]: string | number;
}

// Time block definition
const TIME_BLOCKS = [
  { name: 'Morning' as const, hours: [6, 7, 8, 9, 10, 11] },
  { name: 'Afternoon' as const, hours: [12, 13, 14, 15, 16, 17] },
  { name: 'Evening' as const, hours: [18, 19, 20, 21, 22, 23] },
  { name: 'Night' as const, hours: [0, 1, 2, 3, 4, 5] }
];

export const FraudActivityVisualization: FC<FraudActivityVisualizationProps> = ({ metrics }) => {
  const [viewType, setViewType] = useState<ViewType>('3d-area');
  const theme = useTheme();

  const handleViewChange = (event: SelectChangeEvent) => {
    setViewType(event.target.value as ViewType);
  };

  // Transform heatmap data for different visualizations
  const transformData = () => {
    if (!metrics?.fraudHeatmap) return [];

    // For area chart - aggregate by hour across all days
    if (viewType === '3d-area') {
      // Initialize hourly data array
      const hourlyData: HourlyData[] = [];
      
      // Create 24 hour entries
      for (let hour = 0; hour < 24; hour++) {
        const entry: HourlyData = {
          hour: `${hour}:00`,
          Sunday: 0,
          Monday: 0,
          Tuesday: 0,
          Wednesday: 0,
          Thursday: 0,
          Friday: 0,
          Saturday: 0
        };
        hourlyData.push(entry);
      }

      // Process heatmap data
      metrics.fraudHeatmap.forEach((heatmapItem: HeatMapData) => {
        heatmapItem.data.forEach(datum => {
          const hour = datum.x;
          const dayIndex = datum.y;
          
          if (hour >= 0 && hour < 24 && dayIndex >= 0 && dayIndex < 7) {
            const dayName = DAY_NAMES[dayIndex];
            hourlyData[hour][dayName] = datum.value;
          }
        });
      });

      return hourlyData;
    }

    // For radar chart - aggregate by day of week
    if (viewType === 'radar') {
      // Initialize day data
      const dayData: DayData[] = DAY_NAMES.map(day => ({ day, value: 0 }));

      // Process heatmap data
      metrics.fraudHeatmap.forEach((heatmapItem: HeatMapData) => {
        heatmapItem.data.forEach(datum => {
          const dayIndex = datum.y;
          
          if (dayIndex >= 0 && dayIndex < 7) {
            dayData[dayIndex].value += datum.value;
          }
        });
      });

      return dayData;
    }

    // For stacked bar chart - aggregate into time blocks
    if (viewType === 'stacked-bar') {
      // Initialize day data with time blocks
      const dayData: TimeBlockData[] = DAY_NAMES.map(day => ({
        day,
        Morning: 0,
        Afternoon: 0,
        Evening: 0,
        Night: 0
      }));

      // Process heatmap data
      metrics.fraudHeatmap.forEach((heatmapItem: HeatMapData) => {
        heatmapItem.data.forEach(datum => {
          const hour = datum.x;
          const dayIndex = datum.y;
          const value = datum.value;
          
          if (dayIndex >= 0 && dayIndex < 7) {
            // Find which time block this hour belongs to
            for (const block of TIME_BLOCKS) {
              if (block.hours.includes(hour)) {
                dayData[dayIndex][block.name] += value;
                break;
              }
            }
          }
        });
      });

      return dayData;
    }

    return [];
  };

  const data = transformData();

  const renderVisualization = () => {
    switch (viewType) {
      case '3d-area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data as HourlyData[]}
              margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
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
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ paddingTop: 10 }}
              />
              <Area 
                type="monotone" 
                dataKey="Monday" 
                stackId="1" 
                stroke="#8884d8" 
                fill="#8884d8" 
              />
              <Area 
                type="monotone" 
                dataKey="Tuesday" 
                stackId="1" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
              />
              <Area 
                type="monotone" 
                dataKey="Wednesday" 
                stackId="1" 
                stroke="#ffc658" 
                fill="#ffc658" 
              />
              <Area 
                type="monotone" 
                dataKey="Thursday" 
                stackId="1" 
                stroke="#ff8042" 
                fill="#ff8042" 
              />
              <Area 
                type="monotone" 
                dataKey="Friday" 
                stackId="1" 
                stroke="#0088fe" 
                fill="#0088fe" 
              />
              <Area 
                type="monotone" 
                dataKey="Saturday" 
                stackId="1" 
                stroke="#00C49F" 
                fill="#00C49F" 
              />
              <Area 
                type="monotone" 
                dataKey="Sunday" 
                stackId="1" 
                stroke="#FFBB28" 
                fill="#FFBB28" 
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data as DayData[]}>
              <PolarGrid stroke="#e0e0e0" />
              <PolarAngleAxis 
                dataKey="day" 
                tick={{ fill: '#4a5568', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 'auto']} 
                tick={{ fill: '#4a5568' }}
              />
              <Radar 
                name="Fraud Activity" 
                dataKey="value" 
                stroke="#e74c3c" 
                fill="#e74c3c" 
                fillOpacity={0.6} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 8,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  border: 'none'
                }}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        );
      
      case 'stacked-bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data as TimeBlockData[]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#4a5568' }}
                tickLine={{ stroke: '#4a5568' }}
                axisLine={{ stroke: '#4a5568' }}
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
              <Legend />
              <Bar dataKey="Morning" stackId="a" fill="#3498db" />
              <Bar dataKey="Afternoon" stackId="a" fill="#2ecc71" />
              <Bar dataKey="Evening" stackId="a" fill="#f39c12" />
              <Bar dataKey="Night" stackId="a" fill="#9b59b6" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

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
            Fraud Activity Patterns
          </Typography>
          <Typography variant="body2" sx={{ color: '#4a5568' }}>
            Interactive visualization of fraud patterns by day and time
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="view-type-label">View Type</InputLabel>
          <Select
            labelId="view-type-label"
            id="view-type-select"
            value={viewType}
            label="View Type"
            onChange={handleViewChange}
            size="small"
          >
            <MenuItem value="3d-area">3D Area Chart</MenuItem>
            <MenuItem value="radar">Radar Chart</MenuItem>
            <MenuItem value="stacked-bar">Stacked Bar Chart</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ height: 350 }}>
        {renderVisualization()}
      </Box>
    </Paper>
  );
}; 