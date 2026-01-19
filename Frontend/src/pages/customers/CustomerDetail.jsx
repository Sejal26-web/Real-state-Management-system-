import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const [logType, setLogType] = useState("Note");
  const [newLog, setNewLog] = useState("");

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const res = await API.get(`/customers/${id}`);
      setCustomer(res.data.data);
    } catch {
      navigate("/customers");
    } finally {
      setLoading(false);
    }
  };

  const addLog = async () => {
    if (!newLog.trim()) return;

    await API.post(`/customers/${id}/communication`, {
      type: logType,
      note: newLog
    });

    setNewLog("");
    fetchCustomer();
  };

  if (loading) return <p>Loading...</p>;
  if (!customer) return null;

  return (
    <div style={page}>
      {/* ================= HEADER ================= */}
      <div style={header}>
        <div>
          <h1 style={title}>{customer.name}</h1>
          <p style={subtitle}>
            {customer.type} • {customer.phone}
          </p>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button style={btnSecondary} onClick={() => navigate("/customers")}>
            Back
          </button>
          <button
            style={btnPrimary}
            onClick={() => navigate(`/customers/edit/${customer._id}`)}
          >
            Edit Customer
          </button>
        </div>
      </div>

      {/* ================= GRID ================= */}
      <div style={grid}>
        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <Card title="Customer Details">
            <Item label="Phone" value={customer.phone} />
            <Item label="Email" value={customer.email || "—"} />
            <Item label="Type" value={customer.type} />
          </Card>

          <Card title="Property Preferences">
            <Item
              label="Property Type"
              value={customer.preferences?.propertyType || "—"}
            />
            <Item
              label="Budget"
              value={customer.preferences?.budget || "—"}
            />
            <Item
              label="Location"
              value={customer.preferences?.location || "—"}
            />
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <Card title="Activity Timeline">
            {customer.communicationLogs?.length === 0 && (
              <p style={muted}>No activity yet</p>
            )}

            {customer.communicationLogs?.map((log, i) => (
              <div key={i} style={timelineItem}>
                <strong>{log.type}</strong>
                <p style={{ margin: "6px 0" }}>{log.note}</p>
                <span style={mutedSmall}>
                  {new Date(log.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}

            <div style={{ marginTop: 16 }}>
              <select
                value={logType}
                onChange={(e) => setLogType(e.target.value)}
                style={input}
              >
                <option>Note</option>
                <option>Call</option>
                <option>Meeting</option>
              </select>

              <textarea
                placeholder="Add a note"
                value={newLog}
                onChange={(e) => setNewLog(e.target.value)}
                style={{ ...input, marginTop: 10 }}
              />

              <button
                style={{ ...btnPrimary, marginTop: 12, width: "100%" }}
                onClick={addLog}
              >
                Add Activity
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

/* ================= UI HELPERS ================= */

const Card = ({ title, children }) => (
  <div style={card}>
    <h3 style={cardTitle}>{title}</h3>
    {children}
  </div>
);

const Item = ({ label, value }) => (
  <p style={{ marginBottom: 8 }}>
    <strong>{label}:</strong> {value}
  </p>
);

/* ================= STYLES ================= */

const page = {
  padding: 32,
  background: "#f5f7fb",
  minHeight: "100vh"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 32
};

const title = { fontSize: 28, fontWeight: 700 };
const subtitle = { color: "#6b7280", marginTop: 4 };

const grid = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: 24
};

const card = {
  background: "#fff",
  borderRadius: 18,
  padding: 24,
  boxShadow: "0 14px 30px rgba(0,0,0,0.08)"
};

const cardTitle = {
  fontSize: 16,
  fontWeight: 700,
  marginBottom: 14
};

const input = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db"
};

const btnPrimary = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer"
};

const btnSecondary = {
  background: "#e5e7eb",
  border: "none",
  padding: "10px 18px",
  borderRadius: 10,
  fontWeight: 600,
  cursor: "pointer"
};

const muted = { color: "#6b7280" };
const mutedSmall = { fontSize: 12, color: "#6b7280" };

const timelineItem = {
  borderLeft: "3px solid #2563eb",
  paddingLeft: 12,
  marginBottom: 16
};

export default CustomerDetail;
