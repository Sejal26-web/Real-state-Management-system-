import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function Sales() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    API.get("/sales").then(res => setSales(res.data));
  }, []);

  const downloadInvoice = (saleId) => {
    window.open(
      `http://localhost:5000/api/invoices/${saleId}/pdf`,
      "_blank"
    );
  };

  return (
    <div>
      <h2>Sales</h2>

      {sales.map(s => (
        <div
          key={s._id}
          style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
        >
          <div>
            ₹{s.paidAmount} / ₹{s.totalAmount} | {s.status}
          </div>

          <button
            style={{ marginTop: "8px" }}
            onClick={() => downloadInvoice(s._id)}
          >
            Download Invoice PDF
          </button>
        </div>
      ))}
    </div>
  );
}
