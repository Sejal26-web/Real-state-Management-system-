const express = require("express");
const router = express.Router();
const protect = require("../Middleware/AuthMiddleware");
const {
  createOwner,
  getOwners,
  getOwnerById,
  updateOwner,
  deleteOwner
} = require("../controllers/ownerController");

router.post("/", protect(["admin"]), createOwner);
router.get("/", protect(["admin", "agent"]), getOwners);
router.get("/:id", protect(["admin", "agent"]), getOwnerById);
router.put("/:id", protect(["admin"]), updateOwner);
router.delete("/:id", protect(["admin"]), deleteOwner);

module.exports = router;
