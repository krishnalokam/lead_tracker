const express = require('express');
const router = express.Router();

const { addFollowup,updateFollowupStatus, getTodayFollowups, getUpcomingFollowups, getMissedFollowups} = require('../controllers/followupController');
 
router.post("/", addFollowup);

router.put("/:id/status", updateFollowupStatus);

router.get("/today", getTodayFollowups);

router.get("/upcoming", getUpcomingFollowups);

router.get("/missed", getMissedFollowups);

module.exports = router;