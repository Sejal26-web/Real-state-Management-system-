import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Toast from "../../components/common/Toast";
import "./Owner.css";

export default function CreateOwner() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    ownerType: "Individual",
    notes: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/owners", form);
      setToast({ type: "success", message: "Owner created successfully" });
      setTimeout(() => navigate("/owners"), 1200);
    } catch {
      setToast({ type: "error", message: "Failed to create owner" });
    }
  };

  return (
    <div className="page">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Add Owner</h1>
          <p className="page-subtitle">Create owner profile & details</p>
        </div>
      </div>

      <div className="owner-grid">
        {/* LEFT */}
        <div className="owner-column">
          <div className="owner-card">
            <h3>Basic Information</h3>
            <input name="name" placeholder="Full Name" onChange={handleChange} />
            <input name="phone" placeholder="Phone" onChange={handleChange} />
            <input name="email" placeholder="Email" onChange={handleChange} />

            <select name="ownerType" onChange={handleChange}>
              <option>Individual</option>
              <option>Company</option>
            </select>
          </div>

          <div className="owner-card">
            <h3>Address & Notes</h3>
            <textarea
              name="address"
              placeholder="Full Address"
              rows="3"
              onChange={handleChange}
            />
            <textarea
              name="notes"
              placeholder="Additional notes"
              rows="3"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="owner-actions">
          <div className="owner-card">
            <h3>Actions</h3>
            <button className="primary-btn full" onClick={submit}>
              Save Owner
            </button>
            <button
              className="secondary-btn full"
              onClick={() => navigate("/owners")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
