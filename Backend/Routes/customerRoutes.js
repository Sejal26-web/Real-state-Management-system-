const express = require("express");
const router = express.Router();
const protect = require("../Middleware/AuthMiddleware");

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  addCommunicationLog,
  addFollowUp,
  addReferral,
  deleteCustomer
} = require("../controllers/customerController");

// Customer CRUD
router.post("/", protect(["admin", "agent"]), createCustomer);
router.get("/", protect(["admin", "agent"]), getCustomers);
router.get("/:id", protect(["admin", "agent"]), getCustomerById);
router.put("/:id", protect(["admin", "agent"]), updateCustomer);

// Activity tracking (Test cases 28, 29, 30)
router.post("/:id/communications", protect(["admin", "agent"]), addCommunicationLog);
router.post("/:id/followups", protect(["admin", "agent"]), addFollowUp);
router.post("/:id/referrals", protect(["admin", "agent"]), addReferral);

// Delete
router.delete("/:id", protect(["admin"]), deleteCustomer);

module.exports = router;
