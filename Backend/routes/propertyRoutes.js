const express = require("express");
const router = express.Router();
const protect = require("../Middleware/AuthMiddleware");
const {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
} = require("../controllers/propertyController");

router.post("/", protect(["admin"]), createProperty);
router.get("/", protect(["admin", "agent"]), getProperties);
router.get("/:id", protect(["admin", "agent"]), getPropertyById);
router.put("/:id", protect(["admin"]), updateProperty);
router.delete("/:id", protect(["admin"]), deleteProperty);

module.exports = router;
