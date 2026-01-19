import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#3b82f6", "#f97316", "#22c55e", "#ef4444"];

const PropertyStatus = ({ data = [] }) => {
  if (!data.length) {
    return <div className="chart-card">Loading status...</div>;
  }

  const chartData = data.map((item) => ({
    name: item.status,
    value: item.count
  }));

  return (
    <div className="chart-card">
      <h3>Lead Status Distribution</h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PropertyStatus;
