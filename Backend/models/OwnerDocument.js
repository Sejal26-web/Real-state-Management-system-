const mongoose = require("mongoose");

const ownerDocumentSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true
    },

    documentType: {
      type: String,
      required: true
    },

    fileName: {
      type: String,
      required: true
    },

    filePath: {
      type: String,
      required: true
    },

    fileUrl: {
      type: String,
      required: true
    },

    /* 🔍 AUDIT */
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("OwnerDocument", ownerDocumentSchema);
