const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadDocuments,
  getDocuments,
  deleteDocument
} = require("../controllers/documentController");

router.post(
  "/upload",
  protect(["admin", "agent"]),
  upload.array("files", 10), // MULTI FILE
  uploadDocuments
);

router.get(
  "/:modelType/:modelId",
  protect(["admin", "agent"]),
  getDocuments
);

router.delete(
  "/:id",
  protect(["admin"]),
  deleteDocument
);

module.exports = router;
