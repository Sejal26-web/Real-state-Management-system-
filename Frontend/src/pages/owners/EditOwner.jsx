import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import Toast from "../../components/common/Toast";
import OwnerDocuments from "../../components/OwnerDocuments";
import "./Owner.css";

export default function EditOwner() {
  const { id } = useParams();
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

  useEffect(() => {
    API.get(`/owners/${id}`).then((res) => {
      setForm(res.data.data);
    });
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/owners/${id}`, form);
      setToast({ type: "success", message: "Owner updated successfully" });
      setTimeout(() => navigate("/owners"), 1200);
    } catch {
      setToast({ type: "error", message: "Update failed" });
    }
  };

  return (
    <div className="page owner-edit">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="page-header">
        <div>
          <h1>Edit Owner</h1>
          <p className="page-subtitle">Update owner details & documents</p>
        </div>

        <button className="secondary-btn" onClick={() => navigate("/owners")}>
          Back
        </button>
      </div>

      <div className="owner-grid">
        {/* LEFT */}
        <div className="owner-column">
          <div className="owner-card">
            <h3>Basic Information</h3>

            <input
              name="name"
              placeholder="Owner name"
              value={form.name}
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
            />

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <select
              name="ownerType"
              value={form.ownerType}
              onChange={handleChange}
            >
              <option>Individual</option>
              <option>Company</option>
            </select>
          </div>

          <div className="owner-card">
            <h3>Address & Notes</h3>

            <textarea
              name="address"
              rows="3"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
            />

            <textarea
              name="notes"
              rows="3"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
            />
          </div>

          {/* 🔥 OWNER DOCUMENT MANAGEMENT */}
          <div className="owner-card">
            <OwnerDocuments ownerId={id} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="owner-actions">
          <div className="owner-card">
            <h3>Actions</h3>

            <button className="primary-btn full" onClick={submit}>
              Update Owner
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
