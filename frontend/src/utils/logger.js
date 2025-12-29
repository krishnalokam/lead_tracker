import axios from "axios"; // Use base axios, not axiosInstance

// Check environment variable for frontend logging
// Vite exposes env variables prefixed with VITE_ to the client
// Default to 'false' if not set (backward compatible)
const ENABLE_FRONTEND_LOGGING = import.meta.env.VITE_ENABLE_FRONTEND_LOGGING === 'true';

// Create a separate axios instance without interceptors for logging
// This prevents circular logging when the logger tries to log its own requests
const logAxios = axios.create({
  baseURL: "http://localhost:5002/api",
});

const logger = {
  log: (message, data = null) => {
    // Skip logging if disabled
    if (!ENABLE_FRONTEND_LOGGING) return;
    
    const timestamp = new Date().toISOString();
    const logMessage = data 
      ? `[FRONTEND] ${message} ${JSON.stringify(data)}`
      : `[FRONTEND] ${message}`;
    
    // Use logAxios instead of axiosInstance to avoid circular logging
    logAxios.post('/logs/frontend', {
      message: logMessage,
      timestamp,
      data: data || null
    }).catch(err => {
      // Fallback to console if backend is unavailable
      console.log(`[${timestamp}] ${logMessage}`);
    });
  },
  
  error: (message, error = null) => {
    // Skip logging if disabled
    if (!ENABLE_FRONTEND_LOGGING) return;
    
    const timestamp = new Date().toISOString();
    const logMessage = error
      ? `[FRONTEND] ERROR: ${message} ${error instanceof Error ? error.message : JSON.stringify(error)}`
      : `[FRONTEND] ERROR: ${message}`;
    
    // Use logAxios instead of axiosInstance to avoid circular logging
    logAxios.post('/logs/frontend', {
      message: logMessage,
      timestamp,
      error: error ? (error instanceof Error ? error.message : error) : null
    }).catch(err => {
      // Fallback to console if backend is unavailable
      console.error(`[${timestamp}] ${logMessage}`);
    });
  }
};

export default logger;

