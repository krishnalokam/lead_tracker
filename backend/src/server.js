require('dotenv').config();
const app = require('./app');
const { testDBConnection } = require('./config/db');
require("./cron/markMissedFollowups");
const { markMissedFollowups } = require("./service/markMissedService")

const PORT = process.env.PORT || 5002;

testDBConnection();

(async () => {
  const count = await markMissedFollowups();
  console.log(`Startup cleanup marked ${count} follow-ups as MISSED`);
})();


app.listen(PORT, () => {
    console.log(`Backedn server is running on the http://localhost:${PORT}`);
})
