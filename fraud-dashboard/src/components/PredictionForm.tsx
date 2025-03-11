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
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { predictFraud } from '../api/fraudApi';

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

export const PredictionForm: FC = () => {
  const [features, setFeatures] = useState<Record<FeatureName, number>>(defaultValues);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    fraudProbability: number;
    confidence: number;
    isAlert: boolean;
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
    return result.fraudProbability > 0.7 
      ? '#d32f2f' 
      : result.fraudProbability > 0.3 
        ? '#ed6c02' 
        : '#2e7d32';
  };

  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        background: 'white',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden'
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: '#1a365d', fontWeight: 600 }}>
        Fraud Risk Predictor
      </Typography>
      <Typography variant="body2" sx={{ color: '#4a5568', mb: 3 }}>
        Enter transaction details to predict fraud risk
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
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
        </Grid>

        <Grid item xs={12} md={5}>
          <Divider orientation="vertical" sx={{ display: { xs: 'none', md: 'block' } }} />
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              pl: { xs: 0, md: 3 },
              pt: { xs: 3, md: 0 }
            }}
          >
            {result ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                style={{ width: '100%', textAlign: 'center' }}
              >
                <Box 
                  sx={{ 
                    position: 'relative', 
                    width: 200, 
                    height: 200, 
                    margin: '0 auto',
                    mb: 2
                  }}
                >
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={200}
                    thickness={4}
                    sx={{ color: '#e0e0e0', position: 'absolute' }}
                  />
                  <CircularProgress
                    variant="determinate"
                    value={result.fraudProbability * 100}
                    size={200}
                    thickness={4}
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
                    <Typography variant="h4" sx={{ fontWeight: 700, color: getResultColor() }}>
                      {Math.round(result.fraudProbability * 100)}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4a5568' }}>
                      Fraud Risk
                    </Typography>
                  </Box>
                </Box>

                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: getResultColor(),
                    mb: 1
                  }}
                >
                  {result.isAlert ? 'High Risk Transaction' : 'Low Risk Transaction'}
                </Typography>
                
                <Typography variant="body2" sx={{ color: '#4a5568' }}>
                  Confidence: {Math.round(result.confidence * 100)}%
                </Typography>
              </motion.div>
            ) : (
              <Box sx={{ textAlign: 'center', color: '#718096' }}>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                  No prediction yet
                </Typography>
                <Typography variant="body2">
                  Adjust the sliders and click "Predict" to see the fraud risk assessment
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}; 