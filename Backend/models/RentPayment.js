const mongoose = require("mongoose");

const rentPaymentSchema = new mongoose.Schema(
  {
    rental: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rental",
      required: true
    },

    /* 🔑 CLIENT */
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    amountPaid: {
      type: Number,
      required: true
    },

    paymentDate: {
      type: Date,
      default: Date.now
    },

    paymentMode: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer", "Cheque"],
      default: "Cash"
    },

    remarks: String
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.RentPayment ||
  mongoose.model("RentPayment", rentPaymentSchema);
