const { backendLogger } = require('../utils/logger');

const loggerMiddleware = (req, res, next) => {
  const startTime = Date.now();

  // Skip logging for log endpoint to avoid infinite loops
  if (req.path === '/api/logs/frontend') {
    return next();
  }

  // Log request
  backendLogger.log('API Request:', {
    method: req.method,
    url: req.originalUrl || req.url,
    path: req.path,
    query: req.query,
    params: req.params,
    body: req.body,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
  });

  // Capture response
  const originalSend = res.send;
  res.send = function (data) {
    // Skip logging for log endpoint
    if (req.path !== '/api/logs/frontend') {
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Log response
      backendLogger.log('API Response:', {
        method: req.method,
        url: req.originalUrl || req.url,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        responseSize: data ? JSON.stringify(data).length : 0,
      });
    }

    // Call original send
    return originalSend.call(this, data);
  };

  next();
};

module.exports = loggerMiddleware;

