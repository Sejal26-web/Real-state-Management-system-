import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import OwnerDocuments from "../../components/OwnerDocuments";
import "./Owner.css";

const OwnerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await API.get(`/owners/${id}`);
        setOwner(res.data.data);
      } catch {
        alert("Failed to load owner details");
      } finally {
        setLoading(false);
      }
    };

    fetchOwner();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!owner) return <p>Owner not found</p>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>{owner.name}</h2>

        <button className="secondary-btn" onClick={() => navigate("/owners")}>
          ← Back
        </button>
      </div>

      <div className="owner-card">
        <h3>Contact Information</h3>
        <p><strong>Phone:</strong> {owner.phone}</p>
        <p><strong>Email:</strong> {owner.email}</p>
        <p><strong>Address:</strong> {owner.address || "—"}</p>
      </div>

      <div className="owner-card">
        <h3>Business Information</h3>
        <p><strong>Owner Type:</strong> {owner.ownerType || "Individual"}</p>
        <p><strong>Notes:</strong> {owner.notes || "—"}</p>
      </div>

      {/* 🔥 OWNER DOCUMENTS (VIEW + UPLOAD) */}
      <div className="owner-card">
        <OwnerDocuments ownerId={owner._id} />
      </div>

      <div className="owner-card actions">
        <button
          className="primary-btn"
          onClick={() => navigate(`/owners/edit/${owner._id}`)}
        >
          Edit Owner
        </button>
      </div>
    </div>
  );
};

export default OwnerDetail;
