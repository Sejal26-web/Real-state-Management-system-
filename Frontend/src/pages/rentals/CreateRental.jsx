import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Toast from "../../components/common/Toast";
import "../../styles/rental.css";

const CreateRental = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const [properties, setProperties] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [form, setForm] = useState({
    propertyId: "",
    tenantId: "",
    startDate: "",
    endDate: "",
    moveInDate: "",
    rentAmount: "",
    securityDeposit: "",
    status: "Active"
  });

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        API.get("/properties/for-rent"),
        API.get("/customers")
      ]);

      setProperties(pRes.data.data || []);

      // ✅ IMPORTANT FIX:
      // Only customers linked to client users can be tenants
      const validTenants = (cRes.data.data || []).filter(
        (c) => c.user
      );

      setCustomers(validTenants);
    } catch (err) {
      setToast({
        type: "error",
        message: "Failed to load rental data"
      });
    }
  };

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =========================
     SUBMIT RENTAL
  ========================= */
  const submit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/rentals", {
        propertyId: form.propertyId,
        tenantId: form.tenantId,
        startDate: form.startDate,
        endDate: form.endDate,
        moveInDate: form.moveInDate || form.startDate,
        rentAmount: Number(form.rentAmount),
        securityDeposit: Number(form.securityDeposit || 0),
        status: form.status
      });

      setToast({
        type: "success",
        message: "Rental created successfully"
      });

      setTimeout(() => navigate("/rentals"), 1200);
    } catch (err) {
      console.error("CREATE RENTAL ERROR:", err);
      setToast({
        type: "error",
        message: err.response?.data?.message || "Failed to create rental"
      });
    }
  };

  return (
    <div className="page">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="page-header">
        <div>
          <h1 className="page-title">Create Rental</h1>
          <p className="page-subtitle">
            Assign property, tenant, and rental terms
          </p>
        </div>
      </div>

      <form className="card" onSubmit={submit}>
        {/* PROPERTY & TENANT */}
        <h3 className="form-section">Property & Tenant</h3>

        <div className="rental-form-grid">
          <div className="rental-form-group">
            <label>Property</label>
            <select
              name="propertyId"
              value={form.propertyId}
              onChange={handleChange}
              required
            >
              <option value="">Select Property</option>
              {properties.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.type} – {p.locality}
                </option>
              ))}
            </select>
          </div>

          <div className="rental-form-group">
            <label>Tenant (Client Linked)</label>
            <select
              name="tenantId"
              value={form.tenantId}
              onChange={handleChange}
              required
            >
              <option value="">Select Tenant</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} — {c.user?.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* RENTAL DURATION */}
        <h3 className="form-section">Rental Duration</h3>

        <div className="rental-form-grid">
          <div className="rental-form-group">
            <label>Lease Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="rental-form-group">
            <label>Lease End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="rental-form-group">
            <label>Move-in Date</label>
            <input
              type="date"
              name="moveInDate"
              value={form.moveInDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* FINANCIAL DETAILS */}
        <h3 className="form-section">Financial Details</h3>

        <div className="rental-form-grid">
          <div className="rental-form-group">
            <label>Monthly Rent (₹)</label>
            <input
              type="number"
              name="rentAmount"
              value={form.rentAmount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="rental-form-group">
            <label>Security Deposit (₹)</label>
            <input
              type="number"
              name="securityDeposit"
              value={form.securityDeposit}
              onChange={handleChange}
            />
          </div>

          <div className="rental-form-group">
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Vacated">Vacated</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>
        </div>

        <div className="rental-actions">
          <button className="primary-btn">Save Rental</button>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => navigate("/rentals")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRental;
