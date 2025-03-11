import { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, useTheme, Divider, Tab, Tabs, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { ResponsiveLine } from '@nivo/line';
import { MetricCard } from '../components/MetricCard';
import { PredictionForm } from '../components/PredictionForm';
import { TransactionTable } from '../components/TransactionTable';
import { fetchFraudMetrics } from '../api/fraudApi';
import { FraudMetrics } from '../types/metrics';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TimelineIcon from '@mui/icons-material/Timeline';
import TableChartIcon from '@mui/icons-material/TableChart';
import SearchIcon from '@mui/icons-material/Search';
import { LineChart } from '../components/LineChart';
import { FraudActivityVisualization } from '../components/FraudActivityVisualization';
import { AdvancedAnalytics } from '../components/AdvancedAnalytics';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const formatHour = (hour: number) => `${hour}:00`;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
      style={{ padding: '24px 0' }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `dashboard-tab-${index}`,
    'aria-controls': `dashboard-tabpanel-${index}`,
  };
}

const Dashboard = () => {
  const [metrics, setMetrics] = useState<FraudMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        const data = await fetchFraudMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ p: 4, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
          <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between' }}>
            <Typography
              variant="h4"
              component={motion.h4}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              sx={{
                color: '#1a365d',
                fontWeight: 700,
                mb: { xs: 2, md: 0 }
              }}
            >
              Fraud Detection Dashboard
            </Typography>
            
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{ 
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main,
                  height: 3,
                  borderRadius: '3px 3px 0 0'
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  minWidth: 'auto',
                  px: 2,
                  py: 1.5,
                  mr: 1,
                  color: '#4a5568',
                  '&.Mui-selected': {
                    color: theme.palette.primary.main
                  }
                }
              }}
            >
              <Tab 
                icon={<DashboardIcon />} 
                iconPosition="start" 
                label="Overview" 
                {...a11yProps(0)} 
              />
              <Tab 
                icon={<TimelineIcon />} 
                iconPosition="start" 
                label="Advanced Analytics" 
                {...a11yProps(1)} 
              />
              <Tab 
                icon={<TableChartIcon />} 
                iconPosition="start" 
                label="Transactions" 
                {...a11yProps(2)} 
              />
              <Tab 
                icon={<SearchIcon />} 
                iconPosition="start" 
                label="Prediction" 
                {...a11yProps(3)} 
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {/* Metric Cards */}
              <Grid item xs={12} md={4}>
                <motion.div variants={itemVariants}>
                  <MetricCard
                    title="Total Transactions"
                    value={metrics?.totalTransactions.toLocaleString() || 0}
                    icon="ShoppingCartIcon"
                    color="primary"
                    trend={5.2}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} md={4}>
                <motion.div variants={itemVariants}>
                  <MetricCard
                    title="Fraud Rate"
                    value={`${(metrics?.fraudRate || 0).toFixed(2)}%`}
                    icon="WarningIcon"
                    color="error"
                    trend={-2.1}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} md={4}>
                <motion.div variants={itemVariants}>
                  <MetricCard
                    title="Avg Transaction Value"
                    value={`$${(metrics?.avgTransactionValue || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`}
                    icon="AttachMoneyIcon"
                    color="success"
                    trend={3.7}
                  />
                </motion.div>
              </Grid>

              {/* Fraud Heatmap */}
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <Paper
                    sx={{
                      p: 3,
                      height: 450,
                      background: 'white',
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', fontWeight: 600 }}>
                      Fraud Activity Heatmap
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4a5568', mb: 2 }}>
                      Distribution of fraudulent transactions by day and hour
                    </Typography>
                    <Box sx={{ height: 350 }}>
                      {metrics?.fraudHeatmap && (
                        <ResponsiveHeatMap
                          data={metrics.fraudHeatmap}
                          margin={{ top: 20, right: 20, bottom: 60, left: 110 }}
                          axisTop={null}
                          axisRight={null}
                          axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: -45,
                            legend: 'Hour of Day',
                            legendPosition: 'middle',
                            legendOffset: 40,
                            format: (value) => formatHour(value as number)
                          }}
                          axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Day of Week',
                            legendPosition: 'middle',
                            legendOffset: -80,
                            format: (value) => weekDays[value as number]
                          }}
                          colors={{
                            type: 'sequential',
                            scheme: 'reds'
                          }}
                          animate={true}
                          motionConfig="gentle"
                          borderWidth={1}
                          borderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
                          enableLabels={true}
                          labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                          legends={[
                            {
                              anchor: 'bottom',
                              translateX: 0,
                              translateY: 30,
                              length: 400,
                              thickness: 8,
                              direction: 'row',
                              tickPosition: 'after',
                              tickSize: 3,
                              tickSpacing: 4,
                              tickOverlap: false,
                              title: 'Fraud Count',
                              titleAlign: 'start',
                              titleOffset: 4
                            }
                          ]}
                        />
                      )}
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>

              {/* Fraud Trends */}
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <Paper
                    sx={{
                      p: 3,
                      height: 450,
                      background: 'white',
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', fontWeight: 600 }}>
                      Fraud Trends
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4a5568', mb: 2 }}>
                      Hourly distribution of fraudulent transactions
                    </Typography>
                    <Box sx={{ height: 350 }}>
                      {metrics?.fraudByHour && (
                        <ResponsiveLine
                          data={[
                            {
                              id: 'fraud',
                              data: metrics.fraudByHour.map(d => ({
                                x: formatHour(d.hour),
                                y: d.fraud_count
                              }))
                            }
                          ]}
                          margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                          xScale={{ type: 'point' }}
                          yScale={{
                            type: 'linear',
                            min: 'auto',
                            max: 'auto',
                            stacked: false,
                            reverse: false
                          }}
                          curve="cardinal"
                          axisTop={null}
                          axisRight={null}
                          axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: -45,
                            legend: 'Hour of Day',
                            legendOffset: 45,
                            legendPosition: 'middle'
                          }}
                          axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Fraud Count',
                            legendOffset: -40,
                            legendPosition: 'middle'
                          }}
                          enablePoints={true}
                          pointSize={8}
                          pointColor={{ theme: 'background' }}
                          pointBorderWidth={2}
                          pointBorderColor={{ from: 'serieColor' }}
                          pointLabelYOffset={-12}
                          enableArea={true}
                          areaOpacity={0.15}
                          useMesh={true}
                          animate={true}
                          motionConfig="gentle"
                          theme={{
                            axis: {
                              ticks: {
                                text: {
                                  fill: '#4a5568'
                                }
                              },
                              legend: {
                                text: {
                                  fill: '#2d3748',
                                  fontSize: 12
                                }
                              }
                            },
                            grid: {
                              line: {
                                stroke: '#e2e8f0',
                                strokeWidth: 1
                              }
                            },
                            crosshair: {
                              line: {
                                stroke: '#2d3748',
                                strokeWidth: 1,
                                strokeOpacity: 0.35
                              }
                            }
                          }}
                        />
                      )}
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <AdvancedAnalytics metrics={metrics} />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <TransactionTable />
                </motion.div>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <PredictionForm />
                </motion.div>
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard; 