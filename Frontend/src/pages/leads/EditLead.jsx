import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import Toast from "../../components/common/Toast";

const EditLead = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [visitDate, setVisitDate] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [properties, setProperties] = useState([]);
  const [activityNote, setActivityNote] = useState("");
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showConvert, setShowConvert] = useState(false);

  useEffect(() => {
    fetchLead();
    fetchProperties();
  }, [id]);

  const fetchLead = async () => {
    try {
      const res = await API.get(`/leads/${id}`);
      setLead(res.data.data);
    } catch {
      setToast({ message: "Failed to load lead", type: "error" });
      navigate("/leads");
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await API.get("/properties");
      setProperties(res.data.data || []);
    } catch {
      setToast({ message: "Failed to load properties", type: "error" });
    }
  };

  const updateLeadStatus = async () => {
    try {
      await API.put(`/leads/${id}`, { status: lead.status });
      setToast({ message: "Lead updated successfully", type: "success" });
    } catch {
      setToast({ message: "Failed to update lead", type: "error" });
    }
  };

  const scheduleSiteVisit = async () => {
    if (!propertyId || !visitDate) {
      return setToast({ message: "Select property and date", type: "error" });
    }

    try {
      await API.post(`/leads/${id}/site-visit`, { propertyId, visitDate });
      setVisitDate("");
      setPropertyId("");
      fetchLead();
      setToast({ message: "Site visit scheduled", type: "success" });
    } catch {
      setToast({ message: "Failed to schedule visit", type: "error" });
    }
  };

  const addActivity = async () => {
    if (!activityNote.trim()) return;

    try {
      await API.post(`/leads/${id}/activity`, {
        type: "Note",
        description: activityNote
      });
      setActivityNote("");
      fetchLead();
      setToast({ message: "Activity added", type: "success" });
    } catch {
      setToast({ message: "Failed to add activity", type: "error" });
    }
  };

  const confirmConvert = async () => {
    try {
      await API.post(`/leads/${id}/convert`);
      setToast({ message: "Lead converted successfully", type: "success" });
      setTimeout(() => navigate("/customers"), 1200);
    } catch {
      setToast({ message: "Conversion failed", type: "error" });
    }
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/leads/${id}`);
      setToast({ message: "Lead deleted successfully", type: "success" });
      setTimeout(() => navigate("/leads"), 1200);
    } catch {
      setToast({ message: "Failed to delete lead", type: "error" });
    }
  };

  if (loading) return <p style={{ padding: 30 }}>Loading…</p>;
  if (!lead) return null;

  return (
    <div style={styles.page}>

      {toast && (
        <Toast {...toast} onClose={() => setToast(null)} />
      )}

      {/* HEADER */}
      <div style={styles.header}>
        <h1>Edit Lead</h1>
        <p>Manage lead progress, site visits and follow-ups</p>
      </div>

      {/* GRID */}
      <div style={styles.grid}>

        {/* LEFT */}
        <div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Lead Details</h3>
            <div style={styles.detailsGrid}>
              <Detail label="Name" value={lead.name} />
              <Detail label="Phone" value={lead.phone} />
              <Detail label="Email" value={lead.email || "—"} />
              <Detail label="Source" value={lead.source} />
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Status</h3>
            <select
              style={styles.input}
              value={lead.status}
              onChange={e => setLead({ ...lead, status: e.target.value })}
            >
              <option>New</option>
              <option>Contacted</option>
              <option>Site Visit Scheduled</option>
              <option>Negotiation</option>
              <option>Converted</option>
              <option>Dropped</option>
            </select>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Schedule Site Visit</h3>
            <div style={styles.inline}>
              <select
                style={styles.input}
                value={propertyId}
                onChange={e => setPropertyId(e.target.value)}
              >
                <option value="">Select Property</option>
                {properties.map(p => (
                  <option key={p._id} value={p._id}>
                    {p.type} • {p.locality}
                  </option>
                ))}
              </select>

              <input
                type="date"
                style={styles.input}
                value={visitDate}
                onChange={e => setVisitDate(e.target.value)}
              />

              <button style={styles.secondaryBtn} onClick={scheduleSiteVisit}>
                Schedule
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Add Activity</h3>
            <textarea
              style={styles.textarea}
              rows="3"
              value={activityNote}
              onChange={e => setActivityNote(e.target.value)}
            />
            <button style={styles.secondaryBtn} onClick={addActivity}>
              Add Activity
            </button>
          </div>

        </div>

        {/* RIGHT */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Activity Timeline</h3>

          {lead.activities.length === 0 && (
            <p style={{ color: "#6b7280" }}>No activity yet</p>
          )}

          {lead.activities.map((a, i) => (
            <div key={i} style={styles.timelineItem}>
              <div style={styles.dot} />
              <div>
                <strong>{a.type}</strong>
                <div>{a.description}</div>
                <div style={styles.date}>
                  {new Date(a.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ACTIONS */}
      <div style={styles.actions}>
        <button style={styles.primaryBtn} onClick={updateLeadStatus}>Update</button>
        {lead.status !== "Converted" && (
          <button style={styles.primaryBtn} onClick={() => setShowConvert(true)}>
            Convert
          </button>
        )}
        <button style={styles.dangerBtn} onClick={() => setShowDelete(true)}>
          Delete
        </button>
        <button style={styles.secondaryBtn} onClick={() => navigate("/leads")}>
          Cancel
        </button>
      </div>

      {/* DELETE MODAL */}
      {showDelete && (
        <Modal
          title="Delete Lead"
          text="This action cannot be undone. Do you want to continue?"
          onCancel={() => setShowDelete(false)}
          onConfirm={confirmDelete}
          confirmText="Delete"
          danger
        />
      )}

      {/* CONVERT MODAL */}
      {showConvert && (
        <Modal
          title="Convert Lead"
          text="This lead will be converted to a customer."
          onCancel={() => setShowConvert(false)}
          onConfirm={confirmConvert}
          confirmText="Convert"
        />
      )}

    </div>
  );
};

/* ================= COMPONENTS ================= */

const Detail = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 12, color: "#6b7280" }}>{label}</div>
    <div style={{ fontWeight: 600 }}>{value}</div>
  </div>
);

const Modal = ({ title, text, onCancel, onConfirm, confirmText, danger }) => (
  <div style={modal.overlay}>
    <div style={modal.box}>
      <h3>{title}</h3>
      <p style={{ marginTop: 8 }}>{text}</p>
      <div style={modal.actions}>
        <button style={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
        <button
          style={danger ? styles.dangerBtn : styles.primaryBtn}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  </div>
);

/* ================= STYLES ================= */

const styles = {
  page: { maxWidth: 1200, margin: "32px auto", padding: "0 24px" },
  header: { marginBottom: 24 },
  grid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 },
  card: {
    background: "#fff",
    borderRadius: 18,
    padding: 24,
    marginBottom: 24,
    boxShadow: "0 14px 30px rgba(0,0,0,0.08)"
  },
  cardTitle: { fontSize: 16, fontWeight: 700, marginBottom: 16 },
  detailsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  input: { padding: "10px 14px", borderRadius: 10, border: "1px solid #d1d5db" },
  textarea: { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #d1d5db", marginBottom: 8 },
  inline: { display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 12 },
  actions: { display: "flex", gap: 12, marginTop: 24 },
  primaryBtn: { background: "#2563eb", color: "#fff", padding: "10px 18px", borderRadius: 10, border: "none", fontWeight: 600 },
  secondaryBtn: { background: "#e5e7eb", padding: "10px 18px", borderRadius: 10, border: "none", fontWeight: 600 },
  dangerBtn: { background: "#ef4444", color: "#fff", padding: "10px 18px", borderRadius: 10, border: "none", fontWeight: 600 },
  timelineItem: { display: "flex", gap: 12, marginBottom: 16 },
  dot: { width: 10, height: 10, background: "#2563eb", borderRadius: "50%", marginTop: 6 },
  date: { fontSize: 12, color: "#6b7280" }
};

const modal = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  box: {
    background: "#fff",
    borderRadius: 16,
    padding: 24,
    width: 420,
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 24
  }
};

export default EditLead;
