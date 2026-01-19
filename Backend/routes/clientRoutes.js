const express = require("express");
const router = express.Router();

const {
  getClientDashboard,
  getClientRentals
} = require("../controllers/clientController");

const { protect, authorize } = require("../middleware/authMiddleware");

/* ================= CLIENT DASHBOARD ================= */
router.get(
  "/dashboard",
  protect,
  authorize("client"),
  getClientDashboard
);

/* ================= CLIENT RENTALS ================= */
router.get(
  "/rentals",
  protect,
  authorize("client"),
  getClientRentals
);

module.exports = router;
