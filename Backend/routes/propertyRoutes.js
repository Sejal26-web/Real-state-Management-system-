const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const {
  createProperty,
  getProperties,
  getAvailableProperties,
  getPropertiesForSale,
  getPropertiesForRent,
  getPropertyById,
  updateProperty,
  deleteProperty
} = require("../controllers/propertyController");

/* ===============================
   PROPERTY ROUTES
=============================== */

// CREATE PROPERTY (ADMIN ONLY)
router.post(
  "/",
  protect,
  authorize("admin"),
  createProperty
);

// GET ALL PROPERTIES (ADMIN ONLY)
router.get(
  "/",
  protect,
  authorize("admin"),
  getProperties
);

// ✅ AVAILABLE PROPERTIES (KEEP ABOVE :id)
router.get(
  "/available",
  protect,
  authorize("admin"),
  getAvailableProperties
);

// SALE PROPERTIES
router.get(
  "/for-sale",
  protect,
  authorize("admin"),
  getPropertiesForSale
);

// RENT PROPERTIES
router.get(
  "/for-rent",
  protect,
  authorize("admin"),
  getPropertiesForRent
);

// ❗ GENERIC ROUTES LAST
router.get(
  "/:id",
  protect,
  authorize("admin"),
  getPropertyById
);

// UPDATE PROPERTY
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateProperty
);

// DELETE PROPERTY
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteProperty
);

module.exports = router;
