import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const ClientPayments = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      // ✅ FIXED ENDPOINT
      const res = await API.get("/rentals/my");
      setRentals(res.data.data || []);
    } catch (err) {
      console.error("PAYMENTS FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading payments...</p>;

  return (
    <div className="page">
      <h1>My Payments</h1>

      {rentals.length === 0 && <p>No rentals found</p>}

      {rentals.map((rental) => (
        <div key={rental._id} className="card">
          <h3>
            {rental.property?.type} – {rental.property?.locality}
          </h3>

          <p>Rent: ₹{rental.rentAmount}</p>

          <h4>Payments</h4>

          {rental.payments?.length === 0 && (
            <p>No payments yet</p>
          )}

          {rental.payments?.map((p, i) => (
            <div key={i} style={{ paddingLeft: 10 }}>
              <p>
                ₹{p.amount} —{" "}
                {new Date(p.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ClientPayments;
