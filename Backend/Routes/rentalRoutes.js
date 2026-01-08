// Backend/Routes/rentalRoutes.js

const express = require("express");
const router = express.Router();

const protect = require("../Middleware/AuthMiddleware");

const {
  createRental,
  getRentals,
  addRentPayment,
  moveOut
} = require("../controllers/rentalController");


// Rental Routes


// Create Rental (Admin, Agent)
router.post("/create", protect(["admin", "agent"]), createRental);

// Get All Rentals (Admin, Agent)
router.get("/", protect(["admin", "agent"]), getRentals);

// Add Rent Payment (Admin, Agent)
router.post("/:id/payment", protect(["admin", "agent"]), addRentPayment);

// Move Out / Close Rental (Admin)
router.put("/:id/moveout", protect(["admin"]), moveOut);

module.exports = router;
