const fs = require('fs');
const path = require('path');

// Check environment variables for logging flags
// Default to 'false' if not set (backward compatible)
const ENABLE_BACKEND_LOGGING = process.env.ENABLE_BACKEND_LOGGING === 'true';
const ENABLE_FRONTEND_LOGGING = process.env.ENABLE_FRONTEND_LOGGING === 'true';

const LOG_DIR = path.join(__dirname, '../../logs');
const BACKEND_LOG_FILE = path.join(LOG_DIR, 'backend.log');
const FRONTEND_LOG_FILE = path.join(LOG_DIR, 'frontend.log');

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const writeLog = (filePath, message) => {
  try {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(filePath, logMessage, 'utf8');
  } catch (error) {
    // Fallback to console if file write fails
    console.error('Failed to write to log file:', error);
    console.log(message);
  }
};

const backendLogger = {
  log: (message, data = null) => {
    if (!ENABLE_BACKEND_LOGGING) return;
    
    const logMessage = data 
      ? `[BACKEND] ${message} ${JSON.stringify(data)}`
      : `[BACKEND] ${message}`;
    writeLog(BACKEND_LOG_FILE, logMessage);
  },
  error: (message, error = null) => {
    if (!ENABLE_BACKEND_LOGGING) return;
    
    const logMessage = error
      ? `[BACKEND] ERROR: ${message} ${error instanceof Error ? error.stack : JSON.stringify(error)}`
      : `[BACKEND] ERROR: ${message}`;
    writeLog(BACKEND_LOG_FILE, logMessage);
  }
};

const frontendLogger = {
  log: (message, data = null) => {
    if (!ENABLE_FRONTEND_LOGGING) return;
    
    const logMessage = data 
      ? `[FRONTEND] ${message} ${JSON.stringify(data)}`
      : `[FRONTEND] ${message}`;
    writeLog(FRONTEND_LOG_FILE, logMessage);
  },
  error: (message, error = null) => {
    if (!ENABLE_FRONTEND_LOGGING) return;
    
    const logMessage = error
      ? `[FRONTEND] ERROR: ${message} ${error instanceof Error ? error.stack : JSON.stringify(error)}`
      : `[FRONTEND] ERROR: ${message}`;
    writeLog(FRONTEND_LOG_FILE, logMessage);
  }
};

module.exports = { backendLogger, frontendLogger, ENABLE_FRONTEND_LOGGING };

