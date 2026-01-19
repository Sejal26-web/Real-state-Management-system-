import { Navigate, Outlet } from "react-router-dom";
import React from "react";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ Not logged in
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // ❌ Role not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Authorized
  return <Outlet />;
};

export default ProtectedRoute;
