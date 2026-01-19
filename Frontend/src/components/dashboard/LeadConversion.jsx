import React from "react";

const LeadConversion = ({ data }) => {
  if (!data) {
    return (
      <div className="chart-card">
        <h3>Lead Conversion</h3>
        <p>Loading lead data...</p>
      </div>
    );
  }

  const totalLeads = data.totalLeads ?? 0;
  const converted = data.converted ?? 0;
  const rate =
    totalLeads === 0 ? 0 : ((converted / totalLeads) * 100).toFixed(1);

  return (
    <div className="chart-card">
      <h3>Lead Conversion</h3>

      <div className="conversion-metrics">
        <p><strong>Total Leads:</strong> {totalLeads}</p>
        <p><strong>Converted:</strong> {converted}</p>
        <p><strong>Conversion Rate:</strong> {rate}%</p>
      </div>
    </div>
  );
};

export default LeadConversion;
