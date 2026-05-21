import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell, ScatterChart, Scatter, ComposedChart } from "recharts";
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

// Normative values
const NORMATIVE_VALUES = {
  hipROM: 90,
  forwardReach: 29,
  hipStrength: 200,
  addAbdRatio: 1,
  ankleStrength: 600,
  trunkFlexors: 240,
  trunkExtensors: 180,
  trunkLateral: 120,
};

export default function GroupAnalysis({ yearView }: GroupAnalysisProps) {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [compareGroupIdx, setCompareGroupIdx] = useState(1);
  
  const currentGroup = groups[selectedGroup];
  const compareGroup = groups[compareGroupIdx];

  // Get athletes in selected group
  const groupAthletes = athletes.filter(a => a.group === currentGroup.group && a.gender === currentGroup.gender);
  const compareAthletes = athletes.filter(a => a.group === compareGroup.group && a.gender === compareGroup.gender);

  // Prepare data for charts - combining same units
  const prepareGroupData = () => {
    return groupAthletes.map(a => {
      const year = yearView === "2025" ? "2025" : yearView === "2026" ? "2026" : "2026";
      const data = a.data[year];
      return {
        name: a.name,
        fullName: a.name,
        // Joint ROM (angles)
        lHipROM: data.jointROM.hipTotalRomL,
        rHipROM: data.jointROM.hipTotalRomR,
        // Forward Reach (cm)
        forwardReach: data.jointROM.forwardReachingTest,
        // Isometric Strength (N)
        lhFlexors: data.isometricStrength.lhFlexors,
        rhFlexors: data.isometricStrength.rhFlexors,
        lhExtensors: data.isometricStrength.lhExtensors,
        rhExtensors: data.isometricStrength.rhExtensors,
        lhAdductors: data.isometricStrength.lhAdductors,
        rhAdductors: data.isometricStrength.rhAdductors,
        lhAbductors: data.isometricStrength.lhAbductors,
        rhAbductors: data.isometricStrength.rhAbductors,
        laPlantarflexors: data.isometricStrength.laPlantarflexors,
        raPlantarflexors: data.isometricStrength.raPlantarflexors,
        lhAddAbdRatio: data.isometricStrength.lhAddAbdRatio,
        rhAddAbdRatio: data.isometricStrength.rhAddAbdRatio,
        // Trunk Endurance (seconds)
        flexors: data.trunkEndurance.flexors,
        extensors: data.trunkEndurance.extensors,
        leftLateral: data.trunkEndurance.leftLateral,
        rightLateral: data.trunkEndurance.rightLateral,
        // FMS
        fms: data.functionalMovement.totalScore,
      };
    });
  };

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

  // Prepare Y-Balance comparison data
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

  // Prepare Y-Balance disbalance data
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

  const groupData = prepareGroupData();

  return (
    <div className="space-y-8">
      {/* Group Selector */}
      <div className="grid grid-cols-4 gap-3">
        {groups.map((g, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedGroup(idx)}
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

      {/* Group Header */}
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
            {comparisonMode ? "✓ Comparison Mode" : "Compare with Group"}
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
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Hip Range of Motion */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Hip Range of Motion (Degrees)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} label={{ value: "Degrees", angle: -90, position: "insideLeft" }} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
              <Legend />
              <Bar dataKey="lHipROM" fill="#3b82f6" name="L Hip ROM" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rHipROM" fill="#f97316" name="R Hip ROM" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={NORMATIVE_VALUES.hipROM} stroke="#ef4444" strokeDasharray="5 5" label={{ value: `Norm (${NORMATIVE_VALUES.hipROM}°)`, position: "right", fill: "#dc2626", fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Forward Reaching Test */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Forward Reaching Test (cm)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 60]} label={{ value: "cm", angle: -90, position: "insideLeft" }} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
              <Area type="monotone" dataKey="forwardReach" fill="#f97316" stroke="#ea580c" fillOpacity={0.6} name="Forward Reach" />
              <ReferenceLine y={NORMATIVE_VALUES.forwardReach} stroke="#ef4444" strokeDasharray="5 5" label={{ value: `Norm (${NORMATIVE_VALUES.forwardReach}cm)`, position: "right", fill: "#dc2626", fontSize: 10 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Add/Abd Ratio - Dumbbell Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Add/Abd Ratio - Left vs Right</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="lhAddAbdRatio" name="Ratio Value" domain={[0.6, 1.5]} type="number" />
              <YAxis dataKey="name" name="Athlete" type="category" width={100} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} cursor={{ strokeDasharray: "3 3" }} />
              <Legend />
              <Scatter name="Left Hip" data={groupData} fill="#3b82f6" />
              <Scatter name="Right Hip" data={groupData} dataKey="rhAddAbdRatio" fill="#f97316" />
              <ReferenceLine x={1} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "Norm (1.0)", position: "top", fill: "#dc2626", fontSize: 10 }} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

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

        {/* Trunk Endurance */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Trunk Endurance (Seconds)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 300]} label={{ value: "Seconds", angle: -90, position: "insideLeft" }} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
              <Legend />
              <Bar dataKey="flexors" fill="#3b82f6" name="Flexors" radius={[4, 4, 0, 0]} />
              <Bar dataKey="extensors" fill="#f97316" name="Extensors" radius={[4, 4, 0, 0]} />
              <Bar dataKey="leftLateral" fill="#8b5cf6" name="Left Lateral" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rightLateral" fill="#ec4899" name="Right Lateral" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={NORMATIVE_VALUES.trunkFlexors} stroke="#ef4444" strokeDasharray="5 5" label={{ value: `Flexor Norm (${NORMATIVE_VALUES.trunkFlexors}s)`, position: "right", fill: "#dc2626", fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Isometric Strength - Hip Flexors vs Extensors */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Isometric Strength - Hip Flexors vs Extensors (N)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 400]} label={{ value: "Force (N)", angle: -90, position: "insideLeft" }} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
              <Legend />
              <Bar dataKey="lhFlexors" fill="#3b82f6" name="L Flexors" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rhFlexors" fill="#60a5fa" name="R Flexors" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lhExtensors" fill="#f97316" name="L Extensors" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rhExtensors" fill="#fb923c" name="R Extensors" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={NORMATIVE_VALUES.hipStrength} stroke="#ef4444" strokeDasharray="5 5" label={{ value: `Norm (${NORMATIVE_VALUES.hipStrength}N)`, position: "right", fill: "#dc2626", fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* FMS Score Distribution */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Functional Movement Screen (FMS) Scores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 21]} label={{ value: "Score", angle: -90, position: "insideLeft" }} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
              <Bar dataKey="fms" fill="#8b5cf6" name="FMS Total" radius={[8, 8, 0, 0]} />
              <ReferenceLine y={14} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "Poor (14)", position: "right", fill: "#dc2626", fontSize: 10 }} />
              <ReferenceLine y={18} stroke="#eab308" strokeDasharray="5 5" label={{ value: "Good (18)", position: "right", fill: "#b45309", fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
