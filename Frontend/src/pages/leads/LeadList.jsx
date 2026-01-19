import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "../../styles/lead.css";

const ITEMS_PER_PAGE = 10;

const LeadList = () => {
  const navigate = useNavigate();

  /* ===============================
     DATA STATES
  =============================== */
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [agentsError, setAgentsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ===============================
     FILTER STATES
  =============================== */
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [leadType, setLeadType] = useState("All");

  /* ===============================
     PAGINATION
  =============================== */
  const [currentPage, setCurrentPage] = useState(1);

  /* ===============================
     FETCH DATA
  =============================== */
  useEffect(() => {
    fetchLeads();
    fetchAgents();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await API.get("/leads");
      setLeads(res.data?.data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      setError("Failed to load leads.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await API.get("/users/agents");
      setAgents(res.data || []);
      setAgentsError(false);
    } catch (err) {
      console.error("Agents API missing:", err);
      setAgents([]);
      setAgentsError(true);
    }
  };

  /* ===============================
     ASSIGN LEAD (✅ FIXED)
  =============================== */
  const assignLead = async (leadId, clientId) => {
    if (!clientId) return;

    try {
      await API.put(`/leads/${leadId}/assign`, { clientId }); // ✅ FIX
      fetchLeads();
    } catch (err) {
      console.error("Assign failed", err);
      alert("Failed to assign lead");
    }
  };

  /* Reset page on filter change */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, status, leadType]);

  /* ===============================
     FILTER LOGIC
  =============================== */
  const filteredLeads = leads.filter(l => {
    const name = l.name || "";
    const phone = l.phone || "";
    const email = l.email || "";

    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search) ||
      email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "All" || l.status === status;

    const matchesType =
      leadType === "All" || l.requirementType === leadType;

    return matchesSearch && matchesStatus && matchesType;
  });

  /* ===============================
     PAGINATION
  =============================== */
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLeads = filteredLeads.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="lead-container">

      <div className="lead-page-header">
        <h2 className="lead-title">Leads</h2>
        <button
          className="btn-create"
          onClick={() => navigate("/leads/create")}
        >
          + Create Lead
        </button>
      </div>

      <div className="lead-filters">
        <input
          placeholder="Search name, phone, email"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="Converted">Converted</option>
          <option value="Lost">Lost</option>
        </select>

        <select value={leadType} onChange={e => setLeadType(e.target.value)}>
          <option value="All">All Lead Types</option>
          <option value="Buy">Buy</option>
          <option value="Rent">Rent</option>
        </select>
      </div>

      {loading && <div className="info-text">Loading leads...</div>}
      {error && <div className="error-text">{error}</div>}

      {!loading && !error && (
        <table className="lead-list-table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Created</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No leads found
                </td>
              </tr>
            ) : (
              paginatedLeads.map(lead => (
                <tr key={lead._id}>
                  <td>
                    <strong>{lead.name || "-"}</strong>
                    <div className="muted">
                      {lead.requirementType || "-"}
                    </div>
                  </td>

                  <td>
                    {lead.phone || "-"}
                    <div className="muted">{lead.email || "-"}</div>
                  </td>

                  <td>
                    <span
                      className={`status-badge ${(lead.status || "new").toLowerCase()}`}
                    >
                      {lead.status || "New"}
                    </span>
                  </td>

                  <td className="muted">
                    {formatDate(lead.createdAt)}
                  </td>

                  {/* ✅ FIXED FIELD */}
                  <td className="muted">
                    {lead.assignedClient?.name || "Unassigned"}
                  </td>

                  <td className="action-buttons">
                    <button onClick={() => navigate(`/leads/${lead._id}`)}>
                      View
                    </button>
                    <button onClick={() => navigate(`/leads/edit/${lead._id}`)}>
                      Edit
                    </button>

                    <select
                      disabled={agents.length === 0}
                      onChange={(e) =>
                        assignLead(lead._id, e.target.value)
                      }
                    >
                      <option value="">
                        {agentsError
                          ? "No agents API"
                          : agents.length === 0
                          ? "No agents"
                          : "Assign"}
                      </option>

                      {agents.map(agent => (
                        <option key={agent._id} value={agent._id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LeadList;
