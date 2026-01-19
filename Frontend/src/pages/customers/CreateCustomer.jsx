import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Toast from "../../components/common/Toast";

const CreateCustomer = () => {
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);

  const [form, setForm] = useState({
    userId: "",
    name: "",
    phone: "",
    email: "",
    type: "Buyer",
    propertyType: "",
    budget: "",
    location: ""
  });

  /* =========================
     FETCH CLIENT USERS
  ========================= */
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await API.get("/users?role=client");
      const data = res.data?.data || [];

      setClients(data);

      if (data.length === 0) {
        setToast({
          type: "error",
          message: "No client users found. Create a client first."
        });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Failed to load clients" });
    } finally {
      setLoadingClients(false);
    }
  };

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* =========================
     SUBMIT
  ========================= */
  const submit = async (e) => {
    e.preventDefault();

    if (!form.userId) {
      setToast({ type: "error", message: "Please select a client user" });
      return;
    }

    if (!form.name || !form.phone) {
      setToast({ type: "error", message: "Name & Phone are required" });
      return;
    }

    try {
      await API.post("/customers", {
        userId: form.userId,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email?.trim(),
        type: form.type,
        preferences: {
          propertyType: form.propertyType,
          budget: form.budget,
          location: form.location
        }
      });

      setToast({
        type: "success",
        message: "Customer created successfully"
      });

      setTimeout(() => navigate("/customers"), 1200);
    } catch (err) {
      console.error("CREATE CUSTOMER ERROR:", err);
      setToast({
        type: "error",
        message:
          err.response?.data?.message ||
          "Customer creation failed"
      });
    }
  };

  return (
    <div style={page}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* HEADER */}
      <div style={header}>
        <div>
          <h1 style={title}>Add Customer</h1>
          <p style={subtitle}>Create customer profile & preferences</p>
        </div>

        <button
          style={btnSecondary}
          onClick={() => navigate("/customers")}
        >
          Back
        </button>
      </div>

      {/* FORM */}
      <form onSubmit={submit}>
        <div style={grid}>
          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Card title="Client User">
              {loadingClients ? (
                <p>Loading clients…</p>
              ) : (
                <select
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  style={input}
                  required
                >
                  <option value="">Select Client</option>
                  {clients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              )}
            </Card>

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

          {/* RIGHT */}
          <div>
            <Card title="Actions">
              <button
                style={btnPrimary}
                type="submit"
                disabled={loadingClients || clients.length === 0}
              >
                Save Customer
              </button>
            </Card>
          </div>
        </div>
      </form>
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

/* ================= STYLES ================= */

const page = { padding: 32, background: "#f5f7fb", minHeight: "100vh" };
const header = { display: "flex", justifyContent: "space-between", marginBottom: 28 };
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
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db"
};

const btnPrimary = {
  width: "100%",
  background: "#2563eb",
  color: "#fff",
  padding: "12px",
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

export default CreateCustomer;
