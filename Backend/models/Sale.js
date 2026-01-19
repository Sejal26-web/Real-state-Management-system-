const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    type: {
      type: String,
      enum: ["Token", "Installment"],
      required: true
    },
    paidOn: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    /* 🔑 CLIENT (USER) */
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      unique: true
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true
    },

    stage: {
      type: String,
      enum: ["Negotiation", "Agreement", "Registration"],
      default: "Negotiation"
    },

    status: {
      type: String,
      enum: ["InProgress", "Completed", "Cancelled"],
      default: "InProgress"
    },

    tokenAmount: {
      type: Number,
      required: true
    },

    totalAmount: {
      type: Number,
      required: true
    },

    payments: {
      type: [paymentSchema],
      default: []
    },

    registrationDate: Date,
    remarks: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
