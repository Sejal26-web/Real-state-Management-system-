import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Toast from "../../components/common/Toast";
import "../../styles/rental.css";

export default function EditRental() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [rental, setRental] = useState(null);

  const [form, setForm] = useState({
    rentAmount: "",
    status: "Active"
  });

  const [payment, setPayment] = useState({
    amount: "",
    note: ""
  });

  useEffect(() => {
    fetchRental();
  }, [id]);

  const fetchRental = async () => {
    const res = await API.get(`/rentals/${id}`);
    const r = res.data.data;
    setRental(r);

    setForm({
      rentAmount: r.rentAmount,
      status: r.status
    });
  };

  const updateRental = async () => {
    await API.put(`/rentals/${id}`, form);
    setToast({ type: "success", message: "Rental updated" });
    fetchRental();
  };

  const addPayment = async () => {
    if (!payment.amount) return;

    await API.post(`/rentals/${id}/payments`, {
      amount: Number(payment.amount),
      note: payment.note
    });

    setPayment({ amount: "", note: "" });
    fetchRental();
  };

  if (!rental) return null;

  const totalPaid =
    rental.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

  const outstanding = rental.rentAmount - totalPaid;

  return (
    <div className="page">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Rental</h1>
          <p className="page-subtitle">
            Update lease details & rent payments
          </p>
        </div>

        <button className="secondary-btn" onClick={() => navigate("/rentals")}>
          Back
        </button>
      </div>

      <div className="grid">
        <div className="column">
          <div className="card">
            <h3>Rental Details</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>Monthly Rent (₹)</label>
                <input
                  type="number"
                  value={form.rentAmount}
                  onChange={(e) =>
                    setForm({ ...form, rentAmount: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option>Active</option>
                  <option>Vacated</option>
                  <option>Terminated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Rent Payments</h3>

            <div className="payment-inputs">
              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  value={payment.amount}
                  onChange={(e) =>
                    setPayment({ ...payment, amount: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Note</label>
                <input
                  value={payment.note}
                  onChange={(e) =>
                    setPayment({ ...payment, note: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="column">
          <div className="card highlight">
            <h3>Actions</h3>

            <button className="primary-btn" onClick={updateRental}>
              Update Rental
            </button>

            <button
              className="success-btn"
              style={{ marginTop: 12 }}
              onClick={addPayment}
            >
              Add Payment
            </button>

            <div style={{ marginTop: 20 }}>
              <p>
                <strong>Status:</strong> {form.status}
              </p>
              <p className="negative">
                <strong>Outstanding:</strong> ₹ {outstanding}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
