import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Toast from "../../components/common/Toast";
import "../../styles/rental.css";

const PAGE_SIZE = 5;

/* ================= STATUS BADGE ================= */
const StatusBadge = ({ status }) => {
  const map = {
    InProgress: "status-badge status-active",
    Completed: "status-badge status-vacated",
    Cancelled: "status-badge status-terminated"
  };
  return <span className={map[status] || "status-badge"}>{status}</span>;
};

export default function SalesList() {
  const navigate = useNavigate();

  const [sales, setSales] = useState([]);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await API.get("/sales");
      setSales(res.data.data || []);
    } catch {
      setToast({ type: "error", message: "Failed to load sales" });
    }
  };

  useEffect(() => setPage(1), [search, statusFilter]);

  /* ================= FILTER ================= */
  const filtered = sales.filter((s) => {
    const matchesSearch =
      s.property?.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.buyer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.seller?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="rental-container">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* HEADER */}
      <div className="rental-list-header">
        <h2>Sales</h2>
        <button
          className="btn-primary"
          onClick={() => navigate("/sales/create")}
        >
          + Add Sale
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="rental-list-filters">
        <input
          placeholder="Search property, buyer or seller"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="InProgress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* LIST CARD */}
      <div className="rental-list-card">
        <table className="rental-list-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Buyer</th>
              <th>Seller</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: 28 }}>
                  No sales found
                </td>
              </tr>
            ) : (
              paginated.map((s) => (
                <tr key={s._id}>
                  <td>{s.property?.title || "—"}</td>
                  <td>{s.buyer?.name || "—"}</td>
                  <td>{s.seller?.name || "—"}</td>
                  <td>
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="amount">₹ {s.totalAmount}</td>
                  <td>
                    <button
                      className="rental-list-btn"
                      onClick={() => navigate(`/sales/edit/${s._id}`)}
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
