const Owner = require("../models/Owner");

/**
 * CREATE OWNER (with documents upload + validation)
 */
exports.createOwner = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const {
      name,
      phone,
      email,
      address,
      ownerType,
      preferredContact,
      notes
    } = req.body;

    // 🔴 BASIC VALIDATION
    if (!name) {
      return res.status(400).json({ message: "Owner name is required" });
    }

    // 🔴 CONTACT VALIDATION (VERY IMPORTANT)
    if (preferredContact === "Phone" && !phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    if (preferredContact === "Email" && !email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // ✅ MATCH SCHEMA STRUCTURE FOR DOCUMENTS
    const documents = req.files
      ? req.files.map(file => ({
          name: file.originalname,
          fileUrl: file.path,
          verified: false
        }))
      : [];

    const owner = await Owner.create({
      name,
      phone,
      email,
      address,
      ownerType,
      preferredContact,
      notes,
      documents
    });

    res.status(201).json({
      success: true,
      data: owner
    });
  } catch (error) {
    console.error("Create Owner Error:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET ALL OWNERS
 */
exports.getOwners = async (req, res) => {
  try {
    const owners = await Owner.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: owners
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET OWNER BY ID
 */
exports.getOwnerById = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    res.status(200).json({
      success: true,
      data: owner
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE OWNER (no document update here)
 */
exports.updateOwner = async (req, res) => {
  try {
    const owner = await Owner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    res.status(200).json({
      success: true,
      data: owner
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * DELETE OWNER
 */
exports.deleteOwner = async (req, res) => {
  try {
    const owner = await Owner.findByIdAndDelete(req.params.id);

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    res.status(200).json({
      success: true,
      message: "Owner deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
