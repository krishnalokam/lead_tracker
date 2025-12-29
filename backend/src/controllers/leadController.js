const { pool } = require('../config/db');
const { backendLogger } = require('../utils/logger');

const createLead = async (req, res ) => {
    try {
        const { name, email, phone, source } = req.body;
        
        backendLogger.log('Creating lead:', { name, email, phone, source });

        if(!name || !phone) {
            backendLogger.log('Validation failed: Name and phone are required');
            return res.status(400).json({message: "Name  and phone are  required"});
        }


        const [existing] = await pool.execute(
  "SELECT id FROM leads WHERE phone = ?",
  [phone]
);

if (existing.length > 0) {
  backendLogger.log('Duplicate phone number detected:', { phone });
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

        backendLogger.log('Lead created successfully with ID:', { leadId: result.insertId });

        res.status(201).json({
            message: " Lead created successfully ",
            leadId: result.insertId,
        });



    } catch (error) {
        backendLogger.error('Lead creation error:', error);
        res.status(500).json({message: "Server error "});
    }
}

const getLeads = async (req, res ) => {
  try {
    const { fromDate, toDate, search, page = 1, pageSize = 10 } = req.query;
    
    const pageNum = Number(page) || 1;
    const pageSizeNum = Number(pageSize) || 10;
    const offset = (pageNum - 1) * pageSizeNum;
    
    backendLogger.log('Fetching leads with filters:', { fromDate, toDate, search, page: pageNum, pageSize: pageSizeNum });
    
    // Build WHERE conditions
    const params = [];
    const conditions = [];

    if (fromDate) {
      conditions.push(`DATE(created_at) >= ?`);
      params.push(fromDate);
    }

    if (toDate) {
      conditions.push(`DATE(created_at) <= ?`);
      params.push(toDate);
    }

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

    const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countSql = `SELECT COUNT(*) as total FROM leads${whereClause}`;
    const [countResult] = await pool.execute(countSql, params);
    const total = countResult[0].total;

    // Get paginated data
    let sql = `
      SELECT id, name, email, phone, source, followup_date, notes, status, created_at
      FROM leads
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${pageSizeNum} OFFSET ${offset}
    `;
    
    const queryParams = [...params];
    const [rows] = await pool.execute(sql, queryParams);

    backendLogger.log(`Retrieved ${rows.length} leads (page ${pageNum} of ${Math.ceil(total / pageSizeNum)})`);

    res.json({
      data: rows,
      total: total,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages: Math.ceil(total / pageSizeNum)
    });
  } catch (error) {
    backendLogger.error('Get leads error:', error);
    res.status(500).json({ message: "Server error" });
  }
}

const updateLeadFollowup = async (req, res) => {
  try {
    const { id } = req.params;
    const { followup_date, notes, status } = req.body;
    
    backendLogger.log(`Updating lead followup for ID ${id}:`, { followup_date, notes, status });

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
        backendLogger.log('Invalid status provided:', { status });
        return res.status(400).json({ 
          message: "Invalid status. Allowed: PENDING, COMPLETED, MISSED" 
        });
      }
      updates.push("status = ?");
      values.push(upperStatus);
    }

    if (updates.length === 0) {
      backendLogger.log(`No fields to update for lead ID ${id}`);
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
      backendLogger.log(`Lead not found with ID: ${id}`);
      return res.status(404).json({ message: "Lead not found" });
    }

    backendLogger.log(`Lead followup updated successfully for ID ${id}`);
    res.json({ message: "Follow-up updated successfully" });
  } catch (error) {
    backendLogger.error('Update lead followup error:', error);
    res.status(500).json({ message: "Server error" });
  }
}

const getDuplicateLeads = async (req, res) => {
  try {
    const { date, phone, page = 1, pageSize = 10 } = req.query;
    
    const pageNum = parseInt(page) || 1;
    const pageSizeNum = parseInt(pageSize) || 10;
    const offset = (pageNum - 1) * pageSizeNum;
    
    backendLogger.log('Fetching duplicate leads with filters:', { date, phone, page: pageNum, pageSize: pageSizeNum });
    
    const params = [];
    const conditions = [];

    if (date) {
      conditions.push(`DATE(dl.created_at) = ?`);
      params.push(date);
    }

    if (phone) {
      conditions.push(`dl.phone LIKE ?`);
      params.push(`%${phone}%`);
    }

    const whereClause = conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countSql = `
      SELECT COUNT(*) as total 
      FROM duplicate_leads dl
      LEFT JOIN leads l ON dl.phone = l.phone
      ${whereClause}
    `;
    const [countResult] = await pool.execute(countSql, params);
    const total = countResult[0].total;

    // Get paginated data
    let sql = `
      SELECT 
        dl.id, 
        dl.name, 
        dl.email, 
        dl.phone, 
        dl.source, 
        dl.created_at,
        l.created_at AS lead_created_at
      FROM duplicate_leads dl
      LEFT JOIN leads l ON dl.phone = l.phone
      ${whereClause}
      ORDER BY dl.created_at DESC
      LIMIT ${pageSizeNum} OFFSET ${offset}
    `;
    
    const queryParams = [...params];
    const [rows] = await pool.execute(sql, queryParams);
    
    backendLogger.log(`Retrieved ${rows.length} duplicate leads (page ${pageNum} of ${Math.ceil(total / pageSizeNum)})`);
    
    res.json({
      data: rows,
      total: total,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages: Math.ceil(total / pageSizeNum)
    });
  } catch (error) {
    backendLogger.error('Get duplicate leads error:', error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { createLead, getLeads, updateLeadFollowup, getDuplicateLeads};
