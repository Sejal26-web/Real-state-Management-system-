const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: String,
    email: String,
    address: String,

    ownerType: {
      type: String,
      enum: ["Individual", "Company"],
      default: "Individual"
    },

    preferredContact: {
      type: String,
      enum: ["Phone", "Email"]
    },

    documents: [
      {
        name: String,
        fileUrl: String,
        verified: { type: Boolean, default: false }
      }
    ],

    notes: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Owner", ownerSchema);
