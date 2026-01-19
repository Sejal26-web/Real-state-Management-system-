const User = require("../models/User");

/* ================= GET USERS (ADMIN) ================= */
exports.getUsers = async (req, res) => {
  try {
    let query = {};

    // filter by role if passed
    if (req.query.role) {
      query.role = req.query.role;
    }

    const users = await User.find(query)
      .select("name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* ================= GET AGENTS / CLIENTS (ADMIN) ================= */
// ✅ THIS IS WHAT YOUR FRONTEND NEEDS
exports.getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: "client" })
      .select("_id name email")
      .sort({ createdAt: -1 });

    res.status(200).json(agents);
  } catch (err) {
    console.error("Get agents error:", err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
