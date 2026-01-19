import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Toast from "../../components/common/Toast";

const CreateProperty = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [owners, setOwners] = useState([]);

  const [form, setForm] = useState({
    owner: "",
    type: "",
    transactionType: "",
    locality: "",
    price: "",
    area: "",
    amenities: [],
    compliance: {
      hasSaleDeed: false,
      hasNOC: false,
      hasTaxReceipt: false,
      remarks: ""
    }
  });

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    const res = await API.get("/owners");
    setOwners(res.data.data || []);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleComplianceChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({
      ...form,
      compliance: {
        ...form.compliance,
        [name]: type === "checkbox" ? checked : value
      }
    });
  };

  const toggleAmenity = (amenity) => {
    setForm({
      ...form,
      amenities: form.amenities.includes(amenity)
        ? form.amenities.filter((a) => a !== amenity)
        : [...form.amenities, amenity]
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/properties", {
        ...form,
        price: Number(form.price),
        area: Number(form.area)
      });

      setToast({ message: "Property created successfully", type: "success" });
      setTimeout(() => navigate("/properties"), 1200);
    } catch (err) {
      setToast({ message: "Failed to create property", type: "error" });
    }
  };

  return (
    <div style={page}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* HEADER */}
      <div style={header}>
        <div>
          <h1 style={title}>Add Property</h1>
          <p style={subtitle}>Create property details & compliance</p>
        </div>

        <button style={btnSecondary} onClick={() => navigate("/properties")}>
          Back
        </button>
      </div>

      {/* GRID */}
      <div style={grid}>
        {/* LEFT FORM */}
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Card title="Basic Information">
            <select name="owner" value={form.owner} onChange={handleChange} style={input}>
              <option value="">Select Owner</option>
              {owners.map((o) => (
                <option key={o._id} value={o._id}>{o.name}</option>
              ))}
            </select>

            <select name="type" value={form.type} onChange={handleChange} style={input}>
              <option value="">Property Type</option>
              <option>Flat</option>
              <option>Villa</option>
              <option>Plot</option>
              <option>Commercial</option>
            </select>

            <select
              name="transactionType"
              value={form.transactionType}
              onChange={handleChange}
              style={input}
            >
              <option value="">Transaction Type</option>
              <option>Sale</option>
              <option>Rent</option>
            </select>

            <input
              name="locality"
              placeholder="Locality / Area"
              value={form.locality}
              onChange={handleChange}
              style={input}
            />
          </Card>

          <Card title="Property Details">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              style={input}
            />
            <input
              type="number"
              name="area"
              placeholder="Area (sq ft)"
              value={form.area}
              onChange={handleChange}
              style={input}
            />
          </Card>

          <Card title="Amenities">
            <div style={checkboxGrid}>
              {["Parking", "Lift", "Power Backup", "Security", "Garden", "Gym"].map((a) => (
                <label key={a} style={checkboxItem}>
                  <input
                    type="checkbox"
                    checked={form.amenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                  />
                  {a}
                </label>
              ))}
            </div>
          </Card>

          <Card title="Compliance Records">
            <label><input type="checkbox" name="hasSaleDeed" checked={form.compliance.hasSaleDeed} onChange={handleComplianceChange} /> Sale Deed</label>
            <label><input type="checkbox" name="hasNOC" checked={form.compliance.hasNOC} onChange={handleComplianceChange} /> NOC</label>
            <label><input type="checkbox" name="hasTaxReceipt" checked={form.compliance.hasTaxReceipt} onChange={handleComplianceChange} /> Tax Receipt</label>

            <textarea
              name="remarks"
              placeholder="Compliance remarks"
              value={form.compliance.remarks}
              onChange={handleComplianceChange}
              style={{ ...input, marginTop: 10 }}
            />
          </Card>
        </form>

        {/* RIGHT ACTIONS */}
        <div>
          <Card title="Actions">
            <button type="submit" style={btnPrimary} onClick={submit}>
              Save Property
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

/* UI COMPONENTS */

const Card = ({ title, children }) => (
  <div style={card}>
    <h3 style={cardTitle}>{title}</h3>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {children}
    </div>
  </div>
);

/* STYLES */

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

const checkboxGrid = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
const checkboxItem = { display: "flex", gap: 8, alignItems: "center" };

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

export default CreateProperty;
