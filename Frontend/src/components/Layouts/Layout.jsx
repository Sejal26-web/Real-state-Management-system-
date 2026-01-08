import React from "react";
import Sidebar from "../Sidebar";
import { Outlet } from "react-router-dom";
import "./Layout.css";

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Outlet /> {/* 🔥 REQUIRED */}
      </div>
    </div>
  );
};

export default Layout;
