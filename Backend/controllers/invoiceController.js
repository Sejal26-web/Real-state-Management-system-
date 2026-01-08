const generateInvoicePDF = require("../utils/generateInvoicePDF");

exports.downloadInvoicePDF = async (req, res) => {
  const invoice = {
    _id: req.params.id,
    customerName: "Demo Customer",
    propertyName: "2BHK Flat",
    amount: 50000
  };

  generateInvoicePDF(res, invoice);
};
