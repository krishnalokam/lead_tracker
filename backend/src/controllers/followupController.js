const { pool } = require("../config/db");
const { backendLogger } = require('../utils/logger');

const addFollowup = async (req, res) => {

    try {
        const { lead_id, followup_date, notes } = req.body;
        
        backendLogger.log(`Adding followup for lead ID ${lead_id}:`, { followup_date, notes });

        if (!lead_id || !followup_date) {
      backendLogger.log('Validation failed: lead_id and followup_date are required');
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

        backendLogger.log(`Follow-up added successfully for lead ID ${lead_id}`);
        res.status(201).json({
      message: "Follow-up added successfully",
    });

    } catch (err) {
        backendLogger.error('Add followup error:', err);
        res.status(500).json({message: "Server error"});
    }
};


updateFollowupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status, followup_date, notes } = req.body;
    
    backendLogger.log(`Updating followup status for ID ${id}:`, { status, followup_date, notes });
    
    // Build dynamic SQL based on what's provided
    const updates = [];
    const values = [];

    if (status !== undefined) {
      status = status.toUpperCase();
      const allowedStatuses = ["PENDING", "COMPLETED", "MISSED"];
      if (!allowedStatuses.includes(status)) {
        backendLogger.log('Invalid status provided:', { status });
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
      backendLogger.log(`No fields to update for followup ID ${id}`);
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
      backendLogger.log(`Followup not found with ID: ${id}`);
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    backendLogger.log(`Followup status updated successfully for ID ${id}`);
    res.json({
      message: `Follow-up updated successfully`,
    });
  } catch (error) {
    backendLogger.error('Update followup status error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

const getTodayFollowups = async (req, res ) => {
    try {
    const { search, page = 1, pageSize = 10 } = req.query;
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 10;
    const offset = (pageNum - 1) * pageSizeNum;
    
    backendLogger.log("Fetching today's followups", { search, page: pageNum, pageSize: pageSizeNum });
    
    const params = [];
    const conditions = ['followup_date = CURDATE()'];

    // Add search conditions
    if (search) {
      conditions.push(`(
        name LIKE ? OR 
        phone LIKE ? OR 
        email LIKE ?
      )`);
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    const whereClause = ` WHERE ${conditions.join(' AND ')}`;

    // Get total count
    const countSql = `SELECT COUNT(*) as total FROM leads${whereClause}`;
    const [countResult] = await pool.execute(countSql, params);
    const total = countResult[0].total;

    // Get paginated data
    const sql = `
      SELECT id, name, email, phone, source, followup_date, notes, status, created_at
      FROM leads
      ${whereClause}
      ORDER BY followup_date ASC
      LIMIT ${pageSizeNum} OFFSET ${offset}
    `;

    const queryParams = [...params];
    const [rows] = await pool.execute(sql, queryParams);
    
    backendLogger.log(`Retrieved ${rows.length} today's followups (page ${pageNum} of ${Math.ceil(total / pageSizeNum)})`);
    
    res.json({
      data: rows,
      total: total,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages: Math.ceil(total / pageSizeNum)
    });
  } catch (error) {
    backendLogger.error('Today followups error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUpcomingFollowups = async (req, res ) => {
    try {
    const { search, page = 1, pageSize = 10 } = req.query;
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 10;
    const offset = (pageNum - 1) * pageSizeNum;
    
    backendLogger.log("Fetching upcoming followups", { search, page: pageNum, pageSize: pageSizeNum });
    
    const params = [];
    const conditions = ['followup_date > CURDATE()'];

    // Add search conditions
    if (search) {
      conditions.push(`(
        name LIKE ? OR 
        phone LIKE ? OR 
        email LIKE ?
      )`);
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    const whereClause = ` WHERE ${conditions.join(' AND ')}`;

    // Get total count
    const countSql = `SELECT COUNT(*) as total FROM leads${whereClause}`;
    const [countResult] = await pool.execute(countSql, params);
    const total = countResult[0].total;

    // Get paginated data
    const sql = `
      SELECT id, name, email, phone, source, followup_date, notes, status, created_at
      FROM leads
      ${whereClause}
      ORDER BY followup_date ASC
      LIMIT ${pageSizeNum} OFFSET ${offset}
    `;

    const queryParams = [...params];
    const [rows] = await pool.execute(sql, queryParams);
    
    backendLogger.log(`Retrieved ${rows.length} upcoming followups (page ${pageNum} of ${Math.ceil(total / pageSizeNum)})`);
    
    res.json({
      data: rows,
      total: total,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages: Math.ceil(total / pageSizeNum)
    });
  } catch (error) {
    backendLogger.error('Upcoming followups error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMissedFollowups = async (req, res) => {
  try {
    const { search, page = 1, pageSize = 10 } = req.query;
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 10;
    const offset = (pageNum - 1) * pageSizeNum;
    
    backendLogger.log("Fetching missed followups", { search, page: pageNum, pageSize: pageSizeNum });
    
    const params = [];
    const conditions = ['followup_date < CURDATE()', "status = 'PENDING'"];

    // Add search conditions
    if (search) {
      conditions.push(`(
        name LIKE ? OR 
        phone LIKE ? OR 
        email LIKE ?
      )`);
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    const whereClause = ` WHERE ${conditions.join(' AND ')}`;

    // Get total count
    const countSql = `SELECT COUNT(*) as total FROM leads${whereClause}`;
    const [countResult] = await pool.execute(countSql, params);
    const total = countResult[0].total;

    // Get paginated data
    const sql = `
      SELECT id, name, email, phone, source, followup_date, notes, status, created_at
      FROM leads
      ${whereClause}
      ORDER BY followup_date DESC
      LIMIT ${pageSizeNum} OFFSET ${offset}
    `;

    const queryParams = [...params];
    const [rows] = await pool.execute(sql, queryParams);
    
    backendLogger.log(`Retrieved ${rows.length} missed followups (page ${pageNum} of ${Math.ceil(total / pageSizeNum)})`);
    
    res.json({
      data: rows,
      total: total,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages: Math.ceil(total / pageSizeNum)
    });
  } catch (error) {
    backendLogger.error('Missed followups error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addFollowup,updateFollowupStatus, getTodayFollowups, getUpcomingFollowups, getMissedFollowups};