const { pool } = require("../config/db");

const markMissedFollowups = async () => {
  const [result] = await pool.execute(`
    UPDATE leads
    SET status = 'MISSED'
    WHERE followup_date < CURDATE()
      AND status = 'PENDING'
  `);

  return result.affectedRows;
};

module.exports = { markMissedFollowups };
