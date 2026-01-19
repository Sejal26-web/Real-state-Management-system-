import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Toast from "../../components/common/Toast";
import "./Owner.css";

const ITEMS_PER_PAGE = 10;

const OwnerList = () => {
  const navigate = useNavigate();

  const [owners, setOwners] = useState([]);

  /* FILTER */
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);

  /* DELETE MODAL STATE */
  const [deleteOwner, setDeleteOwner] = useState(null);

  /* TOAST */
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    const res = await API.get("/owners");
    setOwners(res.data.data || []);
  };

  /* RESET PAGE WHEN FILTERS CHANGE */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter]);

  /* FILTER LOGIC */
  const filteredOwners = owners.filter((o) => {
    const matchesSearch =
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.includes(search) ||
      (o.email || "").toLowerCase().includes(search.toLowerCase());

    const matchesType =
      typeFilter === "All" || o.ownerType === typeFilter;

    return matchesSearch && matchesType;
  });

  /* PAGINATION LOGIC */
  const totalPages = Math.ceil(filteredOwners.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedOwners = filteredOwners.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* DELETE CONFIRM */
  const confirmDelete = async () => {
    try {
      await API.delete(`/owners/${deleteOwner._id}`);

      setOwners((prev) =>
        prev.filter((o) => o._id !== deleteOwner._id)
      );

      setToast({
        type: "success",
        message: "Owner deleted successfully"
      });
    } catch {
      setToast({
        type: "error",
        message: "Failed to delete owner"
      });
    } finally {
      setDeleteOwner(null);
    }
  };

  return (
    <div className="page owner-list">
      {/* TOAST */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Owners</h1>
          <p className="page-subtitle">
            Total Owners: {filteredOwners.length}
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/owners/create")}
        >
          + Add Owner
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="filter-bar">
        <input
          placeholder="Search name, phone, email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Individual">Individual</option>
          <option value="Company">Company</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Owner</th>
              <th>Contact</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOwners.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty">
                  No owners found
                </td>
              </tr>
            ) : (
              paginatedOwners.map((owner) => (
                <tr key={owner._id}>
                  <td>
                    <strong>{owner.name}</strong>
                  </td>

                  <td>
                    {owner.phone}
                    <div className="muted">{owner.email}</div>
                  </td>

                  <td>{owner.ownerType || "Individual"}</td>

                  <td className="table-actions">
                    <button
                      className="btn gray"
                      onClick={() =>
                        navigate(`/owners/edit/${owner._id}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn danger"
                      onClick={() => setDeleteOwner(owner)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
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

      {/* DELETE MODAL */}
      {deleteOwner && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Delete Owner</h3>
            <p>
              This action cannot be undone. Do you want to continue?
            </p>

            <div className="modal-actions">
              <button
                className="btn gray"
                onClick={() => setDeleteOwner(null)}
              >
                Cancel
              </button>

              <button
                className="btn danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerList;
