import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, LineChart, Line, ComposedChart, ScatterChart, Scatter } from "recharts";
import type { Athlete, AthleteYear, YearKey } from "@/lib/athleteData";
import { YBalanceTest } from "./YBalanceTest";
import IsokineticsChart from "./IsokineticsChart";
import IKTMetricsSummary from "./IKTMetricsSummary";

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
  { id: "ybalance", label: "Y-Balance Test", color: "#8b5cf6", icon: "⚖️" },
  { id: "isokinetic", label: "Isokinetic Knee Test", color: "#ec4899", icon: "🦵" },
];

// Normative values for each test
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

  // Isometric Strength - Main measurements (without ratios)
  const isometricData = [
    { name: "LH Flexors", 2025: d25.isometricStrength.lhFlexors, 2026: d26.isometricStrength.lhFlexors, normative: NORMATIVE_VALUES.hipStrength },
    { name: "RH Flexors", 2025: d25.isometricStrength.rhFlexors, 2026: d26.isometricStrength.rhFlexors, normative: NORMATIVE_VALUES.hipStrength },
    { name: "LH Extensors", 2025: d25.isometricStrength.lhExtensors, 2026: d26.isometricStrength.lhExtensors, normative: NORMATIVE_VALUES.hipStrength },
    { name: "RH Extensors", 2025: d25.isometricStrength.rhExtensors, 2026: d26.isometricStrength.rhExtensors, normative: NORMATIVE_VALUES.hipStrength },
    { name: "LH Adductors", 2025: d25.isometricStrength.lhAdductors, 2026: d26.isometricStrength.lhAdductors, normative: NORMATIVE_VALUES.hipStrength },
    { name: "RH Adductors", 2025: d25.isometricStrength.rhAdductors, 2026: d26.isometricStrength.rhAdductors, normative: NORMATIVE_VALUES.hipStrength },
    { name: "LH Abductors", 2025: d25.isometricStrength.lhAbductors, 2026: d26.isometricStrength.lhAbductors, normative: NORMATIVE_VALUES.hipStrength },
    { name: "RH Abductors", 2025: d25.isometricStrength.rhAbductors, 2026: d26.isometricStrength.rhAbductors, normative: NORMATIVE_VALUES.hipStrength },
  ];

  // Ankle Plantarflexors - Separate (different normative)
  const ankleData = [
    { name: "L Ankle Plantarflexors", 2025: d25.isometricStrength.laPlantarflexors, 2026: d26.isometricStrength.laPlantarflexors, normative: NORMATIVE_VALUES.ankleStrength },
    { name: "R Ankle Plantarflexors", 2025: d25.isometricStrength.raPlantarflexors, 2026: d26.isometricStrength.raPlantarflexors, normative: NORMATIVE_VALUES.ankleStrength },
  ];

  // Add/Abd Ratios - Separate section
  const ratioData = [
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

  // Ratio Card Component - Simple display
  const RatioCard = ({ label, value2025, value2026, normative }: any) => {
    const { change, percent } = calculateChange(value2025, value2026);
    const isBalanced = Math.abs(value2026 - normative) < 0.2;
    return (
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-200">
        <p className="text-xs font-semibold text-slate-600 mb-2">{label}</p>
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-sm text-slate-500">2025: <span className="font-bold text-slate-800">{value2025.toFixed(2)}</span></p>
            <p className="text-sm text-slate-500">2026: <span className="font-bold text-slate-800">{value2026.toFixed(2)}</span></p>
          </div>
          <div className={`text-right ${parseFloat(change) >= 0 ? "text-green-600" : "text-red-600"}`}>
            <p className="text-sm font-bold">{parseFloat(change) >= 0 ? "+" : ""}{change}</p>
            <p className="text-xs">{parseFloat(change) >= 0 ? "+" : ""}{percent}%</p>
          </div>
        </div>
        <p className={`text-xs font-semibold ${isBalanced ? "text-green-600" : "text-orange-600"}`}>
          {isBalanced ? "✓ Balanced" : "⚠ Imbalanced"} (Norm: {normative})
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
            style={activeTab === tab.id ? { backgroundColor: tab.color, borderBottomColor: tab.color } : {}}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Joint ROM & Flexibility Tab */}
      {activeTab === "jointrom" && (
        <div className="space-y-6">
          {/* Hip ROM Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Hip Range of Motion (Degrees)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hipROMData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                <YAxis label={{ value: "°", angle: -90, position: "insideLeft" }} />
                <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value.toFixed(1)} />
                <Legend />
                <Bar dataKey="2025" fill="#6366f1" name="2025" radius={[8, 8, 0, 0]} />
                <Bar dataKey="2026" fill="#0ea5e9" name="2026" radius={[8, 8, 0, 0]} />
                <ReferenceLine y={NORMATIVE_VALUES.hipROM} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Normative (90°)", position: "right", fill: "#64748b", fontSize: 11 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Hip ROM Metric Cards */}
          <div className="grid grid-cols-2 gap-4">
            {hipROMData.map((item, idx) => (
              <MetricCard key={idx} label={item.name} value2025={item["2025"]} value2026={item["2026"]} unit="°" normative={item.normative} />
            ))}
          </div>

          {/* Forward Reach Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Forward Reaching Test (cm)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={forwardReachData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                <YAxis label={{ value: "cm", angle: -90, position: "insideLeft" }} />
                <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value.toFixed(1)} />
                <Legend />
                <Bar dataKey="2025" fill="#f97316" name="2025" radius={[8, 8, 0, 0]} />
                <Bar dataKey="2026" fill="#ec4899" name="2026" radius={[8, 8, 0, 0]} />
                <ReferenceLine y={NORMATIVE_VALUES.forwardReach} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Normative (29cm)", position: "right", fill: "#64748b", fontSize: 11 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Forward Reach Metric Card */}
          <div className="grid grid-cols-1 gap-4">
            {forwardReachData.map((item, idx) => (
              <MetricCard key={idx} label={item.name} value2025={item["2025"]} value2026={item["2026"]} unit="cm" normative={item.normative} />
            ))}
          </div>
        </div>
      )}

      {/* Isometric Strength Tab */}
      {activeTab === "isometric" && (
        <div className="space-y-6">
          {/* Main Strength Measurements */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Hip Strength Measurements (N)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={isometricData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 11 }} />
                <YAxis label={{ value: "N", angle: -90, position: "insideLeft" }} />
                <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value.toFixed(1)} />
                <Legend />
                <Bar dataKey="2025" fill="#6366f1" name="2025" radius={[4, 4, 0, 0]} />
                <Bar dataKey="2026" fill="#0ea5e9" name="2026" radius={[4, 4, 0, 0]} />
                <ReferenceLine y={NORMATIVE_VALUES.hipStrength} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Normative (200N)", position: "right", fill: "#64748b", fontSize: 10 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Metric Cards for Hip Strength */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {isometricData.map((item, idx) => (
              <MetricCard key={idx} label={item.name} value2025={item["2025"]} value2026={item["2026"]} unit="N" normative={item.normative} />
            ))}
          </div>

          {/* Ankle Plantarflexors - Separate Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Ankle Plantarflexors (N)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ankleData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                <YAxis label={{ value: "N", angle: -90, position: "insideLeft" }} />
                <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value.toFixed(1)} />
                <Legend />
                <Bar dataKey="2025" fill="#10b981" name="2025" radius={[8, 8, 0, 0]} />
                <Bar dataKey="2026" fill="#f59e0b" name="2026" radius={[8, 8, 0, 0]} />
                <ReferenceLine y={NORMATIVE_VALUES.ankleStrength} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Normative (600N)", position: "right", fill: "#64748b", fontSize: 11 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ankle Metric Cards */}
          <div className="grid grid-cols-2 gap-4">
            {ankleData.map((item, idx) => (
              <MetricCard key={idx} label={item.name} value2025={item["2025"]} value2026={item["2026"]} unit="N" normative={item.normative} />
            ))}
          </div>

          {/* Add/Abd Ratios - Horizontal Dumbbell Scatter Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Add/Abd Ratios - Left vs Right (2025 vs 2026)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 20, right: 30, left: 80, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number" 
                  dataKey="ratio" 
                  name="Ratio Value"
                  domain={[0.6, 1.4]}
                  label={{ value: "Ratio Value", position: "insideBottomRight", offset: -10 }}
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  name="Side"
                  width={70}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2 rounded border border-slate-200 text-xs">
                          <p className="font-semibold">{data.name}</p>
                          <p className="text-slate-600">{data.year}: {data.ratio.toFixed(2)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <ReferenceLine 
                  x={1} 
                  stroke="#ef4444" 
                  strokeDasharray="5 5" 
                  label={{ value: "Normative (1.0)", position: "top", fill: "#64748b", fontSize: 11 }} 
                />
                {/* Left Hip 2025 */}
                <Scatter 
                  name="LH 2025" 
                  data={[{ name: "Left Hip", ratio: ratioData[0]["2025"], year: "2025" }]} 
                  fill="#6366f1" 
                  shape="circle"
                />
                {/* Left Hip 2026 */}
                <Scatter 
                  name="LH 2026" 
                  data={[{ name: "Left Hip", ratio: ratioData[0]["2026"], year: "2026" }]} 
                  fill="#06b6d4" 
                  shape="circle"
                />
                {/* Right Hip 2025 */}
                <Scatter 
                  name="RH 2025" 
                  data={[{ name: "Right Hip", ratio: ratioData[1]["2025"], year: "2025" }]} 
                  fill="#f97316" 
                  shape="circle"
                />
                {/* Right Hip 2026 */}
                <Scatter 
                  name="RH 2026" 
                  data={[{ name: "Right Hip", ratio: ratioData[1]["2026"], year: "2026" }]} 
                  fill="#f59e0b" 
                  shape="circle"
                />
              </ScatterChart>
            </ResponsiveContainer>
            
            {/* Ratio Cards Below Chart */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {ratioData.map((item, idx) => {
                const { change, percent } = calculateChange(item["2025"], item["2026"]);
                const isBalanced = Math.abs(item["2026"] - item.normative) < 0.2;
                return (
                  <div key={idx} className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-lg border border-slate-200">
                    <p className="text-sm font-semibold text-slate-700 mb-2">{item.name}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">2025:</span>
                        <span className="font-bold text-slate-800">{item["2025"].toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">2026:</span>
                        <span className="font-bold text-slate-800">{item["2026"].toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-300">
                        <span className="text-slate-600">Change:</span>
                        <span className={`font-bold ${parseFloat(change) >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {parseFloat(change) >= 0 ? "+" : ""}{change} ({percent}%)
                        </span>
                      </div>
                      <p className={`text-xs font-semibold mt-2 ${isBalanced ? "text-green-600" : "text-orange-600"}`}>
                        {isBalanced ? "✓ Balanced" : "⚠ Imbalanced"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Functional Movement Tab */}
      {activeTab === "fms" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Functional Movement Screen Score</h3>
            
            {/* FMS Gauge-like display using simple cards */}
            <div className="grid grid-cols-2 gap-6">
              {/* 2025 Score */}
              <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-300">
                <p className="text-sm font-semibold text-blue-700 mb-2">2025 Score</p>
                <div className="text-5xl font-bold text-blue-600 mb-2">{fmsScore}</div>
                <p className="text-sm text-blue-600">/21</p>
                <p className={`text-xs font-semibold mt-3 px-3 py-1 rounded-full ${fmsStatus(fmsScore).color === "#ef4444" ? "bg-red-100 text-red-700" : fmsStatus(fmsScore).color === "#eab308" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                  {fmsStatus(fmsScore).text}
                </p>
              </div>

              {/* 2026 Score */}
              <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border-2 border-cyan-300">
                <p className="text-sm font-semibold text-cyan-700 mb-2">2026 Score</p>
                <div className="text-5xl font-bold text-cyan-600 mb-2">{fmsScore26}</div>
                <p className="text-sm text-cyan-600">/21</p>
                <p className={`text-xs font-semibold mt-3 px-3 py-1 rounded-full ${fmsStatus(fmsScore26).color === "#ef4444" ? "bg-red-100 text-red-700" : fmsStatus(fmsScore26).color === "#eab308" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                  {fmsStatus(fmsScore26).text}
                </p>
              </div>
            </div>

            {/* Change indicator */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <p className="text-sm text-slate-600 mb-2">Year-over-Year Change</p>
              <p className={`text-2xl font-bold ${fmsScore26 - fmsScore >= 0 ? "text-green-600" : "text-red-600"}`}>
                {fmsScore26 - fmsScore >= 0 ? "+" : ""}{fmsScore26 - fmsScore}
              </p>
            </div>

            {/* Performance Zones */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm font-semibold text-slate-700 mb-3">Performance Zones</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-red-500"></div>
                  <p className="text-sm text-slate-700">Poor: &lt; 14</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-yellow-500"></div>
                  <p className="text-sm text-slate-700">Moderate: 14-17</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-green-500"></div>
                  <p className="text-sm text-slate-700">Good: 18-21</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trunk Endurance Tab */}
      {activeTab === "trunk" && (
        <div className="space-y-6">
          {/* Horizontal Bar Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Trunk Endurance Hold Times (seconds)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trunkData} layout="vertical" margin={{ top: 20, right: 30, left: 120, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" label={{ value: "sec", position: "insideBottomRight", offset: -10 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value.toFixed(1)} />
                <Legend />
                <Bar dataKey="2025" fill="#6366f1" name="2025" radius={[0, 8, 8, 0]} />
                <Bar dataKey="2026" fill="#0ea5e9" name="2026" radius={[0, 8, 8, 0]} />
                <ReferenceLine x={NORMATIVE_VALUES.trunkFlexors} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Norm", position: "top", fill: "#64748b", fontSize: 10 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-4">
            {trunkData.map((item, idx) => (
              <MetricCard key={idx} label={item.name} value2025={item["2025"]} value2026={item["2026"]} unit="sec" normative={item.normative} />
            ))}
          </div>
        </div>
      )}

      {/* Y-Balance Test Tab */}
      {activeTab === "ybalance" && (
        <div className="space-y-6">
          <YBalanceTest athleteName={athlete.name} yBalanceData={athlete.data.yBalance} />
        </div>
      )}

      {/* Isokinetic Knee Test Tab */}
      {activeTab === "isokinetic" && (
        <div className="space-y-6">
          {/* Side by side charts for 2025 and 2026 */}
          <div className="grid grid-cols-2 gap-6">
            <IsokineticsChart athlete={athlete} year="2025" />
            <IsokineticsChart athlete={athlete} year="2026" />
          </div>

          {/* IKT Metrics Summary - 2025 and 2026 */}
          <IKTMetricsSummary athlete={athlete} />
        </div>
      )}
    </div>
  );
}
