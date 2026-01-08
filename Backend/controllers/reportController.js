const Customer = require("../models/Customer");
const generateCustomerExcel = require("../utils/generateCustomerExcel");

exports.downloadCustomerReport = async (req, res) => {
  const customers = await Customer.find();
  await generateCustomerExcel(res, customers);
};
