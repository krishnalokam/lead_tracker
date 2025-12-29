const csv = require('csv-parser');
const { pool } = require("../config/db");
const { Readable } = require("stream");

const importLeads = async (req, res) => {
   if (!req.file) {
    return res.status(400).json({ message: "CSV file required" });
  }

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
            console.error("Row insert error:", error);
          }
        }
      }

      // 3️⃣ NOW counts are accurate
      res.json({
        message: "CSV import completed",
        inserted,
        skipped,
      });
    });


}

module.exports = {importLeads };