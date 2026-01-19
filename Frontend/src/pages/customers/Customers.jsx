import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Toast from "../../components/common/Toast";
import "../../styles/CustomerForm.css";

const ITEMS_PER_PAGE = 10;

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [toast, setToast] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await API.get("/customers");
      setCustomers(res.data.data || []);
    } catch {
      setToast({ message: "Failed to load customers", type: "error" });
    }
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/customers/${deleteId}`);
      setToast({ message: "Customer deleted successfully", type: "success" });
      setDeleteId(null);
      fetchCustomers();
    } catch {
      setToast({ message: "Delete failed", type: "error" });
    }
  };

  /* ===============================
     PAGINATION LOGIC
  =============================== */
  const totalPages = Math.ceil(customers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = customers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* Reset page if list shrinks (after delete) */
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [customers, totalPages, currentPage]);

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

      {/* DELETE CONFIRM MODAL */}
      {deleteId && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ marginBottom: 8 }}>Delete Customer</h3>
            <p style={{ color: "#6b7280", marginBottom: 24 }}>
              This action cannot be undone. Do you want to continue?
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button className="btn" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="btn danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="page-header" style={headerStyle}>
        <h1 className="page-title">Customers</h1>

        <button
          onClick={() => navigate("/customers/create")}
          style={addButton}
        >
          <span style={{ fontSize: 18 }}>+</span>
          Add Customer
        </button>
      </div>

      {/* TABLE */}
      <div className="list-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Type</th>
              <th className="right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCustomers.map((c) => (
              <tr key={c._id}>
                <td className="name">{c.name}</td>

                <td>
                  {c.phone}
                  <div className="muted">{c.email || "—"}</div>
                </td>

                <td>
                  <span className={`type-pill ${c.type.toLowerCase()}`}>
                    {c.type}
                  </span>
                </td>

                <td className="right">
                  <div className="actions" style={{ display: "flex", gap: 8 }}>
                    <button
                      className="action-btn action-view"
                      onClick={() => navigate(`/customers/${c._id}`)}
                    >
                      View
                    </button>

                    <button
                      className="action-btn action-edit"
                      onClick={() => navigate(`/customers/edit/${c._id}`)}
                    >
                      Edit
                    </button>

                    <button
                      className="action-btn action-delete"
                      onClick={() => setDeleteId(c._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginatedCustomers.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: 24 }}>
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION UI */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

/* ================= INLINE STYLES ================= */

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 24
};

const addButton = {
  background: "#2563eb",
  color: "#ffffff",
  padding: "12px 22px",
  borderRadius: 14,
  border: "none",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 8,
  boxShadow: "0 12px 24px rgba(37, 99, 235, 0.35)"
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999
};

const modalStyle = {
  background: "#fff",
  padding: 28,
  width: 420,
  borderRadius: 18,
  boxShadow: "0 30px 60px rgba(0,0,0,0.25)"
};

export default Customers;
