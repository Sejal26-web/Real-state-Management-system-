const Customer = require("../models/Customer");
const User = require("../models/User");

/* =========================
   CREATE CUSTOMER (ADMIN)
========================= */
exports.createCustomer = async (req, res) => {
  try {
    const { userId, name, phone, email, type, preferences } = req.body;

    if (!userId || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Client user, name and phone are required"
      });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "client") {
      return res.status(400).json({
        success: false,
        message: "Invalid client user"
      });
    }

    const exists = await Customer.findOne({ user: userId });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Customer already exists for this user"
      });
    }

    const customer = await Customer.create({
      user: userId,
      name: name.trim(),
      phone: phone.trim(),
      email: email?.trim(),
      type: type || "Tenant",
      preferences: preferences || {},
      communicationLogs: [],
      followUps: [],
      transactions: [],
      referrals: []
    });

    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (err) {
    console.error("CREATE CUSTOMER ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* =========================
   GET ALL CUSTOMERS (ADMIN)
========================= */
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: customers
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch customers"
    });
  }
};

/* =========================
   GET CUSTOMER BY ID (ADMIN)
========================= */
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate("user", "name email role");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer"
    });
  }
};

/* =========================
   GET MY CUSTOMER (CLIENT)
========================= */
exports.getMyCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      user: req.user._id
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "No customer profile found"
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (err) {
    console.error("GET MY CUSTOMER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customer profile"
    });
  }
};

/* =========================
   UPDATE CUSTOMER (ADMIN)
========================= */
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

/* =========================
   DELETE CUSTOMER (ADMIN)
========================= */
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    await customer.deleteOne();

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
