import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Toast from "../../components/common/Toast";
import "../../styles/rental.css";

const PAGE_SIZE = 5;

/* ================= STATUS BADGE ================= */
const StatusBadge = ({ status }) => {
  const map = {
    Active: "status-badge status-active",
    Vacated: "status-badge status-vacated",
    Terminated: "status-badge status-terminated"
  };
  return <span className={map[status] || "status-badge"}>{status}</span>;
};

export default function RentalList() {
  const navigate = useNavigate();

  const [rentals, setRentals] = useState([]);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const res = await API.get("/rentals");
      setRentals(res.data.data || []);
    } catch {
      setToast({ type: "error", message: "Failed to load rentals" });
    }
  };

  useEffect(() => setPage(1), [search, statusFilter]);

  const filtered = rentals.filter((r) => {
    const matchesSearch =
      r.property?.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.tenant?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const getOutstanding = (rental) => {
    const paid =
      rental.payments?.reduce((s, p) => s + p.amount, 0) || 0;
    return rental.rentAmount - paid;
  };

  return (
    <div className="rental-container">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* HEADER */}
      <div className="rental-list-header">
        <h2>Rentals</h2>
        <button
          className="btn-primary"
          onClick={() => navigate("/rentals/create")}
        >
          + Add Rental
        </button>
      </div>

      {/* FILTER BAR – SAME AS PROPERTIES */}
      <div className="rental-list-filters">
        <input
          placeholder="Search property or tenant"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Vacated">Vacated</option>
          <option value="Terminated">Terminated</option>
        </select>
      </div>

      {/* LIST CARD – SAME STRUCTURE AS PROPERTIES */}
      <div className="rental-list-card">
        <table className="rental-list-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Tenant</th>
              <th>Rent</th>
              <th>Status</th>
              <th>Outstanding</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 28 }}>
                  No rentals found
                </td>
              </tr>
            ) : (
              paginated.map((r) => (
                <tr key={r._id}>
                  <td>{r.property?.title || "—"}</td>
                  <td>{r.tenant?.name || "—"}</td>
                  <td className="amount">₹ {r.rentAmount}</td>
                  <td>
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="amount amount-negative">
                    ₹ {getOutstanding(r)}
                  </td>
                  <td>
                    <button
                      className="rental-list-btn"
                      onClick={() => navigate(`/rentals/edit/${r._id}`)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
