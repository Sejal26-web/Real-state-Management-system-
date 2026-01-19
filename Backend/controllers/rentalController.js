const Rental = require("../models/Rental");
const Property = require("../models/Property");
const Customer = require("../models/Customer");

/* ======================
   ADMIN: CREATE RENTAL
====================== */
exports.createRental = async (req, res) => {
  try {
    const {
      propertyId,
      tenantId,
      rentAmount,
      securityDeposit,
      startDate,
      endDate,
      moveInDate
    } = req.body;

    if (!propertyId || !tenantId || !rentAmount || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const property = await Property.findById(propertyId);
    const tenant = await Customer.findById(tenantId).populate("user");

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    if (!tenant || !tenant.user) {
      return res.status(400).json({
        success: false,
        message: "Tenant is not linked to a client user"
      });
    }

    if (property.status !== "Available") {
      return res.status(400).json({
        success: false,
        message: "Property is not available"
      });
    }

    const rental = await Rental.create({
      client: tenant.user._id,          // 🔑 CLIENT LINK (MOST IMPORTANT)
      tenant: tenant._id,
      property: property._id,
      rentAmount: Number(rentAmount),
      securityDeposit: Number(securityDeposit || 0),
      startDate,
      endDate,
      moveInDate: moveInDate || startDate,
      payments: []
    });

    property.status = "Rented";
    property.assignedClient = tenant.user._id;
    await property.save();

    res.status(201).json({
      success: true,
      data: rental
    });

  } catch (err) {
    console.error("CREATE RENTAL ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* ======================
   ADMIN: GET ALL RENTALS
====================== */
exports.getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate("property", "type locality status")
      .populate("tenant", "name phone")
      .populate("client", "name email");

    res.status(200).json({
      success: true,
      data: rentals
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* ======================
   ADMIN: GET RENTAL BY ID
====================== */
exports.getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate("property")
      .populate("tenant")
      .populate("client");

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental not found"
      });
    }

    res.status(200).json({
      success: true,
      data: rental
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* ======================
   ADMIN: UPDATE RENTAL
====================== */
exports.updateRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental not found"
      });
    }

    const allowedFields = [
      "rentAmount",
      "status",
      "endDate",
      "moveOutDate",
      "moveOutReason"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        rental[field] = req.body[field];
      }
    });

    if (["Vacated", "Terminated"].includes(rental.status)) {
      await Property.findByIdAndUpdate(rental.property, {
        status: "Available",
        assignedClient: null
      });
    }

    await rental.save();

    res.status(200).json({
      success: true,
      data: rental
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* ======================
   ADMIN: ADD PAYMENT
====================== */
exports.addPayment = async (req, res) => {
  try {
    const { amount, note } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount"
      });
    }

    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental not found"
      });
    }

    rental.payments.push({
      amount: Number(amount),
      note
    });

    await rental.save();

    res.status(200).json({
      success: true,
      data: rental
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* ======================
   ADMIN: MOVE OUT
====================== */
exports.moveOutRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental not found"
      });
    }

    rental.status = "Vacated";
    rental.moveOutDate = new Date();
    await rental.save();

    await Property.findByIdAndUpdate(rental.property, {
      status: "Available",
      assignedClient: null
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* ======================
   ADMIN: DELETE RENTAL
====================== */
exports.deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental not found"
      });
    }

    await Property.findByIdAndUpdate(rental.property, {
      status: "Available",
      assignedClient: null
    });

    await rental.deleteOne();

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* ======================
   CLIENT: MY RENTALS
====================== */
exports.getMyRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({
      client: req.user._id
    })
      .populate("property", "type locality")
      .populate("tenant", "name phone");

    res.status(200).json({
      success: true,
      data: rentals
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
