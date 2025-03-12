import { FC } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';

export const AdvancedAnalytics: FC = () => {
  // Performance metrics
  const metrics = [
    { label: 'Accuracy', value: '94.7%', color: '#4caf50' },
    { label: 'Precision', value: '92.3%', color: '#2196f3' },
    { label: 'Recall', value: '89.5%', color: '#ff9800' },
    { label: 'F1 Score', value: '90.9%', color: '#9c27b0' }
  ];

  // Sample data for fraud distribution
  const fraudDistribution = [
    { id: 'Card Not Present', value: 42 },
    { id: 'Stolen Card', value: 27 },
    { id: 'Identity Theft', value: 18 },
    { id: 'Account Takeover', value: 13 }
  ];

  // Sample data for merchant categories
  const merchantCategories = [
    { category: 'Electronics', legitimate: 850, fraudulent: 42 },
    { category: 'Travel', legitimate: 620, fraudulent: 38 },
    { category: 'Retail', legitimate: 930, fraudulent: 25 },
    { category: 'Dining', legitimate: 540, fraudulent: 12 }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 4, color: '#1a365d', fontWeight: 600 }}>
        Advanced Analytics Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Performance Metrics */}
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ p: 2, height: '100%' }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: metric.color, fontWeight: 700 }}>
                  {metric.value}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {metric.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Fraud Distribution Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Fraud Distribution by Type
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsivePie
                data={fraudDistribution}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ scheme: 'set3' }}
                borderWidth={1}
                borderColor={{
                  from: 'color',
                  modifiers: [['darker', 0.2]]
                }}
                enableArcLinkLabels={true}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: 'color',
                  modifiers: [['darker', 2]]
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Merchant Category Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Transactions by Merchant Category
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveBar
                data={merchantCategories}
                keys={['legitimate', 'fraudulent']}
                indexBy="category"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                groupMode="grouped"
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={['#3498db', '#e74c3c']}
                borderColor={{
                  from: 'color',
                  modifiers: [['darker', 1.6]]
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                legends={[
                  {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20
                  }
                ]}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}; 