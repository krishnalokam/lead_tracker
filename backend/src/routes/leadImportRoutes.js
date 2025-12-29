const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { importLeads } = require("../controllers/leadImportController");

router.post("/import", upload.single("file"),importLeads);

module.exports = router;