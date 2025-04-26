import { FC, useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress, 
  Slider,
  Grid,
  Divider,
  Alert,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { predictFraud } from '../api/fraudApi';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import React from 'react';

// Sample feature names - replace with your actual model features
const featureNames = [
  'transaction_amount',
  'hour_of_day',
  'day_of_week',
  'customer_age',
  'account_age_days'
] as const;

type FeatureName = typeof featureNames[number];

// Sample default values - replace with reasonable defaults for your model
const defaultValues: Record<FeatureName, number> = {
  'transaction_amount': 100,
  'hour_of_day': 12,
  'day_of_week': 3,
  'customer_age': 35,
  'account_age_days': 180
};

// Sample min/max values - replace with appropriate ranges for your model
const featureRanges: Record<FeatureName, { min: number; max: number; step: number }> = {
  'transaction_amount': { min: 1, max: 1000, step: 1 },
  'hour_of_day': { min: 0, max: 23, step: 1 },
  'day_of_week': { min: 0, max: 6, step: 1 },
  'customer_age': { min: 18, max: 100, step: 1 },
  'account_age_days': { min: 1, max: 3650, step: 1 }
};

const getRiskLevel = (probability: number) => {
  if (probability > 0.7) return { level: 'High Risk', color: '#d32f2f', icon: WarningIcon };
  if (probability > 0.3) return { level: 'Medium Risk', color: '#ed6c02', icon: InfoIcon };
  return { level: 'Low Risk', color: '#2e7d32', icon: CheckCircleIcon };
};

export const PredictionForm: FC = () => {
  const [features, setFeatures] = useState<Record<FeatureName, number>>(defaultValues);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    fraudProbability: number;
    confidence: number;
    isAlert: boolean;
    using_mock?: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (feature: FeatureName, value: number) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Convert features object to array in the correct order
      const featureArray = featureNames.map(name => features[name]);
      const prediction = await predictFraud(featureArray);
      setResult(prediction);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = () => {
    if (!result) return '#1976d2';
    return getRiskLevel(result.fraudProbability).color;
  };

  return (
    <Paper
      sx={{
        p: 3,
        height: 'auto',
        minHeight: '100%',
        background: 'white',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        overflow: 'visible'
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Fraud Risk Predictor</span>
        {result?.using_mock && (
          <Chip
            label="Using Deterministic Model"
            size="small"
            sx={{ 
              bgcolor: 'rgba(25, 118, 210, 0.1)', 
              color: '#1976d2',
              fontSize: '0.7rem'
            }}
          />
        )}
      </Typography>
      <Typography variant="body2" sx={{ color: '#4a5568', mb: 3 }}>
        Enter transaction details to predict fraud risk
      </Typography>

      <Grid container spacing={3}>
        {/* Prediction Result - Now on the left */}
        <Grid item xs={12} md={5}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              pr: { xs: 0, md: 0 },
              pl: { xs: 0, md: 2 },
              pt: { xs: 0, md: 0 },
              pb: { xs: 3, md: 0 },
              position: 'relative',
              overflow: 'hidden',
              background: '#121212',
              borderRadius: 2,
              p: 3,
              mb: { xs: 2, md: 0 }
            }}
          >
            {result ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                style={{ 
                  width: '100%', 
                  textAlign: 'center',
                  maxHeight: '100%',
                  overflowY: 'auto'
                }}
              >
                <Box 
                  sx={{ 
                    position: 'relative', 
                    width: { xs: 170, sm: 200 },
                    height: { xs: 170, sm: 200 },
                    margin: '0 auto', 
                    mb: 3,
                    ml: { xs: 0, md: -2 }
                  }}
                >
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size="100%"
                    thickness={5}
                    sx={{ color: 'rgba(255, 255, 255, 0.2)', position: 'absolute' }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={result.fraudProbability * 100}
                    size="100%"
                    thickness={5}
                    sx={{ 
                      color: getResultColor(),
                      position: 'absolute',
                      transition: 'all 0.5s ease-in-out'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 700, 
                        color: getResultColor(),
                        fontSize: { xs: '2rem', sm: '2.5rem' }
                      }}
                    >
                      {Math.round(result.fraudProbability * 100)}%
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      }}
                    >
                      Fraud Risk
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Chip
                    icon={React.createElement(getRiskLevel(result.fraudProbability).icon)}
                    label={getRiskLevel(result.fraudProbability).level}
                    sx={{
                      bgcolor: `${getResultColor()}30`,
                      color: getResultColor(),
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      padding: '5px 0'
                    }}
                  />
                </Box>

                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    mb: 1
                  }}
                >
                  Confidence Score: {Math.round(result.confidence * 100)}%
                </Typography>
              </motion.div>
            ) : (
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
                Adjust the sliders and click "Predict Fraud Risk" to get a risk assessment
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Divider - only on desktop */}
        <Grid item xs={12} md={7} sx={{ display: 'flex' }}>
          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, mr: 3 }} />
          
          {/* Form Controls - Now on the right */}
          <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 3 }}>
              {featureNames.map(feature => (
                <Box key={feature} sx={{ mb: 2 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 1, 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      color: '#4a5568',
                      fontWeight: 500
                    }}
                  >
                    <span>{feature.replace(/_/g, ' ')}</span>
                    <span>{features[feature]}</span>
                  </Typography>
                  <Slider
                    value={features[feature]}
                    onChange={(_, value) => handleChange(feature, value as number)}
                    min={featureRanges[feature].min}
                    max={featureRanges[feature].max}
                    step={featureRanges[feature].step}
                    sx={{
                      '& .MuiSlider-thumb': {
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.2)'
                        }
                      }
                    }}
                  />
                </Box>
              ))}
            </Box>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              fullWidth
              sx={{
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1565c0, #1976d2)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Predict Fraud Risk'}
            </Button>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            
            {result && (
              <Box 
                sx={{ 
                  mt: 2, 
                  p: 2, 
                  bgcolor: '#f8fafc', 
                  borderRadius: 2,
                  mx: 'auto',
                  maxWidth: '100%'
                }}
              >
                <Typography variant="body2" sx={{ color: '#4a5568', mb: 1, fontWeight: 600 }}>
                  Risk Factors:
                </Typography>
                <Typography variant="body2" sx={{ color: '#4a5568', mb: 1 }}>
                  • Transaction Amount: ${features.transaction_amount}
                </Typography>
                <Typography variant="body2" sx={{ color: '#4a5568', mb: 1 }}>
                  • Time: {features.hour_of_day}:00
                </Typography>
                <Typography variant="body2" sx={{ color: '#4a5568', mb: 1 }}>
                  • Day: {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][features.day_of_week]}
                </Typography>
                <Typography variant="body2" sx={{ color: '#4a5568' }}>
                  • Account Age: {features.account_age_days} days
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}; 