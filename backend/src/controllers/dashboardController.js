const { pool } = require("../config/db");

exports.getDashboardSummary = async (req, res) => {
  try {
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
    
    // Ensure all counts are numbers
    res.json({
      totalLeads: parseInt(result.totalLeads) || 0,
      todayFollowups: parseInt(result.todayFollowups) || 0,
      upcomingFollowups: parseInt(result.upcomingFollowups) || 0,
      missedFollowups: parseInt(result.missedFollowups) || 0,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
