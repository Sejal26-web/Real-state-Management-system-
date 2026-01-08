const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    address: String,
    documents: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Owner", ownerSchema);
