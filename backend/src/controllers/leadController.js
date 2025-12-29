const { pool } = require('../config/db');

const createLead = async (req, res ) => {
    try {
        const { name, email, phone, source } = req.body;

        if(!name || !phone) {
            return res.status(400).json({message: "Name  and phone are  required"});
        }


        const [existing] = await pool.execute(
  "SELECT id FROM leads WHERE phone = ?",
  [phone]
);

if (existing.length > 0) {
  return res.status(409).json({
    message: "Phone number already exists",
  });
}


        const sql = `
            INSERT INTO leads (name, email, phone, source ) 
            values (?, ?, ?, ?)
        `;
        const [ result ] = await pool.execute( sql, [
            name,
            email ,
            phone || null,
            source || null,
        ]);

        res.status(201).json({
            message: " Lead created successfully ",
            leadId: result.insertId,
        });



    } catch (error) {
        console.log("Lead creation error ", error.message);
        res.status(500).json({message: "Server error "});
    }
}

const getLeads = async (req, res ) => {
    try {
    const sql = `
      SELECT id, name, email, phone, source, followup_date, notes, status, created_at
      FROM leads
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.execute(sql);

    res.json(rows);
  } catch (error) {
    console.error("Get leads error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const updateLeadFollowup = async (req, res) => {
  try {
    const { id } = req.params;
    const { followup_date, notes, status } = req.body;

    // Build dynamic SQL based on what's provided
    const updates = [];
    const values = [];

    if (followup_date !== undefined) {
      updates.push("followup_date = ?");
      values.push(followup_date || null);
    }

    if (notes !== undefined) {
      updates.push("notes = ?");
      values.push(notes || null);
    }

    if (status !== undefined) {
      const upperStatus = status.toUpperCase();
      const allowedStatuses = ["PENDING", "COMPLETED", "MISSED"];
      if (!allowedStatuses.includes(upperStatus)) {
        return res.status(400).json({ 
          message: "Invalid status. Allowed: PENDING, COMPLETED, MISSED" 
        });
      }
      updates.push("status = ?");
      values.push(upperStatus);
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
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({ message: "Follow-up updated successfully" });
  } catch (error) {
    console.error("Update lead followup error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

const getDuplicateLeads = async (req, res) => {
  try {
    const { date, phone } = req.query;
    
    let sql = `
      SELECT id, name, email, phone, source, created_at
      FROM duplicate_leads
    `;
    const params = [];
    const conditions = [];

    if (date) {
      conditions.push(`DATE(created_at) = ?`);
      params.push(date);
    }

    if (phone) {
      conditions.push(`phone LIKE ?`);
      params.push(`%${phone}%`);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ` ORDER BY created_at DESC`;

    const [rows] = await pool.execute(sql, params);
    res.json(rows);
  } catch (error) {
    console.error("Get duplicate leads error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { createLead, getLeads, updateLeadFollowup, getDuplicateLeads};
