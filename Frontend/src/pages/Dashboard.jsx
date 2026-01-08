import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeRentals: 0,
    salesInProgress: 0,
    leads: 0,
    converted: 0
  });

  useEffect(() => {
    // Example: Replace with real API later
    setStats({
      totalProperties: 7,
      activeRentals: 3,
      salesInProgress: 0,
      leads: 4,
      converted: 2
    });
  }, []);

  // Download Customer Report
  const downloadCustomerReport = () => {
    window.open(
      "http://localhost:5000/api/reports/customers/excel",
      "_blank"
    );
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Real Estate Management Overview</p>
      </header>

      {/* Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Properties</h3>
          <span>{stats.totalProperties}</span>
        </div>

        <div className="stat-card">
          <h3>Active Rentals</h3>
          <span>{stats.activeRentals}</span>
        </div>

        <div className="stat-card">
          <h3>Sales In Progress</h3>
          <span>{stats.salesInProgress}</span>
        </div>

        <div className="stat-card">
          <h3>Leads</h3>
          <span>{stats.leads}</span>
        </div>

        <div className="stat-card">
          <h3>Converted</h3>
          <span>{stats.converted}</span>
        </div>
      </div>

      {/* Reports Section */}
      <div className="reports-section" style={{ marginTop: "30px" }}>
        <h2>Reports</h2>

        <button
          className="report-btn"
          onClick={downloadCustomerReport}
        >
          Download Customer Report (Excel)
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
