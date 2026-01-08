const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      unique: true //Prevent duplicate sales for same property (TC-20)
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

    tokenAmount: {
      type: Number,
      required: true,
      min: 1 // TC-17
    },

    totalAmount: {
      type: Number,
      required: true
    },

    paidAmount: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["In Progress", "Completed", "Cancelled"],
      default: "In Progress"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sale", saleSchema);
