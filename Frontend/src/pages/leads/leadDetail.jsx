import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchLead();
    if (user?.role === "admin") {
      fetchClients();
    }
  }, [id]);

  /* ================= FETCH LEAD ================= */
  const fetchLead = async () => {
    try {
      const res = await API.get(`/leads/${id}`);
      setLead(res.data.data);
    } catch (err) {
      alert("Unable to load lead");
      navigate("/leads");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH CLIENT USERS ================= */
  const fetchClients = async () => {
    try {
      const res = await API.get("/users?role=client");
      setClients(res.data.data || []);
    } catch (err) {
      console.error("Failed to load clients");
    }
  };

  /* ================= ASSIGN LEAD ================= */
  const assignLead = async () => {
    if (!selectedClient) {
      return alert("Please select a client");
    }

    try {
      await API.put(`/leads/${id}/assign`, {
        clientId: selectedClient
      });

      alert("Lead assigned successfully");
      fetchLead();
    } catch (err) {
      alert("Failed to assign lead");
    }
  };

  if (loading) return <p style={{ padding: 30 }}>Loading lead...</p>;
  if (!lead) return null;

  const siteVisits = lead.siteVisits || [];
  const activities = lead.activities || [];

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1>{lead.name}</h1>
          <p style={{ color: "#6b7280" }}>
            Lead details, site visits and activity history
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            style={styles.secondaryBtn}
            onClick={() =>
              user?.role === "client"
                ? navigate("/client/leads")
                : navigate("/leads")
            }
          >
            Back
          </button>

          {user?.role === "admin" && (
            <button
              style={styles.primaryBtn}
              onClick={() => navigate(`/leads/edit/${lead._id}`)}
            >
              Edit Lead
            </button>
          )}
        </div>
      </div>

      {/* GRID */}
      <div style={styles.grid}>
        {/* LEFT */}
        <div>
          {/* LEAD DETAILS */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Lead Details</h3>

            <div style={styles.detailsGrid}>
              <Detail label="Status" value={lead.status} />
              <Detail label="Source" value={lead.source || "—"} />
              <Detail label="Phone" value={lead.phone} />
              <Detail label="Email" value={lead.email || "—"} />
              <Detail label="Requirement" value={lead.requirementType} />
              <Detail
                label="Assigned Client"
                value={lead.assignedClient?.name || "Not assigned"}
              />
            </div>

            {/* ✅ ASSIGN CLIENT (ADMIN ONLY) */}
            {user?.role === "admin" && (
              <div style={{ marginTop: 20 }}>
                <h4 style={{ marginBottom: 8 }}>Assign to Client</h4>

                <div style={{ display: "flex", gap: 10 }}>
                  <select
                    value={selectedClient}
                    onChange={e => setSelectedClient(e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Select Client</option>
                    {clients.map(c => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.email})
                      </option>
                    ))}
                  </select>

                  <button style={styles.primaryBtn} onClick={assignLead}>
                    Assign
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SITE VISITS */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Site Visits</h3>
            {siteVisits.length === 0 ? (
              <p style={styles.muted}>No site visits scheduled</p>
            ) : (
              siteVisits.map((v, i) => (
                <div key={i} style={styles.listItem}>
                  <strong>
                    {v.visitDate
                      ? new Date(v.visitDate).toDateString()
                      : "—"}
                  </strong>
                  <span style={styles.badge}>{v.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Activity Timeline</h3>
          {activities.length === 0 ? (
            <p style={styles.muted}>No activity yet</p>
          ) : (
            activities.map((a, i) => (
              <div key={i} style={styles.timelineItem}>
                <div style={styles.dot} />
                <div>
                  <strong>{a.type}</strong>
                  <div>{a.description}</div>
                  <div style={styles.date}>
                    {new Date(a.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= SMALL COMPONENT ================= */
const Detail = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div>
    <div style={{ fontWeight: 600 }}>{value}</div>
  </div>
);

/* ================= STYLES ================= */
const styles = {
  page: { maxWidth: 1200, margin: "32px auto", padding: "0 24px" },
  header: { display: "flex", justifyContent: "space-between", marginBottom: 28 },
  grid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 },
  card: { background: "#fff", borderRadius: 18, padding: 24, marginBottom: 24 },
  cardTitle: { fontSize: 16, fontWeight: 700, marginBottom: 16 },
  detailsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  listItem: { display: "flex", justifyContent: "space-between", padding: "10px 0" },
  badge: { background: "#e0f2fe", color: "#0369a1", fontSize: 12, padding: "4px 10px", borderRadius: 999 },
  timelineItem: { display: "flex", gap: 12, marginBottom: 16 },
  dot: { width: 10, height: 10, background: "#2563eb", borderRadius: "50%" },
  date: { fontSize: 12, color: "#6b7280" },
  muted: { color: "#6b7280" },
  primaryBtn: { background: "#2563eb", color: "#fff", border: "none", padding: "10px 18px", borderRadius: 10 },
  secondaryBtn: { background: "#e5e7eb", border: "none", padding: "10px 18px", borderRadius: 10 },
  select: { padding: 10, borderRadius: 8, minWidth: 220 }
};

export default LeadDetail;
