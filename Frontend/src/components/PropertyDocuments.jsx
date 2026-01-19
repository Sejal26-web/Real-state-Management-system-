import React, { useEffect, useState } from "react";
import API from "../api/axios";

const PropertyDocuments = ({ propertyId }) => {
  const [documents, setDocuments] = useState([]);
  const [files, setFiles] = useState([]);
  const [documentType, setDocumentType] = useState("Sale Deed");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (propertyId) fetchDocuments();
  }, [propertyId]);

  const fetchDocuments = async () => {
    const res = await API.get(`/property-documents/${propertyId}`);
    setDocuments(res.data || []);
  };

  const uploadDocuments = async () => {
    if (!files.length) return alert("Select files");

    const formData = new FormData();
    files.forEach((f) => formData.append("documents", f));
    formData.append("documentType", documentType);

    try {
      setLoading(true);
      await API.post(
        `/property-documents/upload/${propertyId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setFiles([]);
      fetchDocuments();
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="property-doc-card">
      <h3>Property Documents</h3>

      {/* UPLOAD */}
      <div className="upload-section">
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
        >
          <option>Sale Deed</option>
          <option>Agreement</option>
          <option>Tax Receipt</option>
          <option>Khata</option>
          <option>Other</option>
        </select>

        <input
          type="file"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
        />

        <button onClick={uploadDocuments} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* ✅ VIEW LIST (THIS WAS MISSING VISUALLY) */}
      <div className="doc-list">
        {documents.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No documents uploaded</p>
        ) : (
          documents.map((d) => (
            <div key={d._id} className="doc-item">
              <span>
                <strong>{d.documentType}</strong> – {d.fileName}
              </span>

              <a
                href={d.fileUrl || `http://localhost:5000/${d.filePath}`}
                target="_blank"
                rel="noreferrer"
              >
                View
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PropertyDocuments;
