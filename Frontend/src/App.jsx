import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Owners from "./pages/Owners";
import Properties from "./pages/Properties";
import Customers from "./pages/Customers";
import Rentals from "./pages/Rentals";
import Sales from "./pages/Sales";
import Leads from "./pages/Leads";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layouts/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/owners" element={<Owners />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/leads" element={<Leads />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
