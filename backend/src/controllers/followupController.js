const { pool } = require("../config/db");

const addFollowup = async (req, res) => {

    try {
        const { lead_id, followup_date, notes } = req.body;

        if (!lead_id || !followup_date) {
      return res.status(400).json({
        message: "lead_id and followup_date are required",
      });
    };

    const sql = `
      UPDATE leads 
      SET followup_date = ?, notes = ?, status = 'PENDING'
      WHERE id = ?
    `;

        await pool.execute(sql, [followup_date, notes || null, lead_id]);

        res.status(201).json({
      message: "Follow-up added successfully",
    });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({message: "Server error"});
    }
};


updateFollowupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status, followup_date, notes } = req.body;
    
    // Build dynamic SQL based on what's provided
    const updates = [];
    const values = [];

    if (status !== undefined) {
      status = status.toUpperCase();
      const allowedStatuses = ["PENDING", "COMPLETED", "MISSED"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status. Allowed: PENDING, COMPLETED, MISSED",
        });
      }
      updates.push("status = ?");
      values.push(status);
    }

    if (followup_date !== undefined) {
      updates.push("followup_date = ?");
      values.push(followup_date || null);
    }

    if (notes !== undefined) {
      updates.push("notes = ?");
      values.push(notes || null);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(id);

    const sql = `
      UPDATE leads
      SET ${updates.join(", ")}
      WHERE id = ?
    `;

    const [result] = await pool.execute(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.json({
      message: `Follow-up updated successfully`,
    });
  } catch (error) {
    console.error("Update followup status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getTodayFollowups = async (req, res ) => {
    try {
    const sql = `
      SELECT id, name, email, phone, source, followup_date, notes, status, created_at
      FROM leads
      WHERE followup_date = CURDATE()
      ORDER BY followup_date ASC
    `;

    const [rows] = await pool.execute(sql);
    res.json(rows);
  } catch (error) {
    console.error("Today followups error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUpcomingFollowups = async (req, res ) => {
    try {
    const sql = `
      SELECT id, name, email, phone, source, followup_date, notes, status, created_at
      FROM leads
      WHERE followup_date > CURDATE()
      ORDER BY followup_date ASC
    `;

    const [rows] = await pool.execute(sql);
    res.json(rows);
  } catch (error) {
    console.error("Upcoming followups error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMissedFollowups = async (req, res) => {
  try {
    const sql = `
      SELECT id, name, email, phone, source, followup_date, notes, status, created_at
      FROM leads
      WHERE followup_date < CURDATE()
        AND status = 'PENDING'
      ORDER BY followup_date DESC
    `;

    const [rows] = await pool.execute(sql);
    res.json(rows);
  } catch (error) {
    console.error("Missed followups error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addFollowup,updateFollowupStatus, getTodayFollowups, getUpcomingFollowups, getMissedFollowups};