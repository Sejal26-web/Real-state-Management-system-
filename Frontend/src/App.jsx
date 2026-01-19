import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* ================= AUTH ================= */
import Login from "./pages/auth/Login";

/* ================= ADMIN DASHBOARD ================= */
import Dashboard from "./pages/Dashboard";

/* ================= CLIENT DASHBOARD ================= */
import ClientDashboard from "./pages/ClientDashboard";
import ClientRentals from "./pages/client/ClientRentals";
import ClientPayments from "./pages/client/ClientPayments";
import ClientLeads from "./pages/client/ClientLeads";
import MyCustomer from "./pages/client/ClientCustomer"; // ✅ NEW

/* ================= OWNERS ================= */
import OwnerList from "./pages/owners/OwnerList";
import CreateOwner from "./pages/owners/CreateOwner";
import EditOwner from "./pages/owners/EditOwner";

/* ================= PROPERTIES ================= */
import PropertyList from "./pages/properties/PropertyList";
import CreateProperty from "./pages/properties/CreateProperty";
import EditProperty from "./pages/properties/EditProperty";
import PropertyDetails from "./pages/properties/PropertyDetail";

/* ================= RENTALS ================= */
import RentalList from "./pages/rentals/RentalList";
import CreateRental from "./pages/rentals/CreateRental";
import EditRental from "./pages/rentals/EditRental";

/* ================= SALES ================= */
import SaleList from "./pages/sales/SaleList";
import CreateSale from "./pages/sales/CreateSale";
import EditSale from "./pages/sales/EditSale";

/* ================= LEADS ================= */
import LeadList from "./pages/leads/LeadList";
import CreateLead from "./pages/leads/CreateLead";
import EditLead from "./pages/leads/EditLead";
import LeadDetail from "./pages/leads/LeadDetail";
import LeadReport from "./pages/leads/LeadReport";

/* ================= CUSTOMERS ================= */
import Customers from "./pages/customers/Customers";
import CreateCustomer from "./pages/customers/CreateCustomer";
import EditCustomer from "./pages/customers/EditCustomer";
import CustomerDetail from "./pages/customers/CustomerDetail";

/* ================= LAYOUT & AUTH ================= */
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Login />} />

      {/* ================= ADMIN SECTION ================= */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* LEADS */}
          <Route path="/leads" element={<LeadList />} />
          <Route path="/leads/create" element={<CreateLead />} />
          <Route path="/leads/edit/:id" element={<EditLead />} />
          <Route path="/leads/report" element={<LeadReport />} />
          <Route path="/leads/:id" element={<LeadDetail />} />

          {/* CUSTOMERS */}
          <Route path="/customers" element={<Customers />} />
          <Route path="/customers/create" element={<CreateCustomer />} />
          <Route path="/customers/edit/:id" element={<EditCustomer />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />

          {/* OWNERS */}
          <Route path="/owners" element={<OwnerList />} />
          <Route path="/owners/create" element={<CreateOwner />} />
          <Route path="/owners/edit/:id" element={<EditOwner />} />

          {/* PROPERTIES */}
          <Route path="/properties" element={<PropertyList />} />
          <Route path="/properties/create" element={<CreateProperty />} />
          <Route path="/properties/edit/:id" element={<EditProperty />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />

          {/* RENTALS */}
          <Route path="/rentals" element={<RentalList />} />
          <Route path="/rentals/create" element={<CreateRental />} />
          <Route path="/rentals/edit/:id" element={<EditRental />} />

          {/* SALES */}
          <Route path="/sales" element={<SaleList />} />
          <Route path="/sales/create" element={<CreateSale />} />
          <Route path="/sales/edit/:id" element={<EditSale />} />
        </Route>
      </Route>

      {/* ================= CLIENT SECTION ================= */}
      <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
        <Route element={<Layout />}>
          <Route path="/client/dashboard" element={<ClientDashboard />} />

          {/* ✅ CLIENT PROFILE */}
          <Route path="/client/my-customer" element={<MyCustomer />} />

          {/* CLIENT LEADS */}
          <Route path="/client/leads" element={<ClientLeads />} />
          <Route path="/client/leads/:id" element={<LeadDetail />} />

          {/* CLIENT RENTALS & PAYMENTS */}
          <Route path="/client/rentals" element={<ClientRentals />} />
          <Route path="/client/payments" element={<ClientPayments />} />
        </Route>
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
