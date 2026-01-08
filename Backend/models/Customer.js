const mongoose = require("mongoose");

const communicationSchema = new mongoose.Schema(
  {
    note: { type: String, required: true },
    date: { type: Date, default: Date.now }
  },
  { _id: false }
);

const followUpSchema = new mongoose.Schema(
  {
    note: String,
    followUpDate: Date
  },
  { _id: false }
);

const referralSchema = new mongoose.Schema(
  {
    name: String,
    phone: String
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: String,
    type: {
      type: String,
      enum: ["Buyer", "Seller", "Tenant", "Landlord"],
      default: "Buyer"
    },

    communicationLogs: [communicationSchema],
    followUps: [followUpSchema],
    referrals: [referralSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
