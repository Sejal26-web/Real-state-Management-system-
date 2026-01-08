import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* App Title */}
      <h2 className="sidebar-title">RealEstate CRM</h2>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/owners"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Owners
        </NavLink>

        <NavLink
          to="/properties"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Properties
        </NavLink>

        <NavLink
          to="/rentals"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Rentals
        </NavLink>

        <NavLink
          to="/sales"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Sales
        </NavLink>

        <NavLink
          to="/leads"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Leads
        </NavLink>

        <NavLink
          to="/customers"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          Customers
        </NavLink>
      </nav>

      {/* Footer / Logout */}
      <div className="sidebar-footer">
        <button className="logout-btn">Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
