const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const OwnerDocument = require("../models/OwnerDocument");

/* ===============================
   UPLOAD OWNER DOCUMENTS
   ADMIN ONLY
=============================== */
router.post(
  "/upload/:ownerId",
  protect,
  authorize("ADMIN"),
  upload.array("documents"),
  async (req, res) => {
    try {
      const { ownerId } = req.params;
      const { documentType } = req.body;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const docs = req.files.map((file) => ({
        owner: ownerId,
        documentType,
        fileName: file.originalname,
        filePath: file.path
      }));

      await OwnerDocument.insertMany(docs);

      res.json({ message: "Owner documents uploaded successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ===============================
   GET OWNER DOCUMENTS
   ADMIN ONLY
=============================== */
router.get(
  "/:ownerId",
  protect,
  authorize("ADMIN"),
  async (req, res) => {
    try {
      const docs = await OwnerDocument.find({
        owner: req.params.ownerId
      });

      res.json(docs);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
