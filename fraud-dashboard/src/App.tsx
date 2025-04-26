import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  IconButton,
  Divider,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Paper
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Dashboard from './pages/Dashboard';

// Mock data for demo mode when API is unavailable
const MOCK_DATA = {
  totalTransactions: 1205,
  fraudRate: 2.4,
  avgTransactionValue: 149.87,
  fraudByHour: [
    {hour: 0, fraud_count: 12},
    {hour: 1, fraud_count: 15},
    {hour: 2, fraud_count: 18},
    {hour: 3, fraud_count: 22},
    {hour: 4, fraud_count: 15},
    {hour: 5, fraud_count: 10},
    {hour: 6, fraud_count: 5},
    {hour: 7, fraud_count: 3},
    {hour: 8, fraud_count: 2},
    {hour: 9, fraud_count: 1},
    {hour: 10, fraud_count: 1},
    {hour: 11, fraud_count: 2},
    {hour: 12, fraud_count: 3},
    {hour: 13, fraud_count: 2},
    {hour: 14, fraud_count: 4},
    {hour: 15, fraud_count: 5},
    {hour: 16, fraud_count: 6},
    {hour: 17, fraud_count: 7},
    {hour: 18, fraud_count: 8},
    {hour: 19, fraud_count: 10},
    {hour: 20, fraud_count: 12},
    {hour: 21, fraud_count: 14},
    {hour: 22, fraud_count: 18},
    {hour: 23, fraud_count: 15}
  ],
  transactions: [
    { id: 1, amount: 316.82, time: 3.23, isFraud: true, merchant: "Koepp-Parker", category: "grocery_pos" },
    { id: 2, amount: 45.19, time: 14.22, isFraud: false, merchant: "Smith-Jones", category: "grocery_pos" },
    { id: 3, amount: 78.82, time: 12.11, isFraud: false, merchant: "Local Grocery", category: "grocery_pos" },
    { id: 4, amount: 290.14, time: 19.42, isFraud: true, merchant: "Tech Gadgets", category: "electronics" },
    { id: 5, amount: 53.24, time: 10.08, isFraud: false, merchant: "Coffee Shop", category: "food" }
  ]
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f8fafc',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Create a demo dashboard component
const DemoDashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Alert severity="warning" sx={{ mb: 3 }}>
        DEMO MODE: The backend API is currently unavailable. Showing sample data.
      </Alert>
      
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#1a365d' }}>
        Fraud Detection Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Total Transactions
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
              {MOCK_DATA.totalTransactions}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Last 30 days
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Fraud Rate
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1, color: '#f44336' }}>
              {MOCK_DATA.fraudRate}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Flagged transactions
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Avg Transaction Value
            </Typography>
            <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
              ${MOCK_DATA.avgTransactionValue}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Across all transactions
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Recent Transactions
      </Typography>
      
      <Grid container spacing={2}>
        {MOCK_DATA.transactions.map((transaction) => (
          <Grid item xs={12} key={transaction.id}>
            <Paper 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                borderLeft: transaction.isFraud ? '4px solid #f44336' : '4px solid #4caf50'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 1, sm: 0 } }}>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle1" component="div" fontWeight="bold">
                    {transaction.merchant}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {transaction.category} • {transaction.time}:00
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography 
                  variant="h6" 
                  component="div"
                  sx={{ 
                    fontWeight: 'bold',
                    color: transaction.isFraud ? '#f44336' : 'inherit',
                    mr: 2
                  }}
                >
                  ${transaction.amount}
                </Typography>
                <Typography 
                  variant="body2" 
                  component="span"
                  sx={{ 
                    py: 0.5, 
                    px: 1.5, 
                    borderRadius: 1,
                    bgcolor: transaction.isFraud ? '#ffebee' : '#e8f5e9',
                    color: transaction.isFraud ? '#d32f2f' : '#2e7d32',
                    fontWeight: 'medium'
                  }}
                >
                  {transaction.isFraud ? 'Fraud Alert' : 'Legitimate'}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Backend API Status
        </Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          API Endpoint Unreachable: https://advanced-fraud-detection-ai-model-3.onrender.com
        </Alert>
        <Typography variant="body2" color="text.secondary">
          The fraud detection dashboard is currently running in demo mode. The data shown above is sample data and does not reflect actual transactions.
          Please check the API status or contact your administrator.
        </Typography>
      </Box>
    </Box>
  );
};

function MainContent() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if API is available
    const checkApiStatus = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL || "https://advanced-fraud-detection-ai-model-3.onrender.com", {
          method: 'GET',
          mode: 'no-cors',
          headers: {
            'Accept': 'application/json',
          },
          timeout: 5000
        });
        setApiAvailable(true);
      } catch (error) {
        console.error("API is not available:", error);
        setApiAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    checkApiStatus();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          Fraud Detection
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flex: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/"
            selected={location.pathname === '/'}
            sx={{
              '&.active': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              }
            }}
          >
            <ListItemIcon>
              <DashboardIcon color={location.pathname === '/' ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText 
              primary="Dashboard" 
              primaryTypographyProps={{ 
                fontWeight: location.pathname === '/' ? 700 : 400,
                color: location.pathname === '/' ? 'primary' : 'inherit'
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: `240px` },
          boxShadow: 'none',
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: '#1a365d' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ color: '#1a365d', fontWeight: 600 }}>
            Fraud Detection Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          mt: { xs: 7, sm: 8 },
          backgroundColor: '#f8fafc',
          minHeight: '100vh'
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Routes>
            <Route path="/" element={apiAvailable ? <Dashboard /> : <DemoDashboard />} />
            <Route path="*" element={apiAvailable ? <Dashboard /> : <DemoDashboard />} />
          </Routes>
        )}
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <MainContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
