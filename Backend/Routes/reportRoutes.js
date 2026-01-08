const express = require("express");
const router = express.Router();
const { downloadCustomerReport } = require("../controllers/reportController");

router.get("/customers/excel", downloadCustomerReport);

module.exports = router;
