import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import Toast from "../../components/common/Toast";

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    type: "Buyer",
    propertyType: "",
    budget: "",
    location: ""
  });

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      const res = await API.get(`/customers/${id}`);
      const c = res.data.data;

      setForm({
        name: c.name || "",
        phone: c.phone || "",
        email: c.email || "",
        type: c.type || "Buyer",
        propertyType: c.preferences?.propertyType || "",
        budget: c.preferences?.budget || "",
        location: c.preferences?.location || ""
      });
    } catch {
      navigate("/customers");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      await API.put(`/customers/${id}`, {
        name: form.name,
        phone: form.phone,
        email: form.email,
        type: form.type,
        preferences: {
          propertyType: form.propertyType,
          budget: form.budget,
          location: form.location
        }
      });

      setToast({ message: "Customer updated successfully", type: "success" });
      setTimeout(() => navigate("/customers"), 1200);
    } catch {
      setToast({ message: "Update failed", type: "error" });
    }
  };

  return (
    <div style={page}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* ================= HEADER ================= */}
      <div style={header}>
        <div>
          <h1 style={title}>Edit Customer</h1>
          <p style={subtitle}>Update customer profile & preferences</p>
        </div>

        <button style={btnSecondary} onClick={() => navigate("/customers")}>
          Back
        </button>
      </div>

      {/* ================= GRID (SAME AS CREATE) ================= */}
      <div style={grid}>
        {/* LEFT COLUMN */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Card title="Basic Information">
            <Input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
            />
            <Input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
            />
            <Input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              style={input}
            >
              <option>Buyer</option>
              <option>Seller</option>
              <option>Tenant</option>
              <option>Landlord</option>
            </select>
          </Card>

          <Card title="Property Preferences">
            <select
              name="propertyType"
              value={form.propertyType}
              onChange={handleChange}
              style={input}
            >
              <option value="">Property Type</option>
              <option>Flat</option>
              <option>Villa</option>
              <option>Plot</option>
              <option>Commercial</option>
            </select>

            <Input
              name="budget"
              placeholder="Budget"
              value={form.budget}
              onChange={handleChange}
            />
            <Input
              name="location"
              placeholder="Preferred Location"
              value={form.location}
              onChange={handleChange}
            />
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <Card title="Actions">
            <button style={btnPrimary} onClick={submit}>
              Update Customer
            </button>

            <button
              style={{ ...btnSecondary, width: "100%", marginTop: 12 }}
              onClick={() => navigate("/customers")}
            >
              Cancel
            </button>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {children}
    </div>
  </div>
);

const Input = (props) => <input {...props} style={input} />;

/* ================= STYLES (SAME AS CREATE) ================= */

const page = { padding: 32, background: "#f5f7fb", minHeight: "100vh" };

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 28
};

const title = { fontSize: 28, fontWeight: 700 };
const subtitle = { color: "#6b7280" };

const grid = { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 };

const card = {
  background: "#fff",
  borderRadius: 18,
  padding: 24,
  boxShadow: "0 14px 30px rgba(0,0,0,0.08)"
};

const cardTitle = { fontWeight: 700, marginBottom: 14 };

const input = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #d1d5db"
};

const btnPrimary = {
  width: "100%",
  background: "#2563eb",
  color: "#fff",
  padding: "14px",
  borderRadius: 12,
  border: "none",
  fontWeight: 600,
  cursor: "pointer"
};

const btnSecondary = {
  background: "#e5e7eb",
  padding: "10px 16px",
  borderRadius: 10,
  border: "none",
  fontWeight: 600,
  cursor: "pointer"
};

export default EditCustomer;
