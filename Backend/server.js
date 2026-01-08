const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// =======================
// Middleware
// =======================
app.use(cors());
app.use(express.json());

// =======================
// Routes (ALL IMPORTS)
// =======================
const authRoutes = require("./routes/authRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const customerRoutes = require("./routes/customerRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const saleRoutes = require("./routes/saleRoutes");
const leadRoutes = require("./routes/leadRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// 🔹 NEW REPORTING ROUTES
const reportRoutes = require("./routes/reportRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const quotationRoutes = require("./routes/quotationRoutes");

// =======================
// Route Registration
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/owners", ownerRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 🔹 Reports / Documents
app.use("/api/reports", reportRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/quotations", quotationRoutes);

// =======================
// Server
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
