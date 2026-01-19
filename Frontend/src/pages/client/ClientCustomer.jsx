import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Toast from "../../components/common/Toast";

const MyCustomer = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  /* =========================
     FETCH MY CUSTOMER
  ========================= */
  useEffect(() => {
    fetchMyCustomer();
  }, []);

  const fetchMyCustomer = async () => {
    try {
      const res = await API.get("/customers/my");
      setCustomer(res.data?.data || null);
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        message: "No customer profile found for this account"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p style={{ padding: 24 }}>Loading customer profile...</p>;
  }

  if (!customer) {
    return (
      <div style={{ padding: 24 }}>
        <h2>My Profile</h2>
        <p>No customer profile linked yet.</p>
      </div>
    );
  }

  const { name, phone, email, type, preferences } = customer;

  return (
    <div style={page}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <h1 style={title}>My Profile</h1>
      <p style={subtitle}>Your customer information</p>

      <div style={card}>
        <Section title="Basic Information">
          <Row label="Name" value={name} />
          <Row label="Phone" value={phone} />
          <Row label="Email" value={email || "-"} />
          <Row label="Type" value={type} />
        </Section>

        <Section title="Preferences">
          <Row
            label="Property Type"
            value={preferences?.propertyType || "-"}
          />
          <Row
            label="Budget"
            value={preferences?.budget || "-"}
          />
          <Row
            label="Preferred Location"
            value={preferences?.location || "-"}
          />
        </Section>
      </div>
    </div>
  );
};

/* ================= UI HELPERS ================= */

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 24 }}>
    <h3 style={sectionTitle}>{title}</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {children}
    </div>
  </div>
);

const Row = ({ label, value }) => (
  <div style={row}>
    <span style={rowLabel}>{label}</span>
    <span style={rowValue}>{value}</span>
  </div>
);

/* ================= STYLES ================= */

const page = {
  padding: 32,
  background: "#f5f7fb",
  minHeight: "100vh"
};

const title = {
  fontSize: 28,
  fontWeight: 700
};

const subtitle = {
  color: "#6b7280",
  marginBottom: 24
};

const card = {
  background: "#fff",
  borderRadius: 18,
  padding: 24,
  maxWidth: 600,
  boxShadow: "0 14px 30px rgba(0,0,0,0.08)"
};

const sectionTitle = {
  fontWeight: 700,
  marginBottom: 12
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  borderBottom: "1px solid #e5e7eb",
  paddingBottom: 8
};

const rowLabel = {
  color: "#6b7280",
  fontWeight: 500
};

const rowValue = {
  fontWeight: 600
};

export default MyCustomer;
