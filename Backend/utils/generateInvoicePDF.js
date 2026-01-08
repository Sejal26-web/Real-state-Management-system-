const PDFDocument = require("pdfkit");

const generateInvoicePDF = (res, invoice) => {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${invoice._id}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(20).text("INVOICE", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Customer: ${invoice.customerName}`);
  doc.text(`Property: ${invoice.propertyName}`);
  doc.text(`Amount: ₹${invoice.amount}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.end();
};

module.exports = generateInvoicePDF;
