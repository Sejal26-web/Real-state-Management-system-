const express = require("express");
const router = express.Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const PropertyDocument = require("../models/PropertyDocument");

/* ===============================
   UPLOAD PROPERTY DOCUMENTS
   ADMIN ONLY
=============================== */
router.post(
  "/upload/:propertyId",
  protect,
  authorize("ADMIN"),
  upload.array("documents", 10),
  async (req, res) => {
    try {
      const { documentType } = req.body;
      const propertyId = req.params.propertyId;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const docs = req.files.map((file) => {
        const normalizedPath = file.path.replace(/\\/g, "/");

        return {
          property: propertyId,
          documentType,
          fileName: file.originalname,
          filePath: normalizedPath,
          fileUrl: `${req.protocol}://${req.get("host")}/${normalizedPath}`
        };
      });

      await PropertyDocument.insertMany(docs);

      res.json({
        success: true,
        message: "Documents uploaded successfully"
      });
    } catch (err) {
      console.error("UPLOAD PROPERTY DOC ERROR:", err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

/* ===============================
   GET DOCUMENTS BY PROPERTY
   ADMIN ONLY
=============================== */
router.get(
  "/:propertyId",
  protect,
  authorize("ADMIN"),
  async (req, res) => {
    try {
      const docs = await PropertyDocument.find({
        property: req.params.propertyId
      }).sort({ createdAt: -1 });

      res.json(docs);
    } catch (err) {
      console.error("GET PROPERTY DOC ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
