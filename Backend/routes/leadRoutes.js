const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  assignLead,
  convertLead,
  scheduleSiteVisit,
  addActivity
} = require("../controllers/leadController");

/* ================= GET LEADS ================= */
router.get("/", protect, getLeads);

/* ================= CREATE LEAD ================= */
router.post("/", protect, createLead);

/* ================= SINGLE LEAD ================= */
router.get("/:id", protect, getLeadById);

/* ================= UPDATE ================= */
router.put("/:id", protect, updateLead);

/* ================= ASSIGN ================= */
router.put("/:id/assign", protect, assignLead);

/* ================= SITE VISIT ================= */
router.post("/:id/site-visit", protect, scheduleSiteVisit);

/* ================= ACTIVITY ================= */
router.post("/:id/activity", protect, addActivity);

/* ================= CONVERT ================= */
router.post("/:id/convert", protect, convertLead);

/* ================= DELETE ================= */
router.delete("/:id", protect, deleteLead);

module.exports = router;
