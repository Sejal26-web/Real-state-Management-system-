const Property = require("../models/Property");
const Rental = require("../models/Rental");
const Sale = require("../models/Sale");
const Lead = require("../models/Lead");

exports.getSummary = async (req, res) => {
  try {
    const properties = await Property.countDocuments();
    const rentals = await Rental.countDocuments({ status: "Active" });
    const sales = await Sale.countDocuments({ status: "In Progress" });
    const leads = await Lead.countDocuments();
    const converted = await Lead.countDocuments({ status: "Converted" });

    res.json({
      properties,
      rentals,
      sales,
      leads,
      converted
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    res.status(500).json({ message: "Dashboard error" });
  }
};
