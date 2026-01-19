const Property = require("../models/Property");
const Rental = require("../models/Rental");
const Sale = require("../models/Sale");
const Lead = require("../models/Lead");

/* ===============================
   DASHBOARD OVERVIEW (SINGLE API)
   GET /api/dashboard
=============================== */
exports.getDashboardOverview = async (req, res) => {
  try {
    /* ===== SUMMARY CARDS ===== */
    const [
      totalProperties,
      activeRentals,
      activeSales,
      totalLeads,
      convertedLeads
    ] = await Promise.all([
      Property.countDocuments(),
      Rental.countDocuments({ status: "Active" }),
      Sale.countDocuments(),
      Lead.countDocuments(),
      Lead.countDocuments({ status: "Converted" })
    ]);

    /* ===== LEAD STATUS DISTRIBUTION ===== */
    const leadStatus = await Lead.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1
        }
      }
    ]);

    /* ===== CONSULTANT PERFORMANCE ===== */
    const consultantPerformance = await Lead.aggregate([
      {
        $group: {
          _id: "$agent",
          totalLeads: { $sum: 1 },
          converted: {
            $sum: { $cond: [{ $eq: ["$status", "Converted"] }, 1, 0] }
          }
        }
      }
    ]);

    /* ===== REVENUE ===== */
    const salesRevenue = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const rentalRevenue = await Rental.aggregate([
      { $group: { _id: null, total: { $sum: "$rentAmount" } } }
    ]);

    /* ===== RESPONSE ===== */
    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalProperties,
          activeRentals,
          activeSales,
          totalLeads,
          convertedLeads,
          conversionRate:
            totalLeads === 0
              ? 0
              : ((convertedLeads / totalLeads) * 100).toFixed(2)
        },
        leadStatus,
        consultantPerformance,
        revenue: {
          sales: salesRevenue[0]?.total || 0,
          rentals: rentalRevenue[0]?.total || 0
        }
      }
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data"
    });
  }
};
