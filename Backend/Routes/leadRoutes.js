const express = require("express");
const router = express.Router();

const protect = require("../Middleware/AuthMiddleware");

const {
  createLead,
  assignLead,
  updateStatus,
  scheduleSiteVisit,
  getLeads,
  convertLead
} = require("../controllers/leadController");

// =======================
// Lead Routes
// =======================

// Create Lead (Admin, Agent)
router.post("/create", protect(["admin", "agent"]), createLead);

// Assign Lead (Admin only)
router.put("/assign/:id", protect(["admin"]), assignLead);

// Update Lead Status (Admin, Agent)
router.put("/status/:id", protect(["admin", "agent"]), updateStatus);

// Schedule Site Visit (Admin, Agent)
router.post("/:id/site-visit", protect(["admin", "agent"]), scheduleSiteVisit);

// Get All Leads (Admin, Agent)
router.get("/", protect(["admin", "agent"]), getLeads);

// Convert Lead to Customer (Admin, Agent)
router.post("/convert/:id", protect(["admin", "agent"]), convertLead);

module.exports = router;
