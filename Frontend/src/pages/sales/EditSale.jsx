import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Toast from "../../components/common/Toast";
import "../../styles/sale.css";

const EditSale = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] = useState(null);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    stage: "Negotiation",
    status: "InProgress",
    registrationDate: "",
    remarks: ""
  });

  const [payment, setPayment] = useState({
    amount: "",
    type: "Installment"
  });

  /* ================= FETCH SALE ================= */
  useEffect(() => {
    fetchSale();
  }, [id]);

  const fetchSale = async () => {
    try {
      const res = await API.get(`/sales/${id}`);
      const s = res.data.data;

      setSale(s);
      setForm({
        stage: s.stage || "Negotiation",
        status: s.status || "InProgress",
        registrationDate: s.registrationDate
          ? s.registrationDate.substring(0, 10)
          : "",
        remarks: s.remarks || ""
      });
    } catch {
      setToast({ type: "error", message: "Failed to load sale" });
    }
  };

  /* ================= CALCULATIONS ================= */
  const totalPaid =
    sale?.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

  const totalAmount = sale?.totalAmount || 0;
  const outstanding = totalAmount - totalPaid;

  /* ================= UPDATE SALE ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const updateSale = async (e) => {
    e.preventDefault();

    if (form.status === "Completed" && outstanding > 0) {
      setToast({
        type: "error",
        message: "Cannot complete sale with outstanding balance"
      });
      return;
    }

    if (form.status === "Completed" && !form.registrationDate) {
      setToast({
        type: "error",
        message: "Registration date is required"
      });
      return;
    }

    try {
      await API.put(`/sales/${id}`, form);
      setToast({ type: "success", message: "Sale updated successfully" });
      fetchSale();
    } catch {
      setToast({ type: "error", message: "Failed to update sale" });
    }
  };

  /* ================= ADD PAYMENT ================= */
  const addPayment = async () => {
    if (!payment.amount || Number(payment.amount) <= 0) {
      setToast({ type: "error", message: "Enter valid payment amount" });
      return;
    }

    if (Number(payment.amount) > outstanding) {
      setToast({
        type: "error",
        message: "Payment exceeds outstanding balance"
      });
      return;
    }

    try {
      await API.post(`/sales/${id}/payments`, {
        amount: Number(payment.amount),
        type: payment.type
      });

      setToast({ type: "success", message: "Payment added" });
      setPayment({ amount: "", type: "Installment" });
      fetchSale();
    } catch {
      setToast({ type: "error", message: "Failed to add payment" });
    }
  };

  if (!sale) return null;

  const isLocked =
    sale.status === "Completed" || sale.status === "Cancelled";

  return (
    <div className="sale-container">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <h2 className="sale-title">Edit Sale</h2>

      {/* BASIC INFO */}
      <div className="sale-card">
        <div className="sale-form-grid">
          <input value={sale.property?.type || "N/A"} readOnly />
          <input value={sale.buyer?.name || "N/A"} readOnly />
          <input value={sale.seller?.name || "N/A"} readOnly />
          <input value={`₹ ${totalAmount}`} readOnly />
        </div>
      </div>

      {/* UPDATE FORM */}
      <form className="sale-card" onSubmit={updateSale}>
        <select
          name="stage"
          value={form.stage}
          onChange={handleChange}
          disabled={isLocked}
        >
          <option value="Negotiation">Negotiation</option>
          <option value="Agreement">Agreement</option>
          <option value="Registration">Registration</option>
        </select>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          disabled={isLocked}
        >
          <option value="InProgress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {form.status === "Completed" && (
          <input
            type="date"
            name="registrationDate"
            value={form.registrationDate}
            onChange={handleChange}
          />
        )}

        <button disabled={isLocked} className="btn btn-primary">
          Update Sale
        </button>
      </form>

      {/* PAYMENTS */}
      <div className="sale-card">
        <h3>Payments</h3>

        {sale.payments?.length === 0 ? (
          <p className="empty-state">No payments recorded</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {sale.payments.map((p, i) => (
                <tr key={i}>
                  <td>₹ {p.amount}</td>
                  <td>{p.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="sale-form-grid">
          <input
            type="number"
            placeholder="Amount"
            value={payment.amount}
            onChange={(e) =>
              setPayment({ ...payment, amount: e.target.value })
            }
          />
          <select
            value={payment.type}
            onChange={(e) =>
              setPayment({ ...payment, type: e.target.value })
            }
          >
            <option value="Installment">Installment</option>
            <option value="Final">Final</option>
          </select>
        </div>

        <button className="btn btn-success" onClick={addPayment}>
          Add Payment
        </button>

        <p>
          <strong>Outstanding:</strong> ₹ {outstanding}
        </p>
      </div>
    </div>
  );
};

export default EditSale;
