const Customer = require("../models/Customer");
/**
 * CREATE CUSTOMER
 * - Reuse existing customer if phone already exists
 * - Prevent duplicate customer records
 */
exports.createCustomer = async (req, res) => {
  try {
    const { phone } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ phone });
    if (existingCustomer) {
      return res.status(200).json(existingCustomer);
    }

    // Create new customer
    const customer = await Customer.create(req.body);
    return res.status(201).json(customer);
  } catch (err) {
    // Handle duplicate key error (race-condition safety)
    if (err.code === 11000) {
      const customer = await Customer.findOne({ phone: req.body.phone });
      return res.status(200).json(customer);
    }

    return res.status(500).json({ message: err.message });
  }
};

/**
 * GET ALL CUSTOMERS
 */
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET CUSTOMER BY ID
 */
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE CUSTOMER
 */
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ADD COMMUNICATION LOG
 */
exports.addCommunicationLog = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.communicationLogs.push(req.body);
    await customer.save();

    res.status(200).json({
      message: "Communication logged successfully",
      communication: req.body
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ADD FOLLOW-UP ENTRY
 */
exports.addFollowUp = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.followUps.push(req.body);
    await customer.save();

    res.status(200).json({
      message: "Follow-up added successfully",
      followUp: req.body
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ADD REFERRAL
 */
exports.addReferral = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.referrals.push(req.body);
    await customer.save();

    res.status(201).json({
      message: "Referral created successfully",
      referral: req.body
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE CUSTOMER
 */
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
