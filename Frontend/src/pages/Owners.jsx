import React from "react";
import { useEffect, useState } from "react";
import API from "../api/axios";

const Owners = () => {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    API.get("/owners").then(res => setOwners(res.data));
  }, []);

  return (
    <div>
      <h2>Owners</h2>
      {owners.map(o => (
        <div key={o._id}>{o.name} - {o.phone}</div>
      ))}
    </div>
  );
};

export default Owners;
