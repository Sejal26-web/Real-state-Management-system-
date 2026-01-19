const mongoose = require("mongoose");

/* ===============================
   COMMUNICATION LOG
=============================== */
const communicationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Call", "Meeting", "Note"],
      default: "Note"
    },
    note: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true, _id: false }
);

/* ===============================
   FOLLOW-UP
=============================== */
const followUpSchema = new mongoose.Schema(
  {
    note: { type: String, trim: true, default: "" },
    followUpDate: { type: Date, required: true },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true, _id: false }
);

/* ===============================
   REFERRAL
=============================== */
const referralSchema = new mongoose.Schema(
  {
    name: String,
    phone: {
      type: String,
      match: [/^(\+91)?[0-9]{10}$/, "Invalid referral phone"]
    }
  },
  { timestamps: true, _id: false }
);

/* ===============================
   TRANSACTION HISTORY
=============================== */
const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Sale", "Rental"] },
    refId: mongoose.Schema.Types.ObjectId,
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property"
    },
    amount: Number,
    date: { type: Date, default: Date.now }
  },
  { timestamps: true, _id: false }
);

/* ===============================
   PREFERENCES
=============================== */
const preferenceSchema = new mongoose.Schema(
  {
    propertyType: String,
    budget: String,
    location: String
  },
  { _id: false }
);

/* ===============================
   CUSTOMER
=============================== */
const customerSchema = new mongoose.Schema(
  {
    /* 🔑 LINK TO CLIENT USER */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      match: [/^(\+91)?[0-9]{10}$/]
    },
    email: { type: String, lowercase: true },

    type: {
      type: String,
      enum: ["Buyer", "Seller", "Tenant", "Landlord"],
      default: "Buyer"
    },

    preferences: { type: preferenceSchema, default: () => ({}) },
    transactions: { type: [transactionSchema], default: [] },
    communicationLogs: { type: [communicationSchema], default: [] },
    followUps: { type: [followUpSchema], default: [] },
    referrals: { type: [referralSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
