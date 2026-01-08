const Rental = require("../models/Rental");
const Property = require("../models/Property");
const Customer = require("../models/Customer");

exports.createRental = async (req, res) => {
  try {
    const { propertyId, tenantId, rent, deposit } = req.body;

    // 1️⃣ Find property using propertyId
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // 2️⃣ Check availability
    if (property.status !== "Available") {
      return res
        .status(400)
        .json({ message: "Property already rented or sold" });
    }

    // 3️⃣ Find tenant
    const tenant = await Customer.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // 4️⃣ Create rental with correct fields
    const rental = await Rental.create({
      property: propertyId,
      tenant: tenantId,
      rent,
      deposit
    });

    // 5️⃣ Update property status
    property.status = "Rented";
    await property.save();

    res.status(201).json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
