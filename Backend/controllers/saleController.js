const Sale = require("../models/Sale");
const Property = require("../models/Property");

/**
 * 16️⃣ CREATE SALE
 * 17️⃣ TOKEN AMOUNT VALIDATION
 * 20️⃣ PREVENT DUPLICATE SALES
 */
exports.createSale = async (req, res) => {
  try {
    const { property, buyer, seller, tokenAmount, totalAmount } = req.body;

    if (!tokenAmount || tokenAmount <= 0) {
      return res.status(400).json({ message: "Token amount required" });
    }

    const existingSale = await Sale.findOne({ property });
    if (existingSale) {
      return res.status(400).json({
        message: "Sale already exists for this property"
      });
    }

    const sale = await Sale.create({
      property,
      buyer,
      seller,
      tokenAmount,
      totalAmount,
      paidAmount: tokenAmount
    });

    await Property.findByIdAndUpdate(property, {
      status: "Under Negotiation"
    });

    res.status(201).json({
      message: "Sale created successfully",
      sale
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 18️⃣ ADD INSTALLMENT PAYMENT
 */
exports.addPayment = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    if (req.body.amount <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    sale.paidAmount += req.body.amount;
    await sale.save();

    const outstandingAmount = sale.totalAmount - sale.paidAmount;

    res.status(200).json({
      message: "Payment added",
      paidAmount: sale.paidAmount,
      outstandingAmount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * 19️⃣ CLOSE SALE
 */
exports.closeSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    if (sale.paidAmount < sale.totalAmount) {
      return res.status(400).json({
        message: "Full payment required before closing sale"
      });
    }

    sale.status = "Completed";
    await sale.save();

    await Property.findByIdAndUpdate(sale.property, {
      status: "Sold"
    });

    res.status(200).json({
      message: "Sale closed successfully",
      sale
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL SALES
 */
exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("property")
      .populate("buyer")
      .populate("seller");

    const enrichedSales = sales.map(sale => ({
      ...sale.toObject(),
      outstandingAmount: sale.totalAmount - sale.paidAmount
    }));

    res.status(200).json(enrichedSales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
