const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const { getDashboardOverview } = require("../controllers/dashboardController");

/* ===============================
   DASHBOARD (ADMIN ONLY)
=============================== */
router.get(
  "/",
  protect,
  authorize("admin"), // ✅ FIX: lowercase role
  getDashboardOverview
);

module.exports = router;
