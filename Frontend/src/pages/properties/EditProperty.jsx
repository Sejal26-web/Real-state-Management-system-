import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Toast from "../../components/common/Toast";
import PropertyDocuments from "../../components/PropertyDocuments";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [owners, setOwners] = useState([]);

  const [form, setForm] = useState({
    owner: "",
    type: "",
    transactionType: "",
    price: "",
    locality: "",
    area: "",
    status: "Available",
    amenities: [],
    compliance: {
      hasSaleDeed: false,
      hasNOC: false,
      hasTaxReceipt: false,
      remarks: ""
    }
  });

  useEffect(() => {
    fetchProperty();
    fetchOwners();
  }, [id]);

  const fetchProperty = async () => {
    const res = await API.get(`/properties/${id}`);
    const p = res.data.data;

    setForm({
      owner: p.owner?._id || "",
      type: p.type || "",
      transactionType: p.transactionType || "",
      price: p.price || "",
      locality: p.locality || "",
      area: p.area || "",
      status: p.status || "Available",
      amenities: p.amenities || [],
      compliance: {
        hasSaleDeed: p.compliance?.hasSaleDeed || false,
        hasNOC: p.compliance?.hasNOC || false,
        hasTaxReceipt: p.compliance?.hasTaxReceipt || false,
        remarks: p.compliance?.remarks || ""
      }
    });
  };

  const fetchOwners = async () => {
    const res = await API.get("/owners");
    setOwners(res.data.data || []);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleComplianceChange = (e) => {
    const { name, checked, value, type } = e.target;
    setForm({
      ...form,
      compliance: {
        ...form.compliance,
        [name]: type === "checkbox" ? checked : value
      }
    });
  };

  const toggleAmenity = (a) => {
    setForm({
      ...form,
      amenities: form.amenities.includes(a)
        ? form.amenities.filter(x => x !== a)
        : [...form.amenities, a]
    });
  };

  /* ================= UPDATE PROPERTY ================= */
  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/properties/${id}`, {
        ...form,
        price: Number(form.price),
        area: Number(form.area)
      });

      setToast({ type: "success", message: "Property updated successfully" });
      setTimeout(() => navigate("/properties"), 1200);
    } catch {
      setToast({ type: "error", message: "Update failed" });
    }
  };

  return (
    <div style={page}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* HEADER */}
      <div style={header}>
        <div>
          <h1 style={title}>Edit Property</h1>
          <p style={subtitle}>Update property details & documents</p>
        </div>
        <button style={btnSecondary} onClick={() => navigate("/properties")}>
          Back
        </button>
      </div>

      <div style={grid}>
        {/* LEFT */}
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <Card title="Basic Information">
            <select name="owner" value={form.owner} onChange={handleChange} style={input}>
              <option value="">Select Owner</option>
              {owners.map(o => (
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

            <select name="transactionType" value={form.transactionType} onChange={handleChange} style={input}>
              <option value="">Transaction Type</option>
              <option>Sale</option>
              <option>Rent</option>
            </select>

            <select name="status" value={form.status} onChange={handleChange} style={input}>
              <option>Available</option>
              <option>Under Negotiation</option>
              <option>Sold</option>
              <option>Rented</option>
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
            <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} style={input} />
            <input type="number" name="area" placeholder="Area (sq ft)" value={form.area} onChange={handleChange} style={input} />
          </Card>

          <Card title="Compliance">
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

          {/* ✅ SINGLE SOURCE OF TRUTH */}
          <Card title="Property Documents">
            <PropertyDocuments propertyId={id} />
          </Card>
        </form>

        {/* RIGHT */}
        <div>
          <Card title="Actions">
            <button style={btnPrimary} onClick={submit}>
              Update Property
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
const input = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #d1d5db" };

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

export default EditProperty;
