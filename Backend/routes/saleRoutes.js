const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  addPayment,
  deleteSale
} = require("../controllers/saleController");

/* ===============================
   SALES ROUTES
=============================== */

// CREATE SALE (ADMIN ONLY)
router.post(
  "/",
  protect,
  authorize("admin"),
  createSale
);

// GET ALL SALES (ADMIN ONLY)
router.get(
  "/",
  protect,
  authorize("admin"),
  getSales
);

// GET SINGLE SALE
router.get(
  "/:id",
  protect,
  authorize("admin"),
  getSaleById
);

// UPDATE SALE
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateSale
);

// ADD PAYMENT
router.post(
  "/:id/payments",
  protect,
  authorize("admin"),
  addPayment
);

// DELETE SALE
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteSale
);

module.exports = router;
