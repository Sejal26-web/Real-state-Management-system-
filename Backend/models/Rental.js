const mongoose = require("mongoose");

/* ======================
   RENT PAYMENT
====================== */
const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true
    },
    note: {
      type: String,
      trim: true,
      default: ""
    }
  },
  {
    timestamps: true   // ✅ FIX: adds createdAt automatically
  }
);

/* ======================
   RENTAL
====================== */
const rentalSchema = new mongoose.Schema(
  {
    /* 🔑 CLIENT (DERIVED FROM TENANT.USER) */
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    rentAmount: {
      type: Number,
      required: true
    },

    securityDeposit: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["Active", "Vacated", "Terminated"],
      default: "Active"
    },

    moveInDate: {
      type: Date,
      default: Date.now
    },

    moveOutDate: Date,
    moveOutReason: String,

    payments: {
      type: [paymentSchema],
      default: []
    }
  },
  { timestamps: true }
);

/* ======================
   VIRTUAL: OUTSTANDING
====================== */
rentalSchema.virtual("outstandingRent").get(function () {
  const totalPaid = this.payments.reduce((sum, p) => sum + p.amount, 0);
  return Math.max(this.rentAmount - totalPaid, 0);
});

rentalSchema.set("toJSON", { virtuals: true });
rentalSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Rental", rentalSchema);
