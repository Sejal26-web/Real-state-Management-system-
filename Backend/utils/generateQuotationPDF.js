const PDFDocument = require("pdfkit");

const generateQuotationPDF = (res, quotation) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=quotation-${quotation._id}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(20).text("QUOTATION", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Client: ${quotation.clientName}`);
  doc.text(`Service: ${quotation.service}`);
  doc.text(`Estimated Cost: ₹${quotation.amount}`);

  doc.end();
};

module.exports = generateQuotationPDF;
