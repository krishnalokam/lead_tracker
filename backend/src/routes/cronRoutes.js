const express = require("express");
const router = express.Router();
const { markMissedFollowups } = require("../service/markMissedService");
const { backendLogger } = require('../utils/logger');

// POST /api/cron/mark-missed
router.post("/mark-missed", async (req, res) => {
  try {
    backendLogger.log("Manual trigger: Marking missed followups");
    
    const count = await markMissedFollowups();
    
    backendLogger.log(`Marked ${count} followups as MISSED`);
    res.json({ marked: count });
  } catch (error) {
    backendLogger.error('Mark missed followups error:', error);
    res.status(500).json({ message: "markMissedFollowups execution failed" });
  }
});

module.exports = router;
