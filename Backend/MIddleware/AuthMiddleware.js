const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* ============ AUTH (TOKEN CHECK) ============ */
exports.protect = async (req, res, next) => {
  try {
    let token = null;

    // ✅ READ AUTH HEADER SAFELY
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing"
      });
    }

    // ✅ VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload"
      });
    }

    // ✅ FETCH USER
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // ✅ ATTACH USER
    req.user = user;
    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired"
    });
  }
};

/* ============ ROLE CHECK ============ */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // ✅ NORMALIZE ROLES (FIXED)
    const userRole = String(req.user.role).toLowerCase();
    const allowedRoles = roles.map(r => String(r).toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    next();
  };
};
