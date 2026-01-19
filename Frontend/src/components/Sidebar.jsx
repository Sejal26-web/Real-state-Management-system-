import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  /* =========================
     REDIRECT IF NOT LOGGED IN
  ========================= */
  useEffect(() => {
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <aside className="sidebar">
      {/* HEADER */}
      <div className="sidebar-header">
        <h2>CRM</h2>
        <p>{user.role === "admin" ? "Admin Panel" : "Client Panel"}</p>
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-nav">
        {user.role === "admin" ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>

            <NavLink to="/leads">Leads</NavLink>
            <NavLink to="/customers">Customers</NavLink>

            {/* ✅ OWNERS (RESTORED) */}
            <NavLink to="/owners">Owners</NavLink>

            <NavLink to="/properties">Properties</NavLink>
            <NavLink to="/rentals">Rentals</NavLink>
            <NavLink to="/sales">Sales</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/client/dashboard">Dashboard</NavLink>
            <NavLink to="/client/my-customer">My Profile</NavLink>
            <NavLink to="/client/leads">My Leads</NavLink>
            <NavLink to="/client/rentals">My Rentals</NavLink>
            <NavLink to="/client/payments">Payments</NavLink>
          </>
        )}
      </nav>

      {/* LOGOUT */}
      <button
        className="logout-btn"
        onClick={() => {
          localStorage.clear();
          navigate("/", { replace: true });
        }}
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
