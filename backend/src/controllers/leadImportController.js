const csv = require('csv-parser');
const { pool } = require("../config/db");
const { Readable } = require("stream");
const { backendLogger } = require('../utils/logger');

const importLeads = async (req, res) => {
   if (!req.file) {
    backendLogger.log("CSV import failed: No file provided");
    return res.status(400).json({ message: "CSV file required" });
  }

  backendLogger.log(`Starting CSV import, file size: ${req.file.size} bytes`);

  let inserted = 0;
  let skipped = 0;
  const rows = [];

  // 1️⃣ Parse CSV and collect rows
  const stream = Readable.from(req.file.buffer.toString());

  stream
    .pipe(csv())
    .on("data", (row) => {
      rows.push(row);
    })
    .on("end", async () => {
      backendLogger.log(`CSV parsed, processing ${rows.length} rows`);
      
      // 2️⃣ Process rows AFTER parsing completes
      for (const row of rows) {
        try {
          const name = row.name?.trim();
          const phone = row.phone?.trim();
          const email = row.email?.trim();

          if (!name || !phone) {
            skipped++;
            continue;
          }

          await pool.execute(
            "INSERT INTO leads (name, phone, email) VALUES (?, ?, ?)",
            [name, phone, email || null]
          );

          inserted++;
        } catch (error) {
          if (error.code === "ER_DUP_ENTRY") {

            const name = row.name?.trim();
          const phone = row.phone?.trim();
          const email = row.email?.trim();


          await pool.execute(
            "INSERT INTO duplicate_leads (name, phone, email) VALUES (?, ?, ?)",
            [name, phone, email || null]
          );
          
            skipped++;
          } else {
            backendLogger.error('Row insert error:', error);
          }
        }
      }

      const result = {
        message: "CSV import completed",
        inserted,
        skipped,
      };
      
      backendLogger.log("CSV import completed:", result);
      
      // 3️⃣ NOW counts are accurate
      res.json(result);
    });


}

module.exports = {importLeads };