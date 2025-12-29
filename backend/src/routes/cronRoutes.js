const express = require("express");
const router = express.Router();
const { markMissedFollowups } = require("../service/markMissedService")

// POST /api/cron/mark-missed
router.post("/mark-missed", async (req, res) => {
  try {
    const count = await markMissedFollowups();
    res.json({ marked: count });
  } catch (error) {
    res.status(500).json({ message: "markMissedFollowups execution failed" });
  }
});

module.exports = router;
