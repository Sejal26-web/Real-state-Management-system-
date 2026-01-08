import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function Leads() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    API.get("/leads")
      .then(res => {
     
        setLeads(res.data.leads || []);
      })
      .catch(err => {
        console.error("Leads fetch error:", err);
        setLeads([]);
      });
  }, []);

  const downloadQuotation = (leadId) => {
    window.open(
      `http://localhost:5000/api/quotations/${leadId}/pdf`,
      "_blank"
    );
  };

  return (
    <div>
      <h2>Leads</h2>

      {leads.length === 0 ? (
        <p>No leads found</p>
      ) : (
        leads.map(l => (
          <div
            key={l._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px"
            }}
          >
            <div>
              {l.source} | {l.status}
            </div>

            <button
              style={{ marginTop: "8px" }}
              onClick={() => downloadQuotation(l._id)}
            >
              Download Quotation PDF
            </button>
          </div>
        ))
      )}
    </div>
  );
}
