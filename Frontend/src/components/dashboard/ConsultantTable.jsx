import React from "react";

const ConsultantTable = ({ data }) => {
  // 🛡️ SAFETY GUARD
  if (!Array.isArray(data)) {
    return (
      <div className="table-card">
        <h3>Consultant Performance</h3>
        <p>Loading consultant data...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="table-card">
        <h3>Consultant Performance</h3>
        <p>No consultant data available</p>
      </div>
    );
  }

  return (
    <div className="table-card">
      <h3>Consultant Performance</h3>

      <table>
        <thead>
          <tr>
            <th>Consultant</th>
            <th>Total Leads</th>
            <th>Converted</th>
            <th>Conversion %</th>
          </tr>
        </thead>
        <tbody>
          {data.map((c, index) => {
            const total = c.totalLeads || 0;
            const converted = c.converted || 0;
            const rate =
              total === 0 ? 0 : ((converted / total) * 100).toFixed(1);

            return (
              <tr key={index}>
                <td>{c._id || "Unknown"}</td>
                <td>{total}</td>
                <td>{converted}</td>
                <td>{rate}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ConsultantTable;
