const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
  createOwner,
  getOwners,
  getOwnerById,
  updateOwner,
  deleteOwner
} = require("../controllers/ownerController");

// ================= CREATE (with file upload) =================
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.array("documents"),
  createOwner
);

// ================= READ =================
router.get(
  "/",
  protect,
  authorize("admin"),
  getOwners
);

router.get(
  "/:id",
  protect,
  authorize("admin"),
  getOwnerById
);

// ================= UPDATE =================
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateOwner
);

// ================= DELETE =================
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteOwner
);

module.exports = router;
