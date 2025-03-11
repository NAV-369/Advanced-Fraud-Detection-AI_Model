import { FC } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Card,
  CardContent,
  useTheme,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveCalendar } from '@nivo/calendar';
import { FraudMetrics } from '../types/metrics';

interface AdvancedAnalyticsProps {
  metrics?: FraudMetrics | null;
}

export const AdvancedAnalytics: FC<AdvancedAnalyticsProps> = ({ metrics }) => {
  const theme = useTheme();

  // Generate sample data for fraud distribution by category
  const fraudCategoryData = [
    { id: 'Card Not Present', label: 'Card Not Present', value: 42, color: '#e74c3c' },
    { id: 'Stolen Card', label: 'Stolen Card', value: 27, color: '#f39c12' },
    { id: 'Identity Theft', label: 'Identity Theft', value: 18, color: '#3498db' },
    { id: 'Account Takeover', label: 'Account Takeover', value: 13, color: '#9b59b6' }
  ];

  // Generate sample data for fraud by merchant category
  const merchantCategoryData = [
    { category: 'Electronics', legitimate: 850, fraud: 42 },
    { category: 'Travel', legitimate: 620, fraud: 38 },
    { category: 'Retail', legitimate: 930, fraud: 25 },
    { category: 'Dining', legitimate: 540, fraud: 12 },
    { category: 'Entertainment', legitimate: 410, fraud: 18 },
    { category: 'Services', legitimate: 380, fraud: 15 }
  ];

  // Generate sample data for fraud calendar heatmap
  const today = new Date();
  const calendarData = Array.from({ length: 365 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - 365 + i);
    return {
      day: date.toISOString().slice(0, 10),
      value: Math.floor(Math.random() * 30)
    };
  });

  // Generate sample data for fraud detection performance
  const detectionPerformance = {
    accuracy: 94.7,
    precision: 92.3,
    recall: 89.5,
    f1Score: 90.9
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Key Performance Indicators */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              sx={{
                p: 3,
                background: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', fontWeight: 600 }}>
                Model Performance Metrics
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={3}>
                {Object.entries(detectionPerformance).map(([key, value]) => (
                  <Grid item xs={6} md={3} key={key}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        backgroundColor: '#f8fafc',
                        borderRadius: 2,
                        height: '100%'
                      }}
                    >
                      <CardContent>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 700, 
                            color: theme.palette.primary.main,
                            mb: 1
                          }}
                        >
                          {value}%
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#4a5568',
                            textTransform: 'capitalize'
                          }}
                        >
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </motion.div>
        </Grid>

        {/* Fraud Distribution by Category */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Paper
              sx={{
                p: 3,
                height: 400,
                background: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', fontWeight: 600 }}>
                Fraud Distribution by Category
              </Typography>
              <Typography variant="body2" sx={{ color: '#4a5568', mb: 2 }}>
                Breakdown of fraud cases by type
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsivePie
                  data={fraudCategoryData}
                  margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  colors={{ datum: 'data.color' }}
                  borderWidth={1}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                  defs={[
                    {
                      id: 'dots',
                      type: 'patternDots',
                      background: 'inherit',
                      color: 'rgba(255, 255, 255, 0.3)',
                      size: 4,
                      padding: 1,
                      stagger: true
                    },
                    {
                      id: 'lines',
                      type: 'patternLines',
                      background: 'inherit',
                      color: 'rgba(255, 255, 255, 0.3)',
                      rotation: -45,
                      lineWidth: 6,
                      spacing: 10
                    }
                  ]}
                  fill={[
                    { match: { id: 'Card Not Present' }, id: 'dots' },
                    { match: { id: 'Stolen Card' }, id: 'lines' }
                  ]}
                  legends={[
                    {
                      anchor: 'bottom',
                      direction: 'row',
                      justify: false,
                      translateX: 0,
                      translateY: 30,
                      itemsSpacing: 0,
                      itemWidth: 100,
                      itemHeight: 18,
                      itemTextColor: '#999',
                      itemDirection: 'left-to-right',
                      itemOpacity: 1,
                      symbolSize: 18,
                      symbolShape: 'circle'
                    }
                  ]}
                />
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Fraud by Merchant Category */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper
              sx={{
                p: 3,
                height: 400,
                background: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', fontWeight: 600 }}>
                Fraud by Merchant Category
              </Typography>
              <Typography variant="body2" sx={{ color: '#4a5568', mb: 2 }}>
                Comparison of legitimate vs. fraudulent transactions by merchant category
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveBar
                  data={merchantCategoryData}
                  keys={['legitimate', 'fraud']}
                  indexBy="category"
                  margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                  padding={0.3}
                  groupMode="grouped"
                  valueScale={{ type: 'linear' }}
                  indexScale={{ type: 'band', round: true }}
                  colors={['#3498db', '#e74c3c']}
                  borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    legend: 'Merchant Category',
                    legendPosition: 'middle',
                    legendOffset: 40
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Transaction Count',
                    legendPosition: 'middle',
                    legendOffset: -50
                  }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                  legends={[
                    {
                      dataFrom: 'keys',
                      anchor: 'bottom',
                      direction: 'row',
                      justify: false,
                      translateX: 0,
                      translateY: 40,
                      itemsSpacing: 2,
                      itemWidth: 100,
                      itemHeight: 20,
                      itemDirection: 'left-to-right',
                      itemOpacity: 0.85,
                      symbolSize: 20,
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemOpacity: 1
                          }
                        }
                      ]
                    }
                  ]}
                  animate={true}
                />
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Fraud Calendar Heatmap */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Paper
              sx={{
                p: 3,
                height: 300,
                background: 'white',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', fontWeight: 600 }}>
                Fraud Activity Calendar
              </Typography>
              <Typography variant="body2" sx={{ color: '#4a5568', mb: 2 }}>
                Annual view of fraud activity patterns
              </Typography>
              <Box sx={{ height: 200 }}>
                <ResponsiveCalendar
                  data={calendarData}
                  from={calendarData[0].day}
                  to={calendarData[calendarData.length - 1].day}
                  emptyColor="#eeeeee"
                  colors={['#f7e9a8', '#f7d770', '#f7c325', '#e8a838', '#e67c32']}
                  margin={{ top: 20, right: 40, bottom: 0, left: 40 }}
                  yearSpacing={40}
                  monthBorderColor="#ffffff"
                  dayBorderWidth={2}
                  dayBorderColor="#ffffff"
                  legends={[
                    {
                      anchor: 'bottom-right',
                      direction: 'row',
                      translateY: 36,
                      itemCount: 5,
                      itemWidth: 42,
                      itemHeight: 36,
                      itemsSpacing: 14,
                      itemDirection: 'right-to-left'
                    }
                  ]}
                />
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}; 