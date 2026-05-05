import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell, LineChart, Line } from "recharts";
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

  // Hip ROM Data - Bar Chart (L Hip ROM & R Hip ROM together)
  const hipROMData = [
    { name: "L Hip ROM", 2025: d25.jointROM.hipTotalRomL, 2026: d26.jointROM.hipTotalRomL, normative: NORMATIVE_VALUES.hipROM },
    { name: "R Hip ROM", 2025: d25.jointROM.hipTotalRomR, 2026: d26.jointROM.hipTotalRomR, normative: NORMATIVE_VALUES.hipROM },
  ];

  // Forward Reaching Test Data (separate - different units)
  const forwardReachData = [
    { name: "Forward Reach", 2025: d25.jointROM.forwardReachingTest, 2026: d26.jointROM.forwardReachingTest, normative: NORMATIVE_VALUES.forwardReach },
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

  // Helper function to calculate change
  const calculateChange = (val2025: number, val2026: number) => {
    const change = val2026 - val2025;
    const percent = ((change / val2025) * 100).toFixed(1);
    return { change: change.toFixed(1), percent };
  };

  // Metric Card Component
  const MetricCard = ({ label, value2025, value2026, unit, normative }: any) => {
    const { change, percent } = calculateChange(value2025, value2026);
    const isAboveNorm = value2026 >= normative;
    return (
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-200">
        <p className="text-xs font-semibold text-slate-600 mb-2">{label}</p>
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-sm text-slate-500">2025: <span className="font-bold text-slate-800">{value2025.toFixed(1)}{unit}</span></p>
            <p className="text-sm text-slate-500">2026: <span className="font-bold text-slate-800">{value2026.toFixed(1)}{unit}</span></p>
          </div>
          <div className={`text-right ${parseFloat(change) >= 0 ? "text-green-600" : "text-red-600"}`}>
            <p className="text-sm font-bold">{parseFloat(change) >= 0 ? "+" : ""}{change}{unit}</p>
            <p className="text-xs">{parseFloat(change) >= 0 ? "+" : ""}{percent}%</p>
          </div>
        </div>
        <p className={`text-xs font-semibold ${isAboveNorm ? "text-green-600" : "text-red-600"}`}>
          {isAboveNorm ? "✓ Above Norm" : "✗ Below Norm"} ({normative}{unit})
        </p>
      </div>
    );
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
        {/* Joint ROM & Flexibility - Two separate bar charts */}
        {activeTab === "jointrom" && (
          <div className="space-y-8">
            {/* Chart 1: Hip ROM */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Hip Range of Motion (Angles - Degrees)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hipROMData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: "Degrees (°)", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  {yearView === "2025" || yearView === "Compare" ? (
                    <Bar dataKey="2025" fill="#6366f1" name="2025" />
                  ) : null}
                  {yearView === "2026" || yearView === "Compare" ? (
                    <Bar dataKey="2026" fill="#0ea5e9" name="2026" />
                  ) : null}
                  <ReferenceLine y={NORMATIVE_VALUES.hipROM} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: `Normative (${NORMATIVE_VALUES.hipROM}°)`, position: "right", fill: "#64748b", fontSize: 12 }} />
                </BarChart>
              </ResponsiveContainer>

              {/* Metric Cards for Hip ROM */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <MetricCard
                  label="L Hip ROM"
                  value2025={d25.jointROM.hipTotalRomL}
                  value2026={d26.jointROM.hipTotalRomL}
                  unit="°"
                  normative={NORMATIVE_VALUES.hipROM}
                />
                <MetricCard
                  label="R Hip ROM"
                  value2025={d25.jointROM.hipTotalRomR}
                  value2026={d26.jointROM.hipTotalRomR}
                  unit="°"
                  normative={NORMATIVE_VALUES.hipROM}
                />
              </div>
            </div>

            {/* Chart 2: Forward Reaching Test */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Forward Reaching Test (Distance - Centimeters)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={forwardReachData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: "Distance (cm)", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  {yearView === "2025" || yearView === "Compare" ? (
                    <Bar dataKey="2025" fill="#f59e0b" name="2025" />
                  ) : null}
                  {yearView === "2026" || yearView === "Compare" ? (
                    <Bar dataKey="2026" fill="#fbbf24" name="2026" />
                  ) : null}
                  <ReferenceLine y={NORMATIVE_VALUES.forwardReach} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: `Normative (${NORMATIVE_VALUES.forwardReach}cm)`, position: "right", fill: "#64748b", fontSize: 12 }} />
                </BarChart>
              </ResponsiveContainer>

              {/* Metric Card for Forward Reach */}
              <div className="mt-6 max-w-xs">
                <MetricCard
                  label="Forward Reaching Test"
                  value2025={d25.jointROM.forwardReachingTest}
                  value2026={d26.jointROM.forwardReachingTest}
                  unit="cm"
                  normative={NORMATIVE_VALUES.forwardReach}
                />
              </div>
            </div>
          </div>
        )}

        {/* Isometric Strength - Horizontal bars for main measurements + Pie charts for ratios */}
        {activeTab === "isometric" && (
          <div className="space-y-8">
            {/* Main Strength Measurements - Horizontal Bar Chart */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Isometric Strength - Main Measurements (Newtons)</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={isometricData.slice(0, 10)} layout="vertical" margin={{ top: 10, right: 30, left: 120, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" label={{ value: "Force (N)", position: "insideBottomRight", offset: -5 }} />
                  <YAxis dataKey="name" type="category" width={110} />
                  <Tooltip />
                  <Legend />
                  {yearView === "2025" || yearView === "Compare" ? (
                    <Bar dataKey="2025" fill="#6366f1" name="2025" radius={[0, 8, 8, 0]} />
                  ) : null}
                  {yearView === "2026" || yearView === "Compare" ? (
                    <Bar dataKey="2026" fill="#0ea5e9" name="2026" radius={[0, 8, 8, 0]} />
                  ) : null}
                  <ReferenceLine x={NORMATIVE_VALUES.hipStrength} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: `Norm (${NORMATIVE_VALUES.hipStrength}N)`, position: "top", fill: "#64748b", fontSize: 10 }} />
                </BarChart>
              </ResponsiveContainer>

              {/* Metric Cards for Main Measurements */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <MetricCard label="LH Flexors" value2025={d25.isometricStrength.lhFlexors} value2026={d26.isometricStrength.lhFlexors} unit="N" normative={NORMATIVE_VALUES.hipStrength} />
                <MetricCard label="RH Flexors" value2025={d25.isometricStrength.rhFlexors} value2026={d26.isometricStrength.rhFlexors} unit="N" normative={NORMATIVE_VALUES.hipStrength} />
                <MetricCard label="LH Extensors" value2025={d25.isometricStrength.lhExtensors} value2026={d26.isometricStrength.lhExtensors} unit="N" normative={NORMATIVE_VALUES.hipStrength} />
                <MetricCard label="RH Extensors" value2025={d25.isometricStrength.rhExtensors} value2026={d26.isometricStrength.rhExtensors} unit="N" normative={NORMATIVE_VALUES.hipStrength} />
                <MetricCard label="LH Adductors" value2025={d25.isometricStrength.lhAdductors} value2026={d26.isometricStrength.lhAdductors} unit="N" normative={NORMATIVE_VALUES.hipStrength} />
                <MetricCard label="RH Adductors" value2025={d25.isometricStrength.rhAdductors} value2026={d26.isometricStrength.rhAdductors} unit="N" normative={NORMATIVE_VALUES.hipStrength} />
                <MetricCard label="LH Abductors" value2025={d25.isometricStrength.lhAbductors} value2026={d26.isometricStrength.lhAbductors} unit="N" normative={NORMATIVE_VALUES.hipStrength} />
                <MetricCard label="RH Abductors" value2025={d25.isometricStrength.rhAbductors} value2026={d26.isometricStrength.rhAbductors} unit="N" normative={NORMATIVE_VALUES.hipStrength} />
                <MetricCard label="LA Plantarflexors" value2025={d25.isometricStrength.laPlantarflexors} value2026={d26.isometricStrength.laPlantarflexors} unit="N" normative={NORMATIVE_VALUES.ankleStrength} />
                <MetricCard label="RA Plantarflexors" value2025={d25.isometricStrength.raPlantarflexors} value2026={d26.isometricStrength.raPlantarflexors} unit="N" normative={NORMATIVE_VALUES.ankleStrength} />
              </div>
            </div>

            {/* Add/Abd Ratios - Pie Charts */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Adductor/Abductor Ratio (Percentage)</h3>
              <div className="grid grid-cols-2 gap-8">
                {/* LH Add/Abd Ratio */}
                <div className="flex flex-col items-center">
                  <p className="text-sm font-semibold text-slate-600 mb-4">LH Add/Abd Ratio (2026: {d26.isometricStrength.lhAddAbdRatio.toFixed(2)})</p>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Adductors", value: (d26.isometricStrength.lhAddAbdRatio / (1 + d26.isometricStrength.lhAddAbdRatio)) * 100 },
                          { name: "Abductors", value: (100 / (1 + d26.isometricStrength.lhAddAbdRatio)) * 100 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        <Cell fill="#6366f1" />
                        <Cell fill="#0ea5e9" />
                      </Pie>
                      <Tooltip formatter={(value: any) => `${typeof value === 'number' ? value.toFixed(1) : value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-center">
                    <p className={`text-sm font-semibold ${d26.isometricStrength.lhAddAbdRatio >= NORMATIVE_VALUES.addAbdRatio ? "text-green-600" : "text-red-600"}`}>
                      {d26.isometricStrength.lhAddAbdRatio >= NORMATIVE_VALUES.addAbdRatio ? "✓ Balanced" : "✗ Imbalanced"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Norm: {NORMATIVE_VALUES.addAbdRatio}</p>
                  </div>
                </div>

                {/* RH Add/Abd Ratio */}
                <div className="flex flex-col items-center">
                  <p className="text-sm font-semibold text-slate-600 mb-4">RH Add/Abd Ratio (2026: {d26.isometricStrength.rhAddAbdRatio.toFixed(2)})</p>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Adductors", value: (d26.isometricStrength.rhAddAbdRatio / (1 + d26.isometricStrength.rhAddAbdRatio)) * 100 },
                          { name: "Abductors", value: (100 / (1 + d26.isometricStrength.rhAddAbdRatio)) * 100 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        <Cell fill="#f97316" />
                        <Cell fill="#ec4899" />
                      </Pie>
                      <Tooltip formatter={(value: any) => `${typeof value === 'number' ? value.toFixed(1) : value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-center">
                    <p className={`text-sm font-semibold ${d26.isometricStrength.rhAddAbdRatio >= NORMATIVE_VALUES.addAbdRatio ? "text-green-600" : "text-red-600"}`}>
                      {d26.isometricStrength.rhAddAbdRatio >= NORMATIVE_VALUES.addAbdRatio ? "✓ Balanced" : "✗ Imbalanced"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Norm: {NORMATIVE_VALUES.addAbdRatio}</p>
                  </div>
                </div>
              </div>

              {/* Ratio Metric Cards */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <MetricCard label="LH Add/Abd Ratio" value2025={d25.isometricStrength.lhAddAbdRatio} value2026={d26.isometricStrength.lhAddAbdRatio} unit="" normative={NORMATIVE_VALUES.addAbdRatio} />
                <MetricCard label="RH Add/Abd Ratio" value2025={d25.isometricStrength.rhAddAbdRatio} value2026={d26.isometricStrength.rhAddAbdRatio} unit="" normative={NORMATIVE_VALUES.addAbdRatio} />
              </div>
            </div>
          </div>
        )}

        {/* Functional Movement Screen - Gauge */}
        {activeTab === "fms" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Functional Movement Screen (FMS)</h3>
            
            {/* Gauge for 2026 */}
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-32">
                <svg viewBox="0 0 200 100" className="w-full h-full">
                  {/* Background arc */}
                  <path d="M 20 80 A 60 60 0 0 1 180 80" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                  
                  {/* Colored arcs */}
                  <path d="M 20 80 A 60 60 0 0 1 80 20" fill="none" stroke="#ef4444" strokeWidth="20" />
                  <path d="M 80 20 A 60 60 0 0 1 140 35" fill="none" stroke="#eab308" strokeWidth="20" />
                  <path d="M 140 35 A 60 60 0 0 1 180 80" fill="none" stroke="#22c55e" strokeWidth="20" />
                  
                  {/* Needle */}
                  <line x1="100" y1="80" x2={100 + 50 * Math.cos((fmsScore26 / 21) * Math.PI - Math.PI)} y2={80 - 50 * Math.sin((fmsScore26 / 21) * Math.PI - Math.PI)} stroke="#334155" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="100" cy="80" r="6" fill="#334155" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-slate-800 mt-4">{fmsScore26}/21</p>
              <p className={`text-lg font-semibold ${fmsStatus(fmsScore26).color}`} style={{ color: fmsStatus(fmsScore26).color }}>
                {fmsStatus(fmsScore26).text}
              </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                <p className="text-xs font-semibold text-slate-600 mb-2">2025 Score</p>
                <p className="text-2xl font-bold text-red-600">{fmsScore}/21</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <p className="text-xs font-semibold text-slate-600 mb-2">2026 Score</p>
                <p className="text-2xl font-bold text-green-600">{fmsScore26}/21</p>
                <p className={`text-sm font-bold mt-1 ${fmsScore26 >= fmsScore ? "text-green-600" : "text-red-600"}`}>
                  {fmsScore26 >= fmsScore ? "+" : ""}{fmsScore26 - fmsScore}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Trunk Endurance - Bar Chart */}
        {activeTab === "trunk" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Trunk Muscle Endurance (Hold Times - Seconds)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={trunkData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: "Time (seconds)", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                {yearView === "2025" || yearView === "Compare" ? (
                  <Bar dataKey="2025" fill="#14b8a6" name="2025" />
                ) : null}
                {yearView === "2026" || yearView === "Compare" ? (
                  <Bar dataKey="2026" fill="#06b6d4" name="2026" />
                ) : null}
                <ReferenceLine y={NORMATIVE_VALUES.trunkFlexors} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Normative", position: "right", fill: "#64748b", fontSize: 12 }} />
              </BarChart>
            </ResponsiveContainer>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <MetricCard label="Flexors" value2025={d25.trunkEndurance.flexors} value2026={d26.trunkEndurance.flexors} unit="s" normative={NORMATIVE_VALUES.trunkFlexors} />
              <MetricCard label="Extensors" value2025={d25.trunkEndurance.extensors} value2026={d26.trunkEndurance.extensors} unit="s" normative={NORMATIVE_VALUES.trunkExtensors} />
              <MetricCard label="Left Lateral" value2025={d25.trunkEndurance.leftLateral} value2026={d26.trunkEndurance.leftLateral} unit="s" normative={NORMATIVE_VALUES.trunkLateral} />
              <MetricCard label="Right Lateral" value2025={d25.trunkEndurance.rightLateral} value2026={d26.trunkEndurance.rightLateral} unit="s" normative={NORMATIVE_VALUES.trunkLateral} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
