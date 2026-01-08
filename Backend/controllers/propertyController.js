const Property = require("../models/Property");

exports.createProperty = async (req, res) => {
  const property = await Property.create(req.body);
  res.status(201).json(property);
};

exports.getProperties = async (req, res) => {
  const properties = await Property.find().populate("owner");
  res.json(properties);
};

exports.getPropertyById = async (req, res) => {
  const property = await Property.findById(req.params.id).populate("owner");
  if (!property)
    return res.status(404).json({ message: "Property not found" });
  res.json(property);
};

exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({
      message: "Property updated successfully",
      data: property
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property)
    return res.status(404).json({ message: "Property not found" });

  if (property.status !== "Available") {
    return res
      .status(400)
      .json({ message: "Cannot delete property with active rental/sale" });
  }

  await property.deleteOne();
  res.json({ message: "Property deleted" });
};
