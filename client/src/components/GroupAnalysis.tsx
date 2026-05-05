import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { athletes, type GroupType, type Gender, type YearKey } from "@/lib/athleteData";

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
  trunkFlexors: 120,
  trunkExtensors: 150,
  trunkLateral: 100,
};

export default function GroupAnalysis({ yearView }: GroupAnalysisProps) {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const currentGroup = groups[selectedGroup];

  // Get athletes in selected group
  const groupAthletes = athletes.filter(a => a.group === currentGroup.group && a.gender === currentGroup.gender);

  // Prepare data for charts - combining same units
  const prepareGroupData = () => {
    return groupAthletes.map(a => {
      const year = yearView === "2025" ? "2025" : yearView === "2026" ? "2026" : "2026";
      const data = a.data[year];
      return {
        name: a.name.split(' ')[0], // First name only
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

  const groupData = prepareGroupData();

  // Chart configurations
  const chartConfigs = [
    {
      title: "Hip Range of Motion (Degrees)",
      keys: ["lHipROM", "rHipROM"],
      labels: ["L Hip ROM", "R Hip ROM"],
      unit: "°",
      colors: ["#6366f1", "#0ea5e9"],
      normative: NORMATIVE_VALUES.hipROM,
    },
    {
      title: "Forward Reaching Test (Centimeters)",
      keys: ["forwardReach"],
      labels: ["Forward Reach"],
      unit: "cm",
      colors: ["#f59e0b"],
      normative: NORMATIVE_VALUES.forwardReach,
    },
    {
      title: "Isometric Strength - Hip (Newtons)",
      keys: ["lhFlexors", "rhFlexors", "lhExtensors", "rhExtensors", "lhAdductors", "rhAdductors", "lhAbductors", "rhAbductors"],
      labels: ["LH Flex", "RH Flex", "LH Ext", "RH Ext", "LH Add", "RH Add", "LH Abd", "RH Abd"],
      unit: "N",
      colors: ["#6366f1", "#0ea5e9", "#06b6d4", "#14b8a6", "#22c55e", "#84cc16", "#facc15", "#f59e0b"],
      normative: NORMATIVE_VALUES.hipStrength,
    },
    {
      title: "Isometric Strength - Ankle (Newtons)",
      keys: ["laPlantarflexors", "raPlantarflexors"],
      labels: ["LA Plantarflexors", "RA Plantarflexors"],
      unit: "N",
      colors: ["#f97316", "#ec4899"],
      normative: NORMATIVE_VALUES.ankleStrength,
    },
    {
      title: "Trunk Muscle Endurance (Seconds)",
      keys: ["flexors", "extensors", "leftLateral", "rightLateral"],
      labels: ["Flexors", "Extensors", "Left Lateral", "Right Lateral"],
      unit: "s",
      colors: ["#14b8a6", "#06b6d4", "#0891b2", "#0369a1"],
      normative: NORMATIVE_VALUES.trunkFlexors,
    },
  ];

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
            <div className="text-xs mt-1 opacity-80">{groupAthletes.length} athletes</div>
          </button>
        ))}
      </div>

      {/* Group Header */}
      <div className="bg-white rounded-lg p-6 border border-slate-200" style={{ borderTopColor: currentGroup.color, borderTopWidth: 4 }}>
        <h2 className="text-2xl font-bold" style={{ color: currentGroup.color }}>
          {currentGroup.label}
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          {groupAthletes.length} athletes • Year: {yearView === "Compare" ? "2025 vs 2026" : yearView}
        </p>
      </div>

      {/* Charts Grid */}
      <div className="space-y-8">
        {chartConfigs.map((config, idx) => (
          <div key={idx} className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{config.title}</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: config.unit, angle: -90, position: "insideLeft" }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                  formatter={(value: any) => value.toFixed(1)}
                />
                <Legend />
                {config.keys.map((key, i) => (
                  <Bar 
                    key={key} 
                    dataKey={key} 
                    fill={config.colors[i]} 
                    name={config.labels[i]}
                    radius={[8, 8, 0, 0]}
                  />
                ))}
                <ReferenceLine 
                  y={config.normative} 
                  stroke="#94a3b8" 
                  strokeDasharray="5 5" 
                  label={{ 
                    value: `Normative (${config.normative}${config.unit})`, 
                    position: "right", 
                    fill: "#64748b", 
                    fontSize: 11 
                  }} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}

        {/* FMS Scores */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Functional Movement Screen (FMS) Scores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 21]}
                label={{ value: "Score (out of 21)", angle: -90, position: "insideLeft" }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                formatter={(value: any) => value.toFixed(0)}
              />
              <Bar 
                dataKey="fms" 
                fill={currentGroup.color} 
                name="FMS Score"
                radius={[8, 8, 0, 0]}
              />
              <ReferenceLine 
                y={14} 
                stroke="#ef4444" 
                strokeDasharray="5 5" 
                label={{ value: "Poor (14)", position: "right", fill: "#dc2626", fontSize: 10 }} 
              />
              <ReferenceLine 
                y={18} 
                stroke="#eab308" 
                strokeDasharray="5 5" 
                label={{ value: "Good (18)", position: "right", fill: "#ca8a04", fontSize: 10 }} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
