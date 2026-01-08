const Lead = require("../models/Lead");
const Customer = require("../models/Customer");

/**
 * CREATE LEAD
 */
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ASSIGN LEAD
 */
exports.assignLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { assignedTo: req.body.agentId },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE LEAD STATUS
 */
exports.updateStatus = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * SCHEDULE SITE VISIT
 */
exports.scheduleSiteVisit = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { siteVisitDate: req.body.date },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET ALL LEADS
 */
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.status(200).json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * CONVERT LEAD TO CUSTOMER
 */
exports.convertLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    if (lead.status === "Converted") {
      return res.status(400).json({ message: "Lead already converted" });
    }

    const customer = await Customer.create({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      type: "Buyer"
    });

    lead.status = "Converted";
    lead.customer = customer._id;
    await lead.save();

    res.status(200).json({
      message: "Lead converted successfully",
      lead,
      customer
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
