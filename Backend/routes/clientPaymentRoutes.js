const express = require("express");
const router = express.Router();

const { getClientPayments } = require("../controllers/clientPaymentController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get(
  "/payments",
  protect,
  authorize("client"),
  getClientPayments
);

module.exports = router;
