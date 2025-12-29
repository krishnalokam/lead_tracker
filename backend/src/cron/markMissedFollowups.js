const cron = require("node-cron");
const { markMissedFollowups } = require("../service/markMissedService.js")

// Daily at 12:05 AM
cron.schedule("5 0 * * *", async () => {
  try {
    const count = await markMissedFollowups();
    console.log(`⏰ Cron marked ${count} follow-ups as MISSED`);
  } catch (error) {
    console.error("Cron error:", error);
  }
});
