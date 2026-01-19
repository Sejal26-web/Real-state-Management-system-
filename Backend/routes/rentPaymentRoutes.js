const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const RentPayment = require("../models/RentPayment");
const Rental = require("../models/Rental");

/* ===============================
   ADD RENT PAYMENT
   ADMIN ONLY
=============================== */
router.post(
  "/:rentalId",
  protect,
  authorize("ADMIN"),
  async (req, res) => {
    try {
      const { rentalId } = req.params;
      const { amountPaid, paymentMode, remarks } = req.body;

      const rental = await Rental.findById(rentalId);
      if (!rental) {
        return res.status(404).json({ message: "Rental not found" });
      }

      const payment = await RentPayment.create({
        rental: rentalId,
        amountPaid,
        paymentMode,
        remarks
      });

      res.json(payment);
    } catch (err) {
      console.error("ADD RENT PAYMENT ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/* ===============================
   GET RENT PAYMENT HISTORY
   ADMIN ONLY
=============================== */
router.get(
  "/:rentalId",
  protect,
  authorize("ADMIN"),
  async (req, res) => {
    try {
      const payments = await RentPayment.find({
        rental: req.params.rentalId
      }).sort({ paymentDate: -1 });

      res.json(payments);
    } catch (err) {
      console.error("GET RENT PAYMENT ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
