const ExcelJS = require("exceljs");

const generateCustomerExcel = async (res, customers) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Customers");

  sheet.columns = [
    { header: "Name", key: "name", width: 20 },
    { header: "Email", key: "email", width: 30 },
    { header: "Phone", key: "phone", width: 15 },
    { header: "Type", key: "type", width: 15 }
  ];

  customers.forEach(c => {
    sheet.addRow({
      name: c.name,
      email: c.email,
      phone: c.phone,
      type: c.type
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=customer-report.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
};

module.exports = generateCustomerExcel;
