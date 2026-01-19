const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
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
      type: String
    },

    status: {
      type: String,
      default: "New"
    },

    requirementType: {
      type: String
    },

    assignedClient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer"
    },

    siteVisit: {
      property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property"
      },
      date: {
        type: Date
      }
    },

    activities: [activitySchema],

    convertedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
