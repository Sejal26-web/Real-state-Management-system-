const Property = require("../models/Property");

/* ===============================
   CREATE PROPERTY (FIXED)
=============================== */
exports.createProperty = async (req, res) => {
  try {
    const {
      owner,
      type,
      transactionType,
      price,
      amenities = [],
      locality,
      area,
      documents = []
    } = req.body;

    if (!owner || !type || !transactionType || !price || !locality || !area) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    if (!["Sale", "Rent"].includes(transactionType)) {
      return res.status(400).json({
        success: false,
        message: "Transaction type must be Sale or Rent"
      });
    }

    const property = await Property.create({
      owner,
      assignedClient: req.user._id, // ✅ REQUIRED FIELD (ROOT FIX)
      type,
      transactionType,
      price,
      amenities,
      locality,
      area,
      documents,
      status: "Available"
    });

    res.status(201).json({
      success: true,
      data: property
    });

  } catch (error) {
    console.error("CREATE PROPERTY ERROR:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/* ===============================
   GET ALL PROPERTIES (ADMIN)
=============================== */
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate({
        path: "owner",
        select: "name phone email",
        strictPopulate: false
      })
      .populate({
        path: "assignedClient",
        select: "name email",
        strictPopulate: false
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: properties
    });

  } catch (error) {
    console.error("GET PROPERTIES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===============================
   GET AVAILABLE PROPERTIES
=============================== */
exports.getAvailableProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      status: "Available"
    })
      .populate({
        path: "owner",
        select: "name phone email",
        strictPopulate: false
      })
      .populate({
        path: "assignedClient",
        select: "name email",
        strictPopulate: false
      });

    res.status(200).json({
      success: true,
      data: properties
    });

  } catch (error) {
    console.error("AVAILABLE PROPERTIES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===============================
   SALE PROPERTIES
=============================== */
exports.getPropertiesForSale = async (req, res) => {
  try {
    const properties = await Property.find({
      status: "Available",
      transactionType: "Sale"
    })
      .populate("owner", "name phone email")
      .populate("assignedClient", "name email");

    res.status(200).json({
      success: true,
      data: properties
    });

  } catch (error) {
    console.error("GET SALE PROPERTIES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===============================
   RENT PROPERTIES
=============================== */
exports.getPropertiesForRent = async (req, res) => {
  try {
    const properties = await Property.find({
      status: "Available",
      transactionType: "Rent"
    })
      .populate("owner", "name phone email")
      .populate("assignedClient", "name email");

    res.status(200).json({
      success: true,
      data: properties
    });

  } catch (error) {
    console.error("GET RENT PROPERTIES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===============================
   GET PROPERTY BY ID
=============================== */
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("owner", "name phone email")
      .populate("assignedClient", "name email");

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    res.status(200).json({
      success: true,
      data: property
    });

  } catch (error) {
    console.error("GET PROPERTY BY ID ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ===============================
   UPDATE PROPERTY
=============================== */
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("owner", "name phone email")
      .populate("assignedClient", "name email");

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    res.status(200).json({
      success: true,
      data: property
    });

  } catch (error) {
    console.error("UPDATE PROPERTY ERROR:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/* ===============================
   DELETE PROPERTY
=============================== */
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      message: "Property deleted successfully"
    });

  } catch (error) {
    console.error("DELETE PROPERTY ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
