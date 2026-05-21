import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ComposedChart, Line } from "recharts";
import { athletes, type GroupType, type Gender, type YearKey } from "@/lib/athleteData";
import { useState } from "react";

interface GroupAnalysisProps {
  yearView: YearKey | "Compare";
}

const groups = [
  { group: "SD" as GroupType, gender: "Male" as Gender, label: "Short Distance - Male", color: "#f97316", bgColor: "#fed7aa" },
  { group: "SD" as GroupType, gender: "Female" as Gender, label: "Short Distance - Female", color: "#ec4899", bgColor: "#fbcfe8" },
  { group: "LD" as GroupType, gender: "Male" as Gender, label: "Long Distance - Male", color: "#22c55e", bgColor: "#dcfce7" },
  { group: "LD" as GroupType, gender: "Female" as Gender, label: "Long Distance - Female", color: "#0891b2", bgColor: "#cffafe" },
];

export default function GroupAnalysis({ yearView }: GroupAnalysisProps) {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [compareGroupIdx, setCompareGroupIdx] = useState(1);
  
  const currentGroup = groups[selectedGroup];
  const compareGroup = groups[compareGroupIdx];

  // Get athletes in selected group
  const groupAthletes = athletes.filter(a => a.group === currentGroup.group && a.gender === currentGroup.gender);
  const compareAthletes = athletes.filter(a => a.group === compareGroup.group && a.gender === compareGroup.gender);

  // Calculate group averages for Y-Balance (clean aggregated data)
  const calculateYBalanceAverages = (athleteList: typeof athletes, year: "2025" | "2026") => {
    const ybalanceData = athleteList
      .map(a => a.data.yBalance?.[year])
      .filter(d => d !== undefined && d !== null);

    if (ybalanceData.length === 0) return null;

    const avg = (values: (number | null | undefined)[]) => {
      const filtered = values.filter(v => v !== null && v !== undefined) as number[];
      return filtered.length > 0 ? filtered.reduce((a, b) => a + b, 0) / filtered.length : 0;
    };

    return {
      anterior: avg(ybalanceData.map(d => d?.anterior)),
      medial: avg(ybalanceData.map(d => d?.medial)),
      lateral: avg(ybalanceData.map(d => d?.lateral)),
      composite: avg(ybalanceData.map(d => d?.leftComposite)),
      anteriorDisbalance: avg(ybalanceData.map(d => d?.anteriorDisbalance)),
      medialDisbalance: avg(ybalanceData.map(d => d?.medialDisbalance)),
      lateralDisbalance: avg(ybalanceData.map(d => d?.lateralDisbalance)),
      compositeDisbalance: avg(ybalanceData.map(d => d?.compositeDisbalance)),
    };
  };

  // Get Y-Balance averages for current group
  const ybalance2025 = calculateYBalanceAverages(groupAthletes, "2025");
  const ybalance2026 = calculateYBalanceAverages(groupAthletes, "2026");

  // Get Y-Balance averages for comparison group
  const compareYbalance2025 = calculateYBalanceAverages(compareAthletes, "2025");
  const compareYbalance2026 = calculateYBalanceAverages(compareAthletes, "2026");

  // Prepare Y-Balance comparison data for current group
  const ybalanceComparisonData = [
    {
      metric: "Anterior",
      "2025": ybalance2025?.anterior || 0,
      "2026": ybalance2026?.anterior || 0,
    },
    {
      metric: "Medial",
      "2025": ybalance2025?.medial || 0,
      "2026": ybalance2026?.medial || 0,
    },
    {
      metric: "Lateral",
      "2025": ybalance2025?.lateral || 0,
      "2026": ybalance2026?.lateral || 0,
    },
    {
      metric: "Composite",
      "2025": ybalance2025?.composite || 0,
      "2026": ybalance2026?.composite || 0,
    },
  ];

  // Prepare Y-Balance disbalance data for current group
  const ybalanceDisbalanceData = [
    {
      metric: "Anterior",
      "2025": ybalance2025?.anteriorDisbalance || 0,
      "2026": ybalance2026?.anteriorDisbalance || 0,
    },
    {
      metric: "Medial",
      "2025": ybalance2025?.medialDisbalance || 0,
      "2026": ybalance2026?.medialDisbalance || 0,
    },
    {
      metric: "Lateral",
      "2025": ybalance2025?.lateralDisbalance || 0,
      "2026": ybalance2026?.lateralDisbalance || 0,
    },
    {
      metric: "Composite",
      "2025": ybalance2025?.compositeDisbalance || 0,
      "2026": ybalance2026?.compositeDisbalance || 0,
    },
  ];

  // Prepare Y-Balance comparison data for comparison group
  const compareYbalanceComparisonData = [
    {
      metric: "Anterior",
      "2025": compareYbalance2025?.anterior || 0,
      "2026": compareYbalance2026?.anterior || 0,
    },
    {
      metric: "Medial",
      "2025": compareYbalance2025?.medial || 0,
      "2026": compareYbalance2026?.medial || 0,
    },
    {
      metric: "Lateral",
      "2025": compareYbalance2025?.lateral || 0,
      "2026": compareYbalance2026?.lateral || 0,
    },
    {
      metric: "Composite",
      "2025": compareYbalance2025?.composite || 0,
      "2026": compareYbalance2026?.composite || 0,
    },
  ];

  // Prepare Y-Balance disbalance data for comparison group
  const compareYbalanceDisbalanceData = [
    {
      metric: "Anterior",
      "2025": compareYbalance2025?.anteriorDisbalance || 0,
      "2026": compareYbalance2026?.anteriorDisbalance || 0,
    },
    {
      metric: "Medial",
      "2025": compareYbalance2025?.medialDisbalance || 0,
      "2026": compareYbalance2026?.medialDisbalance || 0,
    },
    {
      metric: "Lateral",
      "2025": compareYbalance2025?.lateralDisbalance || 0,
      "2026": compareYbalance2026?.lateralDisbalance || 0,
    },
    {
      metric: "Composite",
      "2025": compareYbalance2025?.compositeDisbalance || 0,
      "2026": compareYbalance2026?.compositeDisbalance || 0,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Group Selector */}
      <div className="grid grid-cols-4 gap-3">
        {groups.map((g, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedGroup(idx);
              setComparisonMode(false);
            }}
            className={`p-4 rounded-lg font-semibold text-sm transition-all ${
              selectedGroup === idx
                ? "text-white shadow-lg scale-105"
                : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
            }`}
            style={selectedGroup === idx ? { background: g.color } : {}}
          >
            {g.label}
            <br />
            <span className="text-xs opacity-90">{groupAthletes.length} athletes</span>
          </button>
        ))}
      </div>

      {/* Group Header with Comparison Toggle */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{currentGroup.label}</h2>
            <p className="text-sm text-slate-600 mt-1">
              {groupAthletes.length} athletes • Year: {yearView === "Compare" ? "2025 vs 2026" : yearView}
            </p>
          </div>
          <button
            onClick={() => setComparisonMode(!comparisonMode)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              comparisonMode
                ? "bg-blue-500 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {comparisonMode ? "✓ Comparing" : "Compare Groups"}
          </button>
        </div>

        {comparisonMode && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <label className="text-sm font-semibold text-slate-700 block mb-2">Compare with:</label>
            <select
              value={compareGroupIdx}
              onChange={(e) => setCompareGroupIdx(Number(e.target.value))}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            >
              {groups.map((g, idx) => (
                <option key={idx} value={idx} disabled={idx === selectedGroup}>
                  {g.label}
                </option>
              ))}
            </select>
            {comparisonMode && (
              <p className="text-sm text-slate-600 mt-2">
                Comparing <strong>{currentGroup.label}</strong> vs <strong>{compareGroup.label}</strong>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Y-Balance Test - Composite Scores by Direction */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Y-Balance Test - Group Average Scores by Direction</h3>
          <p className="text-sm text-slate-600 mb-4">Group average reach percentages (higher is better, ≥94% is normative)</p>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={ybalanceComparisonData} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="metric" />
              <YAxis domain={[70, 130]} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
              <Legend />
              <Bar dataKey="2025" fill="#3b82f6" name="2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="2026" fill="#f97316" name="2026" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="2025" stroke="#3b82f6" strokeWidth={2} dot={false} name="2025 Trend" />
              <Line type="monotone" dataKey="2026" stroke="#f97316" strokeWidth={2} dot={false} name="2026 Trend" />
              <ReferenceLine y={94} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "Normative (94%)", position: "right", fill: "#dc2626", fontSize: 10 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Y-Balance Test - Disbalance Comparison */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Y-Balance Test - Group Average Disbalance</h3>
          <p className="text-sm text-slate-600 mb-4">Group average disbalance percentages (lower is better, &lt;4% is balanced)</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ybalanceDisbalanceData} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="metric" />
              <YAxis domain={[0, 10]} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
              <Legend />
              <Bar dataKey="2025" fill="#8b5cf6" name="2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="2026" fill="#ec4899" name="2026" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={4} stroke="#22c55e" strokeDasharray="5 5" label={{ value: "Balanced (<4%)", position: "right", fill: "#16a34a", fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Comparison Charts - Only show when comparison mode is active */}
        {comparisonMode && (
          <>
            <div className="border-t-2 border-slate-300 pt-8 mt-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Comparison: {compareGroup.label}</h2>
            </div>

            {/* Comparison Group - Y-Balance Test - Composite Scores by Direction */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Y-Balance Test - {compareGroup.label} Average Scores by Direction</h3>
              <p className="text-sm text-slate-600 mb-4">Group average reach percentages (higher is better, ≥94% is normative)</p>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={compareYbalanceComparisonData} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="metric" />
                  <YAxis domain={[70, 130]} />
                  <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
                  <Legend />
                  <Bar dataKey="2025" fill="#3b82f6" name="2025" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="2026" fill="#f97316" name="2026" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="2025" stroke="#3b82f6" strokeWidth={2} dot={false} name="2025 Trend" />
                  <Line type="monotone" dataKey="2026" stroke="#f97316" strokeWidth={2} dot={false} name="2026 Trend" />
                  <ReferenceLine y={94} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "Normative (94%)", position: "right", fill: "#dc2626", fontSize: 10 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Comparison Group - Y-Balance Test - Disbalance Comparison */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Y-Balance Test - {compareGroup.label} Average Disbalance</h3>
              <p className="text-sm text-slate-600 mb-4">Group average disbalance percentages (lower is better, &lt;4% is balanced)</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={compareYbalanceDisbalanceData} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="metric" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
                  <Legend />
                  <Bar dataKey="2025" fill="#8b5cf6" name="2025" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="2026" fill="#ec4899" name="2026" radius={[4, 4, 0, 0]} />
                  <ReferenceLine y={4} stroke="#22c55e" strokeDasharray="5 5" label={{ value: "Balanced (<4%)", position: "right", fill: "#16a34a", fontSize: 10 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
