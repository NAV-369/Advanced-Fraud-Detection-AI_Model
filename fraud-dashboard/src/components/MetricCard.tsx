import { FC } from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { MetricCardProps } from '../types/metrics';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningIcon from '@mui/icons-material/Warning';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const iconMap = {
  'ShoppingCartIcon': ShoppingCartIcon,
  'WarningIcon': WarningIcon,
  'AttachMoneyIcon': AttachMoneyIcon
};

const colorMap = {
  primary: {
    gradient: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
    shadow: '0 4px 20px rgba(52, 152, 219, 0.3)'
  },
  error: {
    gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
    shadow: '0 4px 20px rgba(231, 76, 60, 0.3)'
  },
  warning: {
    gradient: 'linear-gradient(135deg, #f1c40f 0%, #f39c12 100%)',
    shadow: '0 4px 20px rgba(241, 196, 15, 0.3)'
  },
  success: {
    gradient: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
    shadow: '0 4px 20px rgba(46, 204, 113, 0.3)'
  }
};

export const MetricCard: FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  trend
}) => {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || ShoppingCartIcon;
  const colorStyle = colorMap[color];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 10,
        duration: 0.3
      }}
    >
      <Paper
        sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          background: colorStyle.gradient,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: colorStyle.shadow,
          backdropFilter: 'blur(10px)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.1)',
            transform: 'skewX(-15deg) translateX(-100%)',
            transition: 'transform 0.5s',
          },
          '&:hover::before': {
            transform: 'skewX(-15deg) translateX(100%)',
          }
        }}
        elevation={0}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}
        >
          <IconComponent
            sx={{
              fontSize: 40,
              filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.2))'
            }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              opacity: 0.9,
              fontWeight: 500,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              mb: 0.5
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              letterSpacing: '0.5px'
            }}
          >
            {value}
          </Typography>
          {trend !== undefined && (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5, 
                mt: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                py: 0.5,
                px: 1,
                width: 'fit-content'
              }}
            >
              {trend >= 0 ? (
                <TrendingUpIcon fontSize="small" />
              ) : (
                <TrendingDownIcon fontSize="small" />
              )}
              <Typography 
                variant="body2"
                sx={{ 
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                {Math.abs(trend)}% {trend >= 0 ? 'increase' : 'decrease'}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </motion.div>
  );
}; 