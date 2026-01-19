const Sale = require("../models/Sale");
const Property = require("../models/Property");

/* ================= CREATE SALE ================= */
exports.createSale = async (req, res) => {
  try {
    const { propertyId, buyerId, sellerId, tokenAmount, totalAmount } = req.body;

    if (!propertyId || !buyerId || !sellerId || !tokenAmount || !totalAmount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (property.status !== "Available") {
      return res.status(400).json({
        message: "Only available properties can be sold"
      });
    }

    const sale = await Sale.create({
      property: propertyId,
      buyer: buyerId,
      seller: sellerId,
      stage: "Negotiation",
      status: "InProgress",
      tokenAmount: Number(tokenAmount),
      totalAmount: Number(totalAmount),
      payments: [
        {
          amount: Number(tokenAmount),
          type: "Token"
        }
      ]
    });

    property.status = "Sold";
    await property.save();

    res.status(201).json({ success: true, data: sale });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= GET ALL SALES ================= */
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("property")
      .populate("buyer")
      .populate("seller")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: sales
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET SALE BY ID ================= */
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("property")
      .populate("buyer")
      .populate("seller");

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.status(200).json({
      success: true,
      data: sale
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE SALE (WORKFLOW) ================= */
exports.updateSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const { stage, status, registrationDate, remarks } = req.body;

    sale.stage = stage || sale.stage;
    sale.status = status || sale.status;

    if (status === "Completed") {
      if (!registrationDate) {
        return res.status(400).json({
          message: "Registration date is required"
        });
      }
      sale.registrationDate = registrationDate;
      sale.remarks = remarks || "";
    }

    await sale.save();

    res.status(200).json({
      success: true,
      data: sale
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= ADD PAYMENT ================= */
exports.addPayment = async (req, res) => {
  try {
    const { amount, type } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    sale.payments.push({
      amount: Number(amount),
      type
    });

    await sale.save();

    res.status(200).json({
      success: true,
      data: sale
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* ================= DELETE SALE ================= */
exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const property = await Property.findById(sale.property);
    if (property) {
      property.status = "Available";
      await property.save();
    }

    await sale.deleteOne();

    res.status(200).json({
      success: true,
      message: "Sale deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
