import React, { useEffect, useState } from "react";
import API from "../api/axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    API.get("/customers").then(res => setCustomers(res.data));
  }, []);

  const downloadCustomerReport = () => {
    window.open(
      "http://localhost:5000/api/reports/customers/excel",
      "_blank"
    );
  };

  return (
    <div>
      <h2>Customers</h2>

      {/* Download Excel Button */}
      <button
        style={{ marginBottom: "15px" }}
        onClick={downloadCustomerReport}
      >
        Download Customer Report (Excel)
      </button>

      {/* Customer List */}
      {customers.map(c => (
        <div
          key={c._id}
          style={{ border: "1px solid #ccc", padding: "8px", marginBottom: "8px" }}
        >
          {c.name} - {c.type}
        </div>
      ))}
    </div>
  );
};

export default Customers;
