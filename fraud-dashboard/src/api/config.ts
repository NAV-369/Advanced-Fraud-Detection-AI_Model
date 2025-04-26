// API configuration
const config = {
    API_URL: process.env.NODE_ENV === 'production' 
        ? 'https://fraud-detection-api.onrender.com'  // Your deployed backend URL
        : 'http://localhost:5003',  // Use port 5003 as in the backend
    USE_REAL_DATA: true  // Always use real data
};

export const endpoints = {
    metrics: `${config.API_URL}/metrics`,
    transactions: `${config.API_URL}/transactions`,
    predict: `${config.API_URL}/predict`,
    health: `${config.API_URL}/health`,
    login: `${config.API_URL}/auth/login`,
    register: `${config.API_URL}/auth/register`
};

export default config; 