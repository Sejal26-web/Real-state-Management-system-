import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function Rentals() {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    API.get("/rentals")
      .then(res => {
        // ✅ FIX HERE
        setRentals(res.data.rentals || []);
      })
      .catch(err => {
        console.error("Rentals fetch error:", err);
        setRentals([]);
      });
  }, []);

  return (
    <div>
      <h2>Rentals</h2>

      {rentals.length === 0 ? (
        <p>No rentals found</p>
      ) : (
        rentals.map(r => (
          <div key={r._id}>
            Rent: ₹{r.rentAmount} | {r.status}
          </div>
        ))
      )}
    </div>
  );
}
