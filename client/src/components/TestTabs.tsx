import { useState } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import type { Athlete, AthleteYear, YearKey } from "@/lib/athleteData";

interface TestTabsProps {
  athlete: Athlete;
  yearView: YearKey | "Compare";
  teamAvg2025: AthleteYear;
  teamAvg2026: AthleteYear;
}

const testTabs = [
  { id: "jointrom", label: "Joint ROM & Flexibility", color: "#3b82f6", icon: "🦵" },
  { id: "isometric", label: "Isometric Strength", color: "#f97316", icon: "💪" },
  { id: "fms", label: "Functional Movement", color: "#22c55e", icon: "🏃" },
  { id: "trunk", label: "Trunk Endurance", color: "#14b8a6", icon: "🧘" },
];

export default function TestTabs({ athlete, yearView, teamAvg2025, teamAvg2026 }: TestTabsProps) {
  const [activeTab, setActiveTab] = useState("jointrom");
  const d25 = athlete.data["2025"];
  const d26 = athlete.data["2026"];
  const avg25 = teamAvg2025;
  const avg26 = teamAvg2026;

  // Joint ROM Data - Radar Chart
  const jointROMRadarData = [
    { metric: "L Hip ROM", 2025: d25.jointROM.hipTotalRomL, 2026: d26.jointROM.hipTotalRomL, team: avg26.jointROM.hipTotalRomL },
    { metric: "R Hip ROM", 2025: d25.jointROM.hipTotalRomR, 2026: d26.jointROM.hipTotalRomR, team: avg26.jointROM.hipTotalRomR },
    { metric: "Forward Reach", 2025: d25.jointROM.forwardReachingTest, 2026: d26.jointROM.forwardReachingTest, team: avg26.jointROM.forwardReachingTest },
  ];

  // Isometric Strength - All 12 measurements
  const isometricData = [
    { name: "LH Flexors", 2025: d25.isometricStrength.lhFlexors, 2026: d26.isometricStrength.lhFlexors, team: avg26.isometricStrength.lhFlexors },
    { name: "RH Flexors", 2025: d25.isometricStrength.rhFlexors, 2026: d26.isometricStrength.rhFlexors, team: avg26.isometricStrength.rhFlexors },
    { name: "LH Extensors", 2025: d25.isometricStrength.lhExtensors, 2026: d26.isometricStrength.lhExtensors, team: avg26.isometricStrength.lhExtensors },
    { name: "RH Extensors", 2025: d25.isometricStrength.rhExtensors, 2026: d26.isometricStrength.rhExtensors, team: avg26.isometricStrength.rhExtensors },
    { name: "LH Adductors", 2025: d25.isometricStrength.lhAdductors, 2026: d26.isometricStrength.lhAdductors, team: avg26.isometricStrength.lhAdductors },
    { name: "RH Adductors", 2025: d25.isometricStrength.rhAdductors, 2026: d26.isometricStrength.rhAdductors, team: avg26.isometricStrength.rhAdductors },
    { name: "LH Abductors", 2025: d25.isometricStrength.lhAbductors, 2026: d26.isometricStrength.lhAbductors, team: avg26.isometricStrength.lhAbductors },
    { name: "RH Abductors", 2025: d25.isometricStrength.rhAbductors, 2026: d26.isometricStrength.rhAbductors, team: avg26.isometricStrength.rhAbductors },
    { name: "LA Plantarflexors", 2025: d25.isometricStrength.laPlantarflexors, 2026: d26.isometricStrength.laPlantarflexors, team: avg26.isometricStrength.laPlantarflexors },
    { name: "RA Plantarflexors", 2025: d25.isometricStrength.raPlantarflexors, 2026: d26.isometricStrength.raPlantarflexors, team: avg26.isometricStrength.raPlantarflexors },
    { name: "LH Add/Abd Ratio", 2025: d25.isometricStrength.lhAddAbdRatio, 2026: d26.isometricStrength.lhAddAbdRatio, team: avg26.isometricStrength.lhAddAbdRatio },
    { name: "RH Add/Abd Ratio", 2025: d25.isometricStrength.rhAddAbdRatio, 2026: d26.isometricStrength.rhAddAbdRatio, team: avg26.isometricStrength.rhAddAbdRatio },
  ];

  // Trunk Endurance Data
  const trunkData = [
    { name: "Flexors", 2025: d25.trunkEndurance.flexors, 2026: d26.trunkEndurance.flexors, team: avg26.trunkEndurance.flexors },
    { name: "Extensors", 2025: d25.trunkEndurance.extensors, 2026: d26.trunkEndurance.extensors, team: avg26.trunkEndurance.extensors },
    { name: "Left Lateral", 2025: d25.trunkEndurance.leftLateral, 2026: d26.trunkEndurance.leftLateral, team: avg26.trunkEndurance.leftLateral },
    { name: "Right Lateral", 2025: d25.trunkEndurance.rightLateral, 2026: d26.trunkEndurance.rightLateral, team: avg26.trunkEndurance.rightLateral },
  ];

  const fmsScore = d25.functionalMovement.totalScore;
  const fmsScore26 = d26.functionalMovement.totalScore;
  const fmsStatus = (score: number) => {
    if (score < 14) return { text: "Poor", color: "#ef4444" };
    if (score < 18) return { text: "Moderate", color: "#eab308" };
    return { text: "Good", color: "#22c55e" };
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {testTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg font-semibold text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "text-white border-b-2"
                : "text-slate-600 hover:text-slate-800"
            }`}
            style={
              activeTab === tab.id
                ? { background: tab.color, borderBottomColor: tab.color }
                : {}
            }
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        {/* Joint ROM & Flexibility - Radar Chart */}
        {activeTab === "jointrom" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Joint ROM & Flexibility - Radar Comparison</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={jointROMRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis />
                <Radar name="2025" dataKey="2025" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                <Radar name="2026" dataKey="2026" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.25} />
                <Radar name="Team Avg" dataKey="team" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} strokeDasharray="5 5" />
                <Legend />
                <Tooltip formatter={(value: any) => value.toFixed(1)} />
              </RadarChart>
            </ResponsiveContainer>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {jointROMRadarData.map((item) => (
                <div key={item.metric} className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-700 font-semibold">{item.metric}</div>
                  <div className="text-2xl font-bold text-blue-900 mt-2">{item["2026"]}</div>
                  <div className="text-xs text-blue-600 mt-1">2025: {item["2025"]}</div>
                  <div className="text-xs text-green-600 font-semibold mt-1">
                    +{(((item["2026"] - item["2025"]) / item["2025"] * 100).toFixed(1))}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Isometric Strength - Area Chart */}
        {activeTab === "isometric" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Isometric Strength - 12 Measurements (Newtons)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={isometricData}>
                <defs>
                  <linearGradient id="colorAthlete" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value: any) => value.toFixed(1)} />
                <Legend />
                {yearView !== "2025" && <Area type="monotone" dataKey="2026" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorAthlete)" />}
                {yearView !== "2026" && <Area type="monotone" dataKey="2025" stroke="#6366f1" fillOpacity={0.5} fill="#6366f1" />}
              </AreaChart>
            </ResponsiveContainer>

            {/* Grid of metrics */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {isometricData.map((item) => (
                <div key={item.name} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-xs text-slate-600 font-semibold truncate">{item.name}</div>
                  <div className="text-lg font-bold text-slate-800 mt-1">{item["2026"]}</div>
                  <div className="text-xs text-slate-500">2025: {item["2025"]}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Functional Movement Screen - Gauge & Comparison */}
        {activeTab === "fms" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Functional Movement Screen - Total Score (out of 21)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
                <div className="text-sm text-indigo-600 font-semibold">2025 Score</div>
                <div className="text-4xl font-bold text-indigo-700 mt-3">{fmsScore}</div>
                <div className="text-xs text-indigo-600 mt-1">/21</div>
                <div className="text-xs text-indigo-600 font-semibold mt-2">{fmsStatus(fmsScore).text}</div>
              </div>
              <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-6 rounded-lg border border-sky-200">
                <div className="text-sm text-sky-600 font-semibold">2026 Score</div>
                <div className="text-4xl font-bold text-sky-700 mt-3">{fmsScore26}</div>
                <div className="text-xs text-sky-600 mt-1">/21</div>
                <div className="text-xs text-sky-600 font-semibold mt-2">{fmsStatus(fmsScore26).text}</div>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-lg border border-slate-200">
                <div className="text-sm text-slate-600 font-semibold">Improvement</div>
                <div className="text-4xl font-bold mt-3" style={{ color: fmsScore26 >= fmsScore ? "#22c55e" : "#ef4444" }}>
                  {fmsScore26 >= fmsScore ? "+" : ""}{fmsScore26 - fmsScore}
                </div>
                <div className="text-xs text-slate-600 mt-1">points</div>
                <div className="text-xs font-semibold mt-2" style={{ color: fmsStatus(fmsScore26).color }}>
                  {fmsStatus(fmsScore26).text}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trunk Endurance - Line Chart */}
        {activeTab === "trunk" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Trunk Muscle Endurance - Hold Times (Seconds)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={trunkData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: any) => value.toFixed(1)} />
                <Legend />
                {yearView !== "2025" && <Line type="monotone" dataKey="2026" stroke="#0ea5e9" strokeWidth={3} dot={{ fill: "#0ea5e9", r: 6 }} activeDot={{ r: 8 }} />}
                {yearView !== "2026" && <Line type="monotone" dataKey="2025" stroke="#6366f1" strokeWidth={3} dot={{ fill: "#6366f1", r: 6 }} />}
                <Line type="monotone" dataKey="team" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>

            {/* Detailed comparison */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              {trunkData.map((item) => (
                <div key={item.name} className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200">
                  <div className="text-sm text-teal-700 font-semibold">{item.name}</div>
                  <div className="text-2xl font-bold text-teal-900 mt-2">{item["2026"]}</div>
                  <div className="text-xs text-teal-600 mt-1">2025: {item["2025"]}</div>
                  <div className="text-xs text-green-600 font-semibold mt-1">
                    +{(((item["2026"] - item["2025"]) / item["2025"] * 100).toFixed(1))}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
