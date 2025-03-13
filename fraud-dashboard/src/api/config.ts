// API configuration
const config = {
    API_URL: process.env.NODE_ENV === 'production' 
        ? '/api'  // In production, use relative path (nginx will handle routing)
        : 'http://localhost:5001/api'  // In development, use the local backend URL
};

export default config; 