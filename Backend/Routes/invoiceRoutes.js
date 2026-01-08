const express = require("express");
const router = express.Router();
const { downloadInvoicePDF } = require("../controllers/invoiceController");

router.get("/:id/pdf", downloadInvoicePDF);

module.exports = router;
