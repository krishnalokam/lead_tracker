const express = require('express');
const router = express.Router();
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Lead tracker backend is running");
})

app.use("/api/leads", require('./routes/leadRoutes'));
app.use("/api/followup",require('./routes/followupRoutes'));
app.use("/api/leads", require("./routes/leadImportRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/cron", require("./routes/cronRoutes"));




module.exports = app;