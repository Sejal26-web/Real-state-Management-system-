import React, { useState } from "react";
import API from "../../api/axios";

const PayRentModal = ({ rental, onClose, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitPayment = async () => {
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await API.post(`/rentals/${rental._id}/payment`, {
        amount: Number(amount),
        note
      });

      onSuccess(); // refresh rentals
      onClose();   // close modal
    } catch (err) {
      console.error("PAYMENT ERROR:", err);
      setError(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>Pay Rent</h2>

        <p>
          <strong>{rental.property?.type}</strong> –{" "}
          {rental.property?.locality}
        </p>

        <input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={input}
        />

        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={input}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={submitPayment} disabled={loading} style={primaryBtn}>
            {loading ? "Processing..." : "Confirm Payment"}
          </button>

          <button onClick={onClose} style={secondaryBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===== STYLES ===== */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modal = {
  background: "#fff",
  padding: 24,
  borderRadius: 12,
  width: 360
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #ccc"
};

const primaryBtn = {
  flex: 1,
  padding: 10,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer"
};

const secondaryBtn = {
  flex: 1,
  padding: 10,
  background: "#e5e7eb",
  border: "none",
  borderRadius: 8,
  cursor: "pointer"
};

export default PayRentModal;
