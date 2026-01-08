// Backend/controllers/rentalController.js

const Rental = require("../models/Rental"); // make sure model exists

// CREATE RENTAL
exports.createRental = async (req, res) => {
  try {
    const rental = await Rental.create(req.body);

    res.status(201).json({
      success: true,
      message: "Rental created successfully",
      data: rental
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL RENTALS
exports.getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find();

    res.status(200).json({
      success: true,
      count: rentals.length,
      data: rentals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ADD RENT PAYMENT
exports.addRentPayment = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental not found"
      });
    }

    rental.payments.push({
      amount: req.body.amount,
      date: new Date()
    });

    await rental.save();

    res.status(200).json({
      success: true,
      message: "Rent payment added",
      data: rental
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// MOVE OUT TENANT
exports.moveOut = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: "Rental not found"
      });
    }

    rental.status = "Inactive";
    rental.moveOutDate = new Date();

    await rental.save();

    res.status(200).json({
      success: true,
      message: "Tenant moved out successfully",
      data: rental
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
