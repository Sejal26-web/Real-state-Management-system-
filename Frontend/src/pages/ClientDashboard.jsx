import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/dashboard.css";

import StatCard from "../components/dashboard/StatCard";
import OverviewChart from "../components/dashboard/OverviewChart";

const ClientDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    myProperties: 0,
    activeRentals: 0,
    agreements: 0
  });
  const [payments, setPayments] = useState({
    paid: 0,
    pending: 0
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClientDashboard();
  }, []);

  const fetchClientDashboard = async () => {
    try {
      const res = await API.get("/client/dashboard");

      if (!res.data?.success) {
        throw new Error("Invalid response");
      }

      setSummary(res.data.data.summary);
      setPayments(res.data.data.payments);

    } catch (err) {
      console.error("Client dashboard load failed", err);
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
            <h1>Welcome 👋</h1>
            <p>Here’s a quick overview of your account</p>
          </div>
        </div>

        <div className="stats-grid">
          <StatCard title="My Properties" value={summary.myProperties} icon="🏠" />
          <StatCard title="Active Rentals" value={summary.activeRentals} icon="📄" />
          <StatCard title="My Agreements" value={summary.agreements} icon="📑" />
          <StatCard title="Total Paid" value={`₹${payments.paid}`} icon="💳" />
        </div>

        <div className="charts">
          <div className="chart-card">
            <OverviewChart
              revenue={{
                sales: payments.paid,
                rentals: payments.pending
              }}
              title="Payments Overview"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClientDashboard;
