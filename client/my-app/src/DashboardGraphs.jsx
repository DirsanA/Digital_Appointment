// DashboardGraphs.jsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const colors = [
  "#3B82F6",
  "#22C55E",
  "#A855F7",
  "#EF4444",
  "#F97316",
  "#10B981",
];

const DashboardGraphs = ({ patientStats, hospitalStatus }) => {
  return (
    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mt-6">
      <div className="bg-white shadow-md p-4 rounded-lg">
        <h3 className="mb-2 font-bold text-lg">
          Patient Distribution by Department
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={patientStats}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {patientStats?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow-md p-4 rounded-lg">
        <h3 className="mb-2 font-bold text-lg">Hospital Today's Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hospitalStatus}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="value"
              name="Count"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardGraphs;
