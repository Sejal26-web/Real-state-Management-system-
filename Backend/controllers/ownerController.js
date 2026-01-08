const Owner = require("../models/Owner");

exports.createOwner = async (req, res) => {
  const owner = await Owner.create(req.body);
  res.status(201).json(owner);
};

exports.getOwners = async (req, res) => {
  const owners = await Owner.find();
  res.json(owners);
};

exports.getOwnerById = async (req, res) => {
  const owner = await Owner.findById(req.params.id);
  if (!owner) return res.status(404).json({ message: "Owner not found" });
  res.json(owner);
};

exports.updateOwner = async (req, res) => {
  const owner = await Owner.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(owner);
};

exports.deleteOwner = async (req, res) => {
  await Owner.findByIdAndDelete(req.params.id);
  res.json({ message: "Owner deleted" });
};
