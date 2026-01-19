import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";

const LeadView = () => {
  const { id } = useParams();

  const [lead, setLead] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH LEAD ================= */
  const fetchLead = async () => {
    try {
      const res = await API.get(`/leads/${id}`);
      setLead(res.data.data);
      setSelectedClient(res.data.data.assignedClient || "");
    } catch (err) {
      console.error("Fetch lead error:", err);
    }
  };

  /* ================= FETCH CLIENTS ================= */
  const fetchClients = async () => {
    try {
      const res = await API.get("/users?role=client");
      setClients(res.data.data || []);
    } catch (err) {
      console.error("Fetch clients error:", err);
    }
  };

  /* ================= ASSIGN CLIENT ================= */
  const assignClient = async () => {
    if (!selectedClient) {
      alert("Please select a client");
      return;
    }

    try {
      await API.put(`/leads/${id}/assign`, {
        agentId: selectedClient // backend expects agentId
      });

      alert("Client assigned successfully");
      fetchLead();
    } catch (err) {
      console.error("Assign client error:", err);
      alert("Failed to assign client");
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchLead();
      await fetchClients();
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!lead) return <p>Lead not found</p>;

  return (
    <div className="lead-view-container">
      <h2>Lead Details</h2>

      <div className="lead-card">
        <p><strong>Name:</strong> {lead.name}</p>
        <p><strong>Phone:</strong> {lead.phone}</p>
        <p><strong>Email:</strong> {lead.email || "-"}</p>
        <p><strong>Status:</strong> {lead.status}</p>
        <p><strong>Requirement:</strong> {lead.requirementType}</p>
      </div>

      {/* ================= ASSIGN CLIENT (ADMIN ONLY) ================= */}
      <div className="assign-box">
        <h3>Assign Client</h3>

        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
        >
          <option value="">Select Client</option>
          {clients.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>

        <button onClick={assignClient}>
          Assign
        </button>
      </div>
    </div>
  );
};

export default LeadView;
