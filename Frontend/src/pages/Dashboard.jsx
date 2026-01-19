import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/dashboard.css";

import StatCard from "../components/dashboard/StatCard";
import PropertyStatus from "../components/dashboard/PropertyStatus";
import OverviewChart from "../components/dashboard/OverviewChart";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const [leadStatus, setLeadStatus] = useState([]);
  const [revenue, setRevenue] = useState({ sales: 0, rentals: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");

      // 🔐 SAFE extraction
      const data = res.data?.data || res.data;

      setSummary(data?.summary || {});
      setLeadStatus(data?.leadStatus || []);
      setRevenue(data?.revenue || { sales: 0, rentals: 0 });

    } catch (err) {
      console.error("Dashboard load failed", err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="dashboard">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-inner dashboard-layout">

        <div className="dashboard-header">
          <div>
            <h1>Welcome back 👋</h1>
            <p>Here’s what’s happening in your real estate business</p>
          </div>
        </div>

        <div className="stats-grid">
          <StatCard title="Total Properties" value={summary.totalProperties ?? 0} icon="🏠" />
          <StatCard title="Active Rentals" value={summary.activeRentals ?? 0} icon="📄" />
          <StatCard title="Active Sales" value={summary.activeSales ?? 0} icon="💼" />
          <StatCard
            title="Total Revenue"
            value={`₹${(revenue.sales ?? 0) + (revenue.rentals ?? 0)}`}
            icon="💰"
          />
        </div>

        <div className="charts">
          <div className="chart-card">
            <OverviewChart revenue={revenue} />
          </div>

          <div className="chart-card">
            <PropertyStatus data={leadStatus} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
