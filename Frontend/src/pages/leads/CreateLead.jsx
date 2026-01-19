import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "../../styles/leadForm.css";
import Toast from "../../components/common/Toast"; 

const CreateLead = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    source: "Website",
    requirementType: "",
    propertyType: "",
    budget: "",
    preferredLocation: ""
  });

  // TOAST STATE
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      budget: form.budget ? Number(form.budget) : undefined
    };

    try {
      await API.post("/leads", payload);

      //  SUCCESS TOAST
      setToast({
        message: "Lead created successfully",
        type: "success"
      });

      // small delay so user sees toast
      setTimeout(() => {
        navigate("/leads");
      }, 1500);

    } catch (err) {
      // ERROR TOAST
      setToast({
        message: err.response?.data?.message || "Failed to create lead",
        type: "error"
      });
    }
  };

  return (
    <div className="lead-container">

      {/* TOAST RENDER */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* PAGE HEADER */}
      <div className="lead-header">
        <h2 className="lead-title">Create Lead</h2>
        <p className="lead-subtitle">
          Capture customer interest and property requirements
        </p>
      </div>

      {/* FORM CARD */}
      <form className="lead-card" onSubmit={handleSubmit}>
        <div className="lead-table">

          <div className="lead-row">
            <label>Name *</label>
            <input
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="lead-row">
            <label>Phone *</label>
            <input
              name="phone"
              placeholder="Mobile number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="lead-row">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="lead-row">
            <label>Source</label>
            <select name="source" value={form.source} onChange={handleChange}>
              <option value="Website">Website</option>
              <option value="Phone">Phone</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Referral">Referral</option>
            </select>
          </div>

          <div className="lead-row">
            <label>Requirement *</label>
            <select
              name="requirementType"
              value={form.requirementType}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Buy">Buy</option>
              <option value="Rent">Rent</option>
            </select>
          </div>

          <div className="lead-row">
            <label>Property Type</label>
            <select
              name="propertyType"
              value={form.propertyType}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Flat">Flat</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          <div className="lead-row">
            <label>Budget (₹)</label>
            <input
              type="number"
              name="budget"
              placeholder="Expected budget"
              value={form.budget}
              onChange={handleChange}
            />
          </div>

          <div className="lead-row">
            <label>Preferred Location</label>
            <input
              name="preferredLocation"
              placeholder="Eg: Andheri, Bandra"
              value={form.preferredLocation}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* ACTION BAR */}
        <div className="lead-action-bar">
          <button type="submit" className="btn-primary">
            Create Lead
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/leads")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLead;
