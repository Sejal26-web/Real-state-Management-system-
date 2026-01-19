const Property = require("../models/Property");
const Rental = require("../models/Rental");
const Customer = require("../models/Customer");

/* ================= CLIENT DASHBOARD ================= */
exports.getClientDashboard = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const customer = await Customer.findOne({ user: req.user._id });

    if (!customer) {
      return res.status(200).json({
        success: true,
        data: {
          summary: {
            myProperties: 0,
            activeRentals: 0,
            agreements: 0
          },
          payments: {
            paid: 0,
            pending: 0
          }
        }
      });
    }

    const rentals = await Rental.find({ tenant: customer._id })
      .populate("property", "price");

    const activeRentals = rentals.filter(
      r => r.status === "Active"
    ).length;

    const agreements = rentals.length;

    const uniquePropertyIds = new Set(
      rentals
        .map(r => r.property?._id?.toString())
        .filter(Boolean)
    );

    const myProperties = uniquePropertyIds.size;

    let paid = 0;
    let pending = 0;

    for (const rental of rentals) {
      const totalPaid = rental.payments.reduce(
        (sum, p) => sum + (p.amount || 0),
        0
      );

      paid += totalPaid;
      pending += Math.max(rental.rentAmount - totalPaid, 0);
    }

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          myProperties,
          activeRentals,
          agreements
        },
        payments: {
          paid,
          pending
        }
      }
    });

  } catch (error) {
    console.error("🔥 Client dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load client dashboard"
    });
  }
};

/* ================= CLIENT RENTALS (FIXED) ================= */
exports.getClientRentals = async (req, res) => {
  try {
    const customer = await Customer.findOne({ user: req.user._id });

    if (!customer) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const rentals = await Rental.find({
      tenant: customer._id   // ✅ FIX HERE
    })
      .populate("property", "type locality")
      .populate("tenant", "name phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: rentals
    });
  } catch (error) {
    console.error("🔥 Client rentals error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load rentals"
    });
  }
};
