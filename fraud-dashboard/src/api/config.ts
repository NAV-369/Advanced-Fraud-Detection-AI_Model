// API configuration
const config = {
    API_URL: process.env.NODE_ENV === 'production' 
        ? 'https://fraud-detection-api.onrender.com'  // Replace with your actual Render backend URL
        : 'http://localhost:5000'
};

export const endpoints = {
    metrics: `${config.API_URL}/metrics`,
    predict: `${config.API_URL}/predict`,
    health: `${config.API_URL}/health`
};

export default config; 