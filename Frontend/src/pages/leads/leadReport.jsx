import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import "../../styles/lead.css";

const LeadReport = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/leads/stats/summary");
      setStats(res.data.data || []);
    } catch (err) {
      console.error("Failed to load lead report", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p style={{ padding: 20 }}>Loading lead report...</p>;
  }

  return (
    <div className="lead-container">
      <h2 className="lead-title">Lead Conversion Report</h2>

      {stats.length === 0 ? (
        <p>No report data available</p>
      ) : (
        <table className="lead-table-list">
          <thead>
            <tr>
              <th>Status</th>
              <th>Total Leads</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((item) => (
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeadReport;
