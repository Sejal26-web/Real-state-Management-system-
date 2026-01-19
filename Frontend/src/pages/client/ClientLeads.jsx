import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

const ClientLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await API.get("/leads");
      setLeads(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch client leads", err);
      alert("Unable to load leads");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ padding: 30 }}>Loading leads...</p>;

  return (
    <div style={{ padding: 30 }}>
      <h2 style={{ marginBottom: 20 }}>My Leads</h2>

      {leads.length === 0 ? (
        <p>No leads assigned to you</p>
      ) : (
        leads.map(lead => (
          <div
            key={lead._id}
            onClick={() => navigate(`/leads/${lead._id}`)}
            style={styles.card}
          >
            <div style={styles.row}>
              <strong>{lead.name}</strong>
              <span style={styles.badge}>{lead.status}</span>
            </div>

            <div style={styles.muted}>{lead.phone}</div>
            <div style={styles.muted}>
              {lead.requirementType || "—"}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  card: {
    background: "#fff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(0,0,0,0.08)"
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  badge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600
  },
  muted: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 4
  }
};

export default ClientLeads;
