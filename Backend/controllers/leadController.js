const Lead = require("../models/Lead");
const Customer = require("../models/Customer");

/* ================= CREATE LEAD ================= */
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create({
      ...req.body,
      assignedClient: null
    });

    res.status(201).json({
      success: true,
      data: lead
    });
  } catch (err) {
    console.error("Create lead error:", err.message);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

/* ================= GET LEADS ================= */
exports.getLeads = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "client") {
      query.assignedClient = req.user._id;
    }

    const leads = await Lead.find(query)
      .populate("assignedClient", "name email")
      .populate("customer", "name phone")
      .populate("siteVisit.property", "type locality")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: leads
    });
  } catch (err) {
    console.error("Get leads error:", err.message);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* ================= GET SINGLE LEAD ================= */
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("assignedClient", "name email")
      .populate("customer", "name phone")
      .populate("siteVisit.property", "type locality");

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    if (
      req.user.role === "client" &&
      lead.assignedClient?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (err) {
    console.error("Get lead error:", err.message);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* ================= UPDATE LEAD ================= */
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (err) {
    console.error("Update lead error:", err.message);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* ================= ASSIGN LEAD (ADMIN) ================= */
exports.assignLead = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin only"
      });
    }

    const { clientId } = req.body;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "clientId is required"
      });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    lead.assignedClient = clientId;
    await lead.save();

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (err) {
    console.error("Assign lead error:", err.message);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* ================= SITE VISIT ================= */
exports.scheduleSiteVisit = async (req, res) => {
  try {
    const { propertyId, visitDate } = req.body;

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    lead.siteVisit = {
      property: propertyId,
      date: visitDate
    };

    lead.activities.push({
      type: "Site Visit",
      description: "Site visit scheduled"
    });

    await lead.save();

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (err) {
    console.error("Site visit error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/* ================= ADD ACTIVITY ================= */
exports.addActivity = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    lead.activities.push(req.body);
    await lead.save();

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (err) {
    console.error("Add activity error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

/* ================= CONVERT LEAD ================= */
exports.convertLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    let customer = await Customer.findOne({ phone: lead.phone });
    if (!customer) {
      customer = await Customer.create({
        name: lead.name,
        phone: lead.phone,
        email: lead.email || ""
      });
    }

    lead.status = "Converted";
    lead.customer = customer._id;
    lead.convertedAt = new Date();
    await lead.save();

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (err) {
    console.error("Convert lead error:", err.message);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* ================= DELETE LEAD ================= */
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true
    });
  } catch (err) {
    console.error("Delete lead error:", err.message);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
