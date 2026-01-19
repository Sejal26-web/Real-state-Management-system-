import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Toast from "../../components/common/Toast";
import "./Property.css";

const PAGE_SIZE = 5;

/* ================= STATUS BADGE ================= */
const StatusBadge = ({ status }) => {
  const map = {
    Available: "status available",
    Sold: "status sold",
    Rented: "status rented"
  };
  return <span className={map[status] || "status"}>{status}</span>;
};

export default function PropertyList() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);

  /* FILTER STATES */
  const [search, setSearch] = useState("");
  const [transactionFilter, setTransactionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  /* PAGINATION */
  const [page, setPage] = useState(1);

  /* DELETE + TOAST */
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await API.get("/properties");
      setProperties(res.data.data || []);
    } catch {
      setToast({ message: "Failed to load properties", type: "error" });
    }
  };

  /* RESET PAGE WHEN FILTERS CHANGE */
  useEffect(() => {
    setPage(1);
  }, [search, transactionFilter, statusFilter]);

  /* DELETE */
  const confirmDelete = async () => {
    try {
      await API.delete(`/properties/${deleteId}`);
      setProperties((prev) => prev.filter((p) => p._id !== deleteId));
      setToast({ message: "Property deleted successfully", type: "success" });
    } catch {
      setToast({ message: "Delete failed", type: "error" });
    } finally {
      setDeleteId(null);
    }
  };

  /* FILTER LOGIC */
  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.owner?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.type?.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionType?.toLowerCase().includes(search.toLowerCase());

    const matchesTransaction =
      transactionFilter === "All" ||
      p.transactionType === transactionFilter;

    const matchesStatus =
      statusFilter === "All" || p.status === statusFilter;

    return matchesSearch && matchesTransaction && matchesStatus;
  });

  /* PAGINATION */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="page">
      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Delete Property</h3>
            <p>This action cannot be undone. Continue?</p>

            <div className="modal-actions">
              <button className="btn gray" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="btn red" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="page-header">
        <h2 className="page-title">Properties</h2>

        <button
          className="primary-btn"
          onClick={() => navigate("/properties/create")}
        >
          + Add Property
        </button>
      </div>

      {/* ⭐ PREMIUM FILTER BAR */}
      <div className="property-filter-card">
        <div className="property-search">
          <span>🔍</span>
          <input
            placeholder="Search owner, type, transaction"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={transactionFilter}
          onChange={(e) => setTransactionFilter(e.target.value)}
        >
          <option value="All">All Transactions</option>
          <option value="Sale">Sale</option>
          <option value="Rent">Rent</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
          <option value="Rented">Rented</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="list-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Owner</th>
              <th>Type</th>
              <th>Transaction</th>
              <th>Price</th>
              <th>Status</th>
              <th className="right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty">
                  No properties found
                </td>
              </tr>
            ) : (
              paginated.map((p) => (
                <tr key={p._id}>
                  <td>{p.owner?.name || "—"}</td>
                  <td>{p.type}</td>
                  <td>{p.transactionType}</td>
                  <td>₹ {p.price?.toLocaleString()}</td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="right">
                    <div className="actions">
                      <button
                        className="action-btn edit"
                        onClick={() =>
                          navigate(`/properties/edit/${p._id}`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="action-btn delete"
                        onClick={() => setDeleteId(p._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

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
    </div>
  );
}
