const express = require("express");
const router = express.Router();
const { downloadQuotationPDF } = require("../controllers/quotationController");

router.get("/:id/pdf", downloadQuotationPDF);

module.exports = router;
