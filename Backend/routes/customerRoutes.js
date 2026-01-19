const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");

const {
  createCustomer,
  getCustomers,
  getCustomerById,
  getMyCustomer,
  updateCustomer,
  deleteCustomer
} = require("../controllers/customerController");

/* =========================
   CLIENT ROUTE (MUST BE FIRST)
========================= */
router.get(
  "/my",
  protect,
  authorize("client"),
  getMyCustomer
);

/* =========================
   ADMIN CRUD
========================= */
router.post("/", protect, authorize("admin"), createCustomer);
router.get("/", protect, authorize("admin"), getCustomers);
router.get("/:id", protect, authorize("admin"), getCustomerById);
router.put("/:id", protect, authorize("admin"), updateCustomer);
router.delete("/:id", protect, authorize("admin"), deleteCustomer);

module.exports = router;
