const { pool } = require("../config/db");
const { backendLogger } = require('../utils/logger');

exports.getDashboardSummary = async (req, res) => {
  try {
    backendLogger.log("Fetching dashboard summary");
    
    const [results] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM leads) AS totalLeads,

        (SELECT COUNT(*) 
         FROM leads 
         WHERE followup_date = CURDATE()
        ) AS todayFollowups,

        (SELECT COUNT(*) 
         FROM leads 
         WHERE followup_date > CURDATE()
        ) AS upcomingFollowups,

        (SELECT COUNT(*) 
         FROM leads 
         WHERE followup_date < CURDATE()
           AND status = 'PENDING'
        ) AS missedFollowups
    `);

    const result = results[0];
    
    const summary = {
      totalLeads: parseInt(result.totalLeads) || 0,
      todayFollowups: parseInt(result.todayFollowups) || 0,
      upcomingFollowups: parseInt(result.upcomingFollowups) || 0,
      missedFollowups: parseInt(result.missedFollowups) || 0,
    };
    
    backendLogger.log("Dashboard summary retrieved:", summary);
    
    // Ensure all counts are numbers
    res.json(summary);
  } catch (error) {
    backendLogger.error('Dashboard summary error:', error);
    res.status(500).json({ message: "Server error" });
  }
};
