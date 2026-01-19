const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const {
  createRental,
  getRentals,
  getRentalById,
  updateRental,
  deleteRental,
  addPayment,
  moveOutRental,
  getMyRentals
} = require("../controllers/rentalController");

/* =========================
   CLIENT ROUTES (FIRST)
========================= */
router.get(
  "/my",
  protect,
  authorize("client"),
  getMyRentals
);

/* =========================
   CLIENT: PAY RENT ✅ FIX
========================= */
router.post(
  "/:id/payment",
  protect,
  authorize("client"),
  addPayment
);

/* =========================
   ADMIN ROUTES
========================= */
router.post("/", protect, authorize("admin"), createRental);
router.get("/", protect, authorize("admin"), getRentals);
router.get("/:id", protect, authorize("admin"), getRentalById);
router.put("/:id", protect, authorize("admin"), updateRental);
router.delete("/:id", protect, authorize("admin"), deleteRental);
router.put("/:id/move-out", protect, authorize("admin"), moveOutRental);

module.exports = router;
