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

// 🔥 SERVE UPLOADED FILES
app.use("/uploads", express.static("uploads"));

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

// 🔹 REPORTING ROUTES
const reportRoutes = require("./routes/reportRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const quotationRoutes = require("./routes/quotationRoutes");

// 🔥 DOCUMENT ROUTES
const propertyDocumentRoutes = require("./routes/propertyDocumentRoutes");
const ownerDocumentRoutes = require("./routes/ownerDocumentRoutes");

// 🔥 RENT PAYMENT ROUTES
const rentPaymentRoutes = require("./routes/rentPaymentRoutes");

// ✅ CLIENT DASHBOARD ROUTES
const clientRoutes = require("./routes/clientRoutes");

// ✅ USERS ROUTES (🔥 THIS WAS MISSING)
const userRoutes = require("./routes/userRoutes");

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

// 🔥 DOCUMENT APIs
app.use("/api/property-documents", propertyDocumentRoutes);
app.use("/api/owner-documents", ownerDocumentRoutes);

// 🔥 RENT PAYMENTS API
app.use("/api/rent-payments", rentPaymentRoutes);

// ✅ CLIENT DASHBOARD API
app.use("/api/client", clientRoutes);

// ✅ USERS API (🔥 REQUIRED FOR ASSIGN LEAD)
app.use("/api/users", userRoutes);

// =======================
// Server
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
