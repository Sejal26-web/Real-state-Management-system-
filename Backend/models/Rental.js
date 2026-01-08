const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const rentalSchema = new mongoose.Schema(
  {
    property: {
      type: String,
      required: true
    },
    tenant: {
      type: String,
      required: true
    },
    rentAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      default: "Active"
    },
    moveOutDate: {
      type: Date
    },
    payments: [paymentSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Rental", rentalSchema);
