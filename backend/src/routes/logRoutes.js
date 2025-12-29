const express = require('express');
const router = express.Router();
const { frontendLogger, backendLogger, ENABLE_FRONTEND_LOGGING } = require('../utils/logger');

// POST /api/logs/frontend
router.post('/frontend', (req, res) => {
  try {
    // Check if frontend logging is enabled
    if (!ENABLE_FRONTEND_LOGGING) {
      return res.json({ success: true, message: 'Frontend logging is disabled' });
    }
    
    const { message, timestamp, data, error } = req.body;
    
    if (message) {
      frontendLogger.log(message, data || error || null);
    }
    
    res.json({ success: true });
  } catch (error) {
    backendLogger.error('Error writing frontend log:', error);
    res.status(500).json({ success: false, message: 'Failed to write log' });
  }
});

module.exports = router;

