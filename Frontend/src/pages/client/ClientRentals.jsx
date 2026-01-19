import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import PayRentModal from "./PayRentModal";

const ClientRentals = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRental, setSelectedRental] = useState(null);

  useEffect(() => {
    fetchRentals();
  }, []);

  /* =========================
     FETCH MY RENTALS (CLIENT)
  ========================= */
  const fetchRentals = async () => {
    try {
      // ✅ FIXED ROUTE
      const res = await API.get("/rentals/my");
      setRentals(res.data.data || []);
    } catch (err) {
      console.error("CLIENT RENTALS ERROR:", err);
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading rentals...</p>;
  }

  return (
    <div className="page">
      <h1>My Rentals</h1>

      {rentals.length === 0 && <p>No rentals found</p>}

      {rentals.map((rental) => {
        const paid =
          rental.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

        const pending = rental.rentAmount - paid;

        return (
          <div key={rental._id} className="card">
            <h3>
              {rental.property?.type} – {rental.property?.locality}
            </h3>

            <p>Status: {rental.status}</p>
            <p>Rent: ₹{rental.rentAmount}</p>
            <p>Paid: ₹{paid}</p>
            <p>Pending: ₹{pending}</p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="primary-btn"
                onClick={() => setSelectedRental(rental)}
                disabled={pending <= 0}
              >
                Pay Rent
              </button>
            </div>
          </div>
        );
      })}

      {/* =========================
         PAY RENT MODAL
      ========================= */}
      {selectedRental && (
        <PayRentModal
          rental={selectedRental}
          onClose={() => setSelectedRental(null)}
          onSuccess={fetchRentals}
        />
      )}
    </div>
  );
};

export default ClientRentals;
