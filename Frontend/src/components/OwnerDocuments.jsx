import React, { useEffect, useState } from "react";
import API from "../api/axios";

const OwnerDocuments = ({ ownerId }) => {
  const [documents, setDocuments] = useState([]);
  const [files, setFiles] = useState([]);
  const [documentType, setDocumentType] = useState("Aadhar");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ownerId) fetchDocuments();
  }, [ownerId]);

  const fetchDocuments = async () => {
    const res = await API.get(`/owner-documents/${ownerId}`);
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
        `/owner-documents/upload/${ownerId}`,
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
      <h3>Owner Documents</h3>

      <div className="upload-section">
        <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
          <option>Aadhar</option>
          <option>PAN</option>
          <option>Agreement</option>
          <option>Other</option>
        </select>

        <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} />

        <button onClick={uploadDocuments} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <div className="doc-list">
        {documents.map((d) => (
          <div key={d._id} className="doc-item">
            <span>
              <strong>{d.documentType}</strong> – {d.fileName}
            </span>
            <a
              href={`http://localhost:5000/${d.filePath}`}
              target="_blank"
              rel="noreferrer"
            >
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerDocuments;
