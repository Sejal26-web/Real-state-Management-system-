const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    /* 👤 PROPERTY OWNER */
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true
    },

    /* 👤 CLIENT (USER) WHO HANDLES THIS PROPERTY */
    assignedClient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      enum: ["Flat", "Villa", "Plot", "Commercial"],
      required: true
    },

    transactionType: {
      type: String,
      enum: ["Sale", "Rent"],
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    locality: String,
    area: Number,

    bedrooms: Number,
    bathrooms: Number,

    furnishing: {
      type: String,
      enum: ["Unfurnished", "Semi-Furnished", "Fully Furnished"]
    },

    amenities: [String],

    /* COMPLIANCE */
    compliance: {
      hasSaleDeed: Boolean,
      hasNOC: Boolean,
      hasTaxReceipt: Boolean,
      remarks: String
    },

    /* EMBEDDED QUICK DOCS */
    documents: [
      {
        name: String,
        fileUrl: String,
        verified: { type: Boolean, default: false }
      }
    ],

    status: {
      type: String,
      enum: ["Available", "Under Negotiation", "Sold", "Rented"],
      default: "Available"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
