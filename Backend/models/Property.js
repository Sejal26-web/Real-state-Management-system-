const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true
    },
    type: {
      type: String,
      enum: ["Flat", "Villa", "Plot", "Commercial"],
      required: true
    },
    price: { type: Number, required: true },
    amenities: [String],
    locality: String,
    area: String,
    status: {
      type: String,
      enum: ["Available", "Rented", "Sold", "Under Negotiation"],
      default: "Available"
    },
    documents: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
