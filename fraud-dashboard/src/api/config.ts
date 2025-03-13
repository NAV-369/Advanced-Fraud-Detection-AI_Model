// API configuration
const config = {
    API_URL: process.env.NODE_ENV === 'production' 
        ? 'https://fraud-detection-api.onrender.com'  // Your deployed backend URL
        : 'http://localhost:5000'
};

export const endpoints = {
    metrics: `${config.API_URL}/metrics`,
    predict: `${config.API_URL}/predict`,
    health: `${config.API_URL}/health`,
    login: `${config.API_URL}/auth/login`,
    register: `${config.API_URL}/auth/register`
};

export default config; 