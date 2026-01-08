const generateQuotationPDF = require("../utils/generateQuotationPDF");

exports.downloadQuotationPDF = async (req, res) => {
  const quotation = {
    _id: req.params.id,
    clientName: "Demo Client",
    service: "Property Sale",
    amount: 75000
  };

  generateQuotationPDF(res, quotation);
};
