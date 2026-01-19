import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import PropertyDocuments from "../../components/PropertyDocuments";
import "./property.css";

export default function PropertyDetails() {
  const { id } = useParams(); // propertyId from URL
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      const res = await API.get(`/properties/${id}`);
      setProperty(res.data.data);
    } catch (err) {
      console.error("Failed to load property", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ padding: 24 }}>Loading property...</p>;
  if (!property) return <p style={{ padding: 24 }}>Property not found</p>;

  return (
    <div className="property-container">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Property Details</h2>
          <p className="page-subtitle">
            View property information & manage documents
          </p>
        </div>

        <button className="btn-secondary" onClick={() => navigate("/properties")}>
          Back
        </button>
      </div>

      {/* BASIC INFO */}
      <div className="property-card">
        <h3>Basic Information</h3>

        <div className="details-grid">
          <p><b>Property Type:</b> {property.type}</p>
          <p><b>Transaction:</b> {property.transactionType}</p>
          <p><b>Locality:</b> {property.locality}</p>
          <p><b>Price:</b> ₹{property.price}</p>
          <p><b>Area:</b> {property.area} sq ft</p>
          <p><b>Status:</b> {property.status || "Available"}</p>
        </div>
      </div>

      {/* AMENITIES */}
      <div className="property-card">
        <h3>Amenities</h3>

        {property.amenities?.length ? (
          <div className="amenities-view">
            {property.amenities.map((a) => (
              <span key={a} className="amenity-badge">
                {a}
              </span>
            ))}
          </div>
        ) : (
          <p>No amenities added</p>
        )}
      </div>

      {/* COMPLIANCE */}
      {property.compliance && (
        <div className="property-card">
          <h3>Compliance Records</h3>

          <ul className="compliance-list">
            <li>Sale Deed: {property.compliance.hasSaleDeed ? "Yes" : "No"}</li>
            <li>NOC: {property.compliance.hasNOC ? "Yes" : "No"}</li>
            <li>Tax Receipt: {property.compliance.hasTaxReceipt ? "Yes" : "No"}</li>
          </ul>

          {property.compliance.remarks && (
            <p><b>Remarks:</b> {property.compliance.remarks}</p>
          )}
        </div>
      )}

      {/* 🔥 DOCUMENT UPLOAD & VIEW (THIS WAS MISSING BEFORE) */}
      <div className="property-card">
        <PropertyDocuments propertyId={property._id} />
      </div>
    </div>
  );
}
