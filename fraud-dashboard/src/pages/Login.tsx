import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import axios from 'axios';
import { endpoints } from '../api/config';
import { auth } from '../api/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'firebase' | 'custom'>('custom');
  const navigate = useNavigate();

  const handleTabChange = (_: React.SyntheticEvent, newValue: 'firebase' | 'custom') => {
    setAuthMethod(newValue);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authMethod === 'firebase') {
        // Firebase authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify({
          email: user.email,
          uid: user.uid,
          role: 'user' // Default role for Firebase users
        }));
        
        // Store token
        const token = await user.getIdToken();
        localStorage.setItem('token', token);
      } else {
        // Custom backend authentication
        const response = await axios.post(endpoints.login, {
          email,
          password
        });

        // Store token and user info in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      // Redirect to dashboard
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      if (authMethod === 'firebase') {
        // Handle Firebase specific errors
        const errorCode = err.code;
        switch (errorCode) {
          case 'auth/invalid-credential':
            setError('Invalid email or password. Please try again.');
            break;
          case 'auth/user-not-found':
            setError('No user found with this email.');
            break;
          case 'auth/wrong-password':
            setError('Incorrect password.');
            break;
          default:
            setError('Authentication failed. Please try again.');
        }
      } else {
        // Handle custom backend errors
        setError(err.response?.data?.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%', 
            borderRadius: 2,
            background: 'linear-gradient(to right bottom, #ffffff, #f8fafc)'
          }}
        >
          <Typography component="h1" variant="h4" align="center" sx={{ mb: 3, fontWeight: 700, color: '#1976d2' }}>
            Fraud Detection Dashboard
          </Typography>
          
          <Typography component="h2" variant="h5" align="center" sx={{ mb: 3, fontWeight: 600 }}>
            Login
          </Typography>
          
          <Tabs
            value={authMethod}
            onChange={handleTabChange}
            centered
            sx={{ mb: 3 }}
          >
            <Tab value="custom" label="API Login" />
            <Tab value="firebase" label="Firebase Login" />
          </Tabs>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                py: 1.5, 
                mt: 2, 
                mb: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1565c0, #1976d2)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Demo credentials:
              </Typography>
              {authMethod === 'custom' ? (
                <>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                    Email: admin@fraud-detection.com
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                    Password: admin123
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                    Email: user@example.com
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                    Password: password123
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 