import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Toast from "../../components/common/Toast";
import "../../styles/sale.css";

const CreateSale = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [owners, setOwners] = useState([]);

  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    propertyId: "",
    buyerId: "",
    sellerId: "",
    totalAmount: 0,
    tokenAmount: "",
    stage: "Negotiation",
    status: "InProgress"
  });

  useEffect(() => {
    fetchProperties();
    fetchCustomers();
    fetchOwners();
  }, []);

  /* ---------------- FETCH DATA ---------------- */

  const fetchProperties = async () => {
    try {
      const res = await API.get("/properties/available");
      setProperties(res.data.data || []);
    } catch {
      setToast({ type: "error", message: "Failed to fetch properties" });
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await API.get("/customers");
      setCustomers(res.data.data || []);
    } catch {
      setToast({ type: "error", message: "Failed to fetch buyers" });
    }
  };

  const fetchOwners = async () => {
    try {
      const res = await API.get("/owners");
      setOwners(res.data.data || []);
    } catch {
      setToast({ type: "error", message: "Failed to fetch sellers" });
    }
  };

  /* ---------------- FORM HANDLING ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "propertyId") {
      const property = properties.find(p => p._id === value);

      setForm(prev => ({
        ...prev,
        propertyId: value,
        sellerId: property?.owner?._id || "",
        totalAmount: property?.price || 0
      }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  /* ---------------- VALIDATION ---------------- */

  const validateForm = () => {
    if (!form.propertyId) return "Please select a property";
    if (!form.buyerId) return "Please select a buyer";
    if (!form.sellerId) return "Seller not found for selected property";
    if (!form.tokenAmount || Number(form.tokenAmount) <= 0)
      return "Token amount must be greater than 0";
    if (Number(form.tokenAmount) > Number(form.totalAmount))
      return "Token amount cannot exceed total amount";

    return null;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setToast({ type: "error", message: error });
      return;
    }

    try {
      await API.post("/sales", {
        propertyId: form.propertyId,
        buyerId: form.buyerId,
        sellerId: form.sellerId,
        totalAmount: Number(form.totalAmount),
        tokenAmount: Number(form.tokenAmount),
        stage: form.stage,
        status: form.status
      });

      setToast({ type: "success", message: "Sale created successfully" });

      setTimeout(() => navigate("/sales"), 1200);
    } catch (err) {
      setToast({
        type: "error",
        message: err.response?.data?.message || "Failed to create sale"
      });
    }
  };

  const sellerName =
    owners.find(o => o._id === form.sellerId)?.name || "Auto selected";

  return (
    <div className="sale-container">
      {/* ✅ TOAST */}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <h2 className="sale-title">Create Sale</h2>

      <form className="sale-card" onSubmit={handleSubmit}>
        <div className="sale-form-grid">

          <div className="sale-form-group">
            <label>Property</label>
            <select name="propertyId" value={form.propertyId} onChange={handleChange}>
              <option value="">Select Property</option>
              {properties.map(p => (
                <option key={p._id} value={p._id}>
                  {p.type} – ₹{p.price}
                </option>
              ))}
            </select>
          </div>

          <div className="sale-form-group">
            <label>Buyer</label>
            <select name="buyerId" value={form.buyerId} onChange={handleChange}>
              <option value="">Select Buyer</option>
              {customers.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="sale-form-group">
            <label>Seller</label>
            <input value={sellerName} disabled />
          </div>

          <div className="sale-form-group">
            <label>Total Amount</label>
            <input type="number" value={form.totalAmount} readOnly />
          </div>

          <div className="sale-form-group">
            <label>Token Amount</label>
            <input
              type="number"
              name="tokenAmount"
              value={form.tokenAmount}
              onChange={handleChange}
            />
          </div>

        </div>

        <div className="sale-actions">
          <button className="btn btn-primary" type="submit">
            Create Sale
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/sales")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSale;
