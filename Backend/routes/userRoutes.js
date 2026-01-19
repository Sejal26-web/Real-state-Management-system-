const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getUsers,
  getAgents
} = require("../controllers/userController");

/* ================= ADMIN ONLY ================= */

// Existing route (keep it)
router.get(
  "/",
  protect,
  authorize("admin"),
  getUsers
);

// ✅ NEW ROUTE — REQUIRED FOR ASSIGN LEAD
router.get(
  "/agents",
  protect,
  authorize("admin"),
  getAgents
);

module.exports = router;
