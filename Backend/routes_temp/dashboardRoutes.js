const express = require("express");
const router = express.Router();
const protect = require("../Middleware/AuthMiddleware");
const { getSummary } = require("../controllers/dashboardController");

router.get("/summary", protect(["admin", "agent"]), getSummary);

module.exports = router;
