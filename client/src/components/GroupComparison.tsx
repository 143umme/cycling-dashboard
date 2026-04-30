import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { athletes, getGroupStats, getAllGroups, type YearKey } from "@/lib/athleteData";

interface GroupComparisonProps {
  yearView: YearKey | "Compare";
}

const testMetrics = [
  { id: "hipRomL", label: "L Hip ROM (°)", key: "jointROM", subkey: "hipTotalRomL" },
  { id: "hipRomR", label: "R Hip ROM (°)", key: "jointROM", subkey: "hipTotalRomR" },
  { id: "forwardReach", label: "Forward Reach (cm)", key: "jointROM", subkey: "forwardReachingTest" },
  { id: "lhFlexors", label: "LH Flexors (N)", key: "isometricStrength", subkey: "lhFlexors" },
  { id: "rhFlexors", label: "RH Flexors (N)", key: "isometricStrength", subkey: "rhFlexors" },
  { id: "lhExtensors", label: "LH Extensors (N)", key: "isometricStrength", subkey: "lhExtensors" },
  { id: "rhExtensors", label: "RH Extensors (N)", key: "isometricStrength", subkey: "rhExtensors" },
  { id: "fmsScore", label: "FMS Score (/21)", key: "functionalMovement", subkey: "totalScore" },
  { id: "flexors", label: "Trunk Flexors (s)", key: "trunkEndurance", subkey: "flexors" },
  { id: "extensors", label: "Trunk Extensors (s)", key: "trunkEndurance", subkey: "extensors" },
];

export default function GroupComparison({ yearView }: GroupComparisonProps) {
  const [selectedMetric, setSelectedMetric] = useState("hipRomL");
  const groups = getAllGroups();

  const metric = testMetrics.find(m => m.id === selectedMetric)!;

  // Prepare data for chart
  const chartData = groups.map((g) => {
    const stats25 = getGroupStats(g.group, g.gender, "2025");
    const stats26 = getGroupStats(g.group, g.gender, "2026");

    const getValue = (stats: any) => {
      const year = stats.average;
      let val: any = year;
      for (const k of metric.key.split('.')) {
        val = val[k];
      }
      return val[metric.subkey];
    };

    return {
      group: g.label,
      count: stats25.count,
      "2025": getValue(stats25),
      "2026": getValue(stats26),
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Group-Wise Performance Comparison</h2>
        <p className="text-sm text-slate-600 mb-4">
          Compare performance metrics across all athlete groups (Short Distance/Long Distance × Male/Female)
        </p>
      </div>

      {/* Metric Selector */}
      <div className="bg-white rounded-lg p-4 border border-slate-200">
        <label className="text-sm font-semibold text-slate-700 block mb-2">Select Metric:</label>
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {testMetrics.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg p-6 border border-slate-200">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="group" angle={-15} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yearView !== "2025" && <Bar dataKey="2026" fill="#0ea5e9" />}
            {yearView !== "2026" && <Bar dataKey="2025" fill="#6366f1" />}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Group Statistics Table */}
      <div className="bg-white rounded-lg p-6 border border-slate-200 overflow-x-auto">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Group Statistics</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-3 font-semibold text-slate-700">Group</th>
              <th className="text-center py-2 px-3 font-semibold text-slate-700">Athletes</th>
              <th className="text-center py-2 px-3 font-semibold text-indigo-600">2025 Avg</th>
              <th className="text-center py-2 px-3 font-semibold text-sky-600">2026 Avg</th>
              <th className="text-center py-2 px-3 font-semibold text-green-600">Change</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((row, idx) => {
              const change = row["2026"] - row["2025"];
              const pct = ((change / row["2025"]) * 100).toFixed(1);
              return (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-3 font-medium text-slate-800">{row.group}</td>
                  <td className="text-center py-3 px-3 text-slate-600">{row.count}</td>
                  <td className="text-center py-3 px-3 text-indigo-600 font-semibold">{row["2025"].toFixed(1)}</td>
                  <td className="text-center py-3 px-3 text-sky-600 font-semibold">{row["2026"].toFixed(1)}</td>
                  <td className={`text-center py-3 px-3 font-semibold ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {change >= 0 ? "+" : ""}{change.toFixed(1)} ({pct}%)
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
