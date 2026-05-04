import { useState } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ReferenceLine } from "recharts";
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

// Normative values for each test
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

export default function TestTabs({ athlete, yearView, teamAvg2025, teamAvg2026 }: TestTabsProps) {
  const [activeTab, setActiveTab] = useState("jointrom");
  const d25 = athlete.data["2025"];
  const d26 = athlete.data["2026"];

  // Joint ROM Data - Radar Chart with Normative Values
  const jointROMRadarData = [
    { metric: "L Hip ROM", 2025: d25.jointROM.hipTotalRomL, 2026: d26.jointROM.hipTotalRomL, normative: NORMATIVE_VALUES.hipROM },
    { metric: "R Hip ROM", 2025: d25.jointROM.hipTotalRomR, 2026: d26.jointROM.hipTotalRomR, normative: NORMATIVE_VALUES.hipROM },
    { metric: "Forward Reach", 2025: d25.jointROM.forwardReachingTest, 2026: d26.jointROM.forwardReachingTest, normative: NORMATIVE_VALUES.forwardReach },
  ];

  // Isometric Strength - All 12 measurements with normative values
  const isometricData = [
    { name: "LH Flexors", 2025: d25.isometricStrength.lhFlexors, 2026: d26.isometricStrength.lhFlexors, normative: NORMATIVE_VALUES.hipStrength },
    { name: "RH Flexors", 2025: d25.isometricStrength.rhFlexors, 2026: d26.isometricStrength.rhFlexors, normative: NORMATIVE_VALUES.hipStrength },
    { name: "LH Extensors", 2025: d25.isometricStrength.lhExtensors, 2026: d26.isometricStrength.lhExtensors, normative: NORMATIVE_VALUES.hipStrength },
    { name: "RH Extensors", 2025: d25.isometricStrength.rhExtensors, 2026: d26.isometricStrength.rhExtensors, normative: NORMATIVE_VALUES.hipStrength },
    { name: "LH Adductors", 2025: d25.isometricStrength.lhAdductors, 2026: d26.isometricStrength.lhAdductors, normative: NORMATIVE_VALUES.hipStrength },
    { name: "RH Adductors", 2025: d25.isometricStrength.rhAdductors, 2026: d26.isometricStrength.rhAdductors, normative: NORMATIVE_VALUES.hipStrength },
    { name: "LH Abductors", 2025: d25.isometricStrength.lhAbductors, 2026: d26.isometricStrength.lhAbductors, normative: NORMATIVE_VALUES.hipStrength },
    { name: "RH Abductors", 2025: d25.isometricStrength.rhAbductors, 2026: d26.isometricStrength.rhAbductors, normative: NORMATIVE_VALUES.hipStrength },
    { name: "LA Plantarflexors", 2025: d25.isometricStrength.laPlantarflexors, 2026: d26.isometricStrength.laPlantarflexors, normative: NORMATIVE_VALUES.ankleStrength },
    { name: "RA Plantarflexors", 2025: d25.isometricStrength.raPlantarflexors, 2026: d26.isometricStrength.raPlantarflexors, normative: NORMATIVE_VALUES.ankleStrength },
    { name: "LH Add/Abd Ratio", 2025: d25.isometricStrength.lhAddAbdRatio, 2026: d26.isometricStrength.lhAddAbdRatio, normative: NORMATIVE_VALUES.addAbdRatio },
    { name: "RH Add/Abd Ratio", 2025: d25.isometricStrength.rhAddAbdRatio, 2026: d26.isometricStrength.rhAddAbdRatio, normative: NORMATIVE_VALUES.addAbdRatio },
  ];

  // Trunk Endurance Data with Normative Values
  const trunkData = [
    { name: "Flexors", 2025: d25.trunkEndurance.flexors, 2026: d26.trunkEndurance.flexors, normative: NORMATIVE_VALUES.trunkFlexors },
    { name: "Extensors", 2025: d25.trunkEndurance.extensors, 2026: d26.trunkEndurance.extensors, normative: NORMATIVE_VALUES.trunkExtensors },
    { name: "Left Lateral", 2025: d25.trunkEndurance.leftLateral, 2026: d26.trunkEndurance.leftLateral, normative: NORMATIVE_VALUES.trunkLateral },
    { name: "Right Lateral", 2025: d25.trunkEndurance.rightLateral, 2026: d26.trunkEndurance.rightLateral, normative: NORMATIVE_VALUES.trunkLateral },
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
                {yearView === "2025" || yearView === "Compare" ? (
                  <Radar name="2025" dataKey="2025" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                ) : null}
                {yearView === "2026" || yearView === "Compare" ? (
                  <Radar name="2026" dataKey="2026" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.25} />
                ) : null}
                <Radar name="Normative" dataKey="normative" stroke="#94a3b8" strokeDasharray="5 5" fill="none" />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>

            {/* Metrics Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <p className="text-sm font-semibold text-slate-600">L Hip ROM (°)</p>
                <p className="text-2xl font-bold text-blue-600">{d26.jointROM.hipTotalRomL.toFixed(1)}</p>
                <p className="text-xs text-slate-500 mt-1">Norm: {NORMATIVE_VALUES.hipROM}°</p>
                <p className={`text-xs font-semibold mt-1 ${d26.jointROM.hipTotalRomL >= NORMATIVE_VALUES.hipROM ? "text-green-600" : "text-red-600"}`}>
                  {d26.jointROM.hipTotalRomL >= NORMATIVE_VALUES.hipROM ? "✓ Above Norm" : "✗ Below Norm"}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <p className="text-sm font-semibold text-slate-600">R Hip ROM (°)</p>
                <p className="text-2xl font-bold text-blue-600">{d26.jointROM.hipTotalRomR.toFixed(1)}</p>
                <p className="text-xs text-slate-500 mt-1">Norm: {NORMATIVE_VALUES.hipROM}°</p>
                <p className={`text-xs font-semibold mt-1 ${d26.jointROM.hipTotalRomR >= NORMATIVE_VALUES.hipROM ? "text-green-600" : "text-red-600"}`}>
                  {d26.jointROM.hipTotalRomR >= NORMATIVE_VALUES.hipROM ? "✓ Above Norm" : "✗ Below Norm"}
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <p className="text-sm font-semibold text-slate-600">Forward Reach (cm)</p>
                <p className="text-2xl font-bold text-blue-600">{d26.jointROM.forwardReachingTest.toFixed(1)}</p>
                <p className="text-xs text-slate-500 mt-1">Norm: {NORMATIVE_VALUES.forwardReach} cm</p>
                <p className={`text-xs font-semibold mt-1 ${d26.jointROM.forwardReachingTest >= NORMATIVE_VALUES.forwardReach ? "text-green-600" : "text-red-600"}`}>
                  {d26.jointROM.forwardReachingTest >= NORMATIVE_VALUES.forwardReach ? "✓ Above Norm" : "✗ Below Norm"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Isometric Strength - Area Chart */}
        {activeTab === "isometric" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Isometric Strength - All 12 Measurements (Newtons)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={isometricData} margin={{ top: 10, right: 30, left: 0, bottom: 50 }}>
                <defs>
                  <linearGradient id="color2025" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="color2026" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                {yearView === "2025" || yearView === "Compare" ? (
                  <Area type="monotone" dataKey="2025" stroke="#6366f1" fillOpacity={1} fill="url(#color2025)" name="2025" />
                ) : null}
                {yearView === "2026" || yearView === "Compare" ? (
                  <Area type="monotone" dataKey="2026" stroke="#0ea5e9" fillOpacity={1} fill="url(#color2026)" name="2026" />
                ) : null}
                <ReferenceLine y={NORMATIVE_VALUES.hipStrength} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Normative (200N)", position: "right", fill: "#64748b" }} />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>

            {/* Metrics Grid */}
            <div className="grid grid-cols-4 gap-3">
              {isometricData.map((item) => (
                <div key={item.name} className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-slate-600 truncate">{item.name}</p>
                  <p className="text-lg font-bold text-orange-600">{item["2026"].toFixed(1)}</p>
                  <p className="text-xs text-slate-500">Norm: {item.normative}</p>
                  <p className={`text-xs font-semibold mt-1 ${item["2026"] >= item.normative ? "text-green-600" : "text-red-600"}`}>
                    {item["2026"] >= item.normative ? "✓" : "✗"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Functional Movement Screen - Gauge */}
        {activeTab === "fms" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Functional Movement Screen - Total Score (out of 21)</h3>

            <div className="grid grid-cols-2 gap-6">
              {/* 2025 Gauge */}
              {(yearView === "2025" || yearView === "Compare") && (
                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-24 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full rounded-b-none flex items-center justify-center border-4 border-slate-200">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-slate-800">{fmsScore.toFixed(0)}</p>
                      <p className="text-sm text-slate-600">/21</p>
                    </div>
                    <div
                      className="absolute bottom-0 w-2 h-24 bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-full origin-bottom"
                      style={{
                        transform: `rotate(${(fmsScore / 21) * 180 - 90}deg)`,
                        transformOrigin: "bottom center",
                      }}
                    />
                  </div>
                  <p className="text-sm font-semibold mt-3" style={{ color: fmsStatus(fmsScore).color }}>
                    {fmsStatus(fmsScore).text}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">2025 Score</p>
                </div>
              )}

              {/* 2026 Gauge */}
              {(yearView === "2026" || yearView === "Compare") && (
                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-24 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full rounded-b-none flex items-center justify-center border-4 border-slate-200">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-slate-800">{fmsScore26.toFixed(0)}</p>
                      <p className="text-sm text-slate-600">/21</p>
                    </div>
                    <div
                      className="absolute bottom-0 w-2 h-24 bg-gradient-to-t from-sky-500 to-sky-400 rounded-full origin-bottom"
                      style={{
                        transform: `rotate(${(fmsScore26 / 21) * 180 - 90}deg)`,
                        transformOrigin: "bottom center",
                      }}
                    />
                  </div>
                  <p className="text-sm font-semibold mt-3" style={{ color: fmsStatus(fmsScore26).color }}>
                    {fmsStatus(fmsScore26).text}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">2026 Score</p>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center">
                <p className="text-sm text-slate-600">2025 Score</p>
                <p className="text-2xl font-bold text-green-600">{fmsScore.toFixed(0)}/21</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
                <p className="text-sm text-slate-600">2026 Score</p>
                <p className="text-2xl font-bold text-blue-600">{fmsScore26.toFixed(0)}/21</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center">
                <p className="text-sm text-slate-600">Change</p>
                <p className={`text-2xl font-bold ${fmsScore26 >= fmsScore ? "text-green-600" : "text-red-600"}`}>
                  {fmsScore26 >= fmsScore ? "+" : ""}{(fmsScore26 - fmsScore).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Trunk Endurance - Line Chart */}
        {activeTab === "trunk" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Trunk Muscle Endurance - Hold Times (Seconds)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trunkData} margin={{ top: 10, right: 30, left: 0, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                {yearView === "2025" || yearView === "Compare" ? (
                  <Line type="monotone" dataKey="2025" stroke="#6366f1" strokeWidth={2} name="2025" dot={{ fill: "#6366f1", r: 4 }} />
                ) : null}
                {yearView === "2026" || yearView === "Compare" ? (
                  <Line type="monotone" dataKey="2026" stroke="#0ea5e9" strokeWidth={2} name="2026" dot={{ fill: "#0ea5e9", r: 4 }} />
                ) : null}
                <ReferenceLine y={NORMATIVE_VALUES.trunkFlexors} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Normative", position: "right", fill: "#64748b" }} />
                <Legend />
              </LineChart>
            </ResponsiveContainer>

            {/* Metrics Cards */}
            <div className="grid grid-cols-4 gap-4">
              {trunkData.map((item) => (
                <div key={item.name} className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-slate-600">{item.name}</p>
                  <p className="text-2xl font-bold text-teal-600">{item["2026"].toFixed(1)}s</p>
                  <p className="text-xs text-slate-500 mt-1">Norm: {item.normative}s</p>
                  <p className={`text-xs font-semibold mt-1 ${item["2026"] >= item.normative ? "text-green-600" : "text-red-600"}`}>
                    {item["2026"] >= item.normative ? "✓ Above Norm" : "✗ Below Norm"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
