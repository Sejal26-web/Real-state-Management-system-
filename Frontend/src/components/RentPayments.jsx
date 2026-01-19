import React, { useEffect, useState } from "react";
import API from "../api/axios";

const RentPayments = ({ rental }) => {
  const [payments, setPayments] = useState([]);
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    const res = await API.get(`/rent-payments/${rental._id}`);
    setPayments(res.data || []);
  };

  const addPayment = async () => {
    if (!amountPaid) return alert("Enter amount");

    await API.post(`/rent-payments/${rental._id}`, {
      amountPaid: Number(amountPaid),
      paymentMode,
    });

    setAmountPaid("");
    fetchPayments();
  };

  const totalPaid = payments.reduce(
    (sum, p) => sum + p.amountPaid,
    0
  );

  const outstanding = rental.rentAmount - totalPaid;

  return (
    <div className="card">
      <h3>Rent Payments</h3>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="number"
          placeholder="Amount"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
        />

        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
        >
          <option>Cash</option>
          <option>UPI</option>
          <option>Bank Transfer</option>
          <option>Cheque</option>
        </select>

        <button onClick={addPayment}>Add Payment</button>
      </div>

      <p><strong>Total Paid:</strong> ₹{totalPaid}</p>
      <p><strong>Outstanding:</strong> ₹{outstanding}</p>

      <ul>
        {payments.map((p) => (
          <li key={p._id}>
            ₹{p.amountPaid} – {p.paymentMode} –{" "}
            {new Date(p.paymentDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RentPayments;
