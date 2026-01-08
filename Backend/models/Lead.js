const mongoose = require("mongoose");

const siteVisitSchema = new mongoose.Schema(
  {
    visitDate: {
      type: Date,
      required: true
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property"
    },
    remarks: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    email: {
      type: String
    },

    source: {
      type: String,
      enum: ["Website", "Phone", "Walk-in"],
      required: true
    },

    status: {
      type: String,
      enum: ["New", "Contacted", "Site Visit Scheduled", "Converted"],
      default: "New"
    },

    notes: [String],

    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    siteVisits: [siteVisitSchema],

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
