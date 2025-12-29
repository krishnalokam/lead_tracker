const express = require('express');
const router = express.Router();

const { createLead, getLeads, updateLeadFollowup, getDuplicateLeads } = require('../controllers/leadController')

router.post("/", createLead);
router.get("/", getLeads);
router.get("/duplicates", getDuplicateLeads);
router.put("/:id/followup", updateLeadFollowup);

module.exports = router;