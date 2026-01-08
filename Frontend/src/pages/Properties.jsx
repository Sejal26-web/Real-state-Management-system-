import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function Properties() {
  const [list, setList] = useState([]);
  const [price, setPrice] = useState("");

  useEffect(() => {
    API.get("/properties").then(res => setList(res.data));
  }, []);

  const addProperty = async () => {
    await API.post("/properties", {
      owner: list[0]?.owner?._id,
      type: "Flat",
      price
    });
    window.location.reload();
  };

  return (
    <div>
      <h2>Properties</h2>
      <input placeholder="Price" onChange={e => setPrice(e.target.value)} />
      <button onClick={addProperty}>Add Property</button>

      {list.map(p => (
        <div key={p._id}>
          {p.type} | {p.status} | ₹{p.price}
        </div>
      ))}
    </div>
  );
}
