const express = require("express");
const router = express.Router();
const protect = require("../Middleware/AuthMiddleware");

const {
  createSale,
  addPayment,
  closeSale,
  getSales
} = require("../controllers/saleController");

/**
 * 16️⃣ Create sale
 * 17️⃣ Token amount validation
 * 20️⃣ Prevent duplicate sale
 */
router.post("/", protect(["admin"]), createSale);

/**
 * Get all sales
 */
router.get("/", protect(["admin", "agent"]), getSales);

/**
 * 18️⃣ Add installment payment
 */
router.post("/:id/payment", protect(["admin"]), addPayment);

/**
 * 19️⃣ Close sale & mark property sold
 */
router.post("/:id/close", protect(["admin"]), closeSale);

module.exports = router;
