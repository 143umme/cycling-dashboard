import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
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

  // Joint ROM & Flexibility
  const jointROMData = [
    { name: "L Hip ROM", 2025: d25.jointROM.hipTotalRomL, 2026: d26.jointROM.hipTotalRomL, team25: avg25.jointROM.hipTotalRomL, team26: avg26.jointROM.hipTotalRomL },
    { name: "R Hip ROM", 2025: d25.jointROM.hipTotalRomR, 2026: d26.jointROM.hipTotalRomR, team25: avg25.jointROM.hipTotalRomR, team26: avg26.jointROM.hipTotalRomR },
    { name: "Forward Reach", 2025: d25.jointROM.forwardReachingTest, 2026: d26.jointROM.forwardReachingTest, team25: avg25.jointROM.forwardReachingTest, team26: avg26.jointROM.forwardReachingTest },
  ];

  // Isometric Strength
  const isometricData = [
    { name: "LH Flexors", 2025: d25.isometricStrength.lhFlexors, 2026: d26.isometricStrength.lhFlexors },
    { name: "RH Flexors", 2025: d25.isometricStrength.rhFlexors, 2026: d26.isometricStrength.rhFlexors },
    { name: "LH Extensors", 2025: d25.isometricStrength.lhExtensors, 2026: d26.isometricStrength.lhExtensors },
    { name: "RH Extensors", 2025: d25.isometricStrength.rhExtensors, 2026: d26.isometricStrength.rhExtensors },
    { name: "LH Adductors", 2025: d25.isometricStrength.lhAdductors, 2026: d26.isometricStrength.lhAdductors },
    { name: "RH Adductors", 2025: d25.isometricStrength.rhAdductors, 2026: d26.isometricStrength.rhAdductors },
    { name: "LH Abductors", 2025: d25.isometricStrength.lhAbductors, 2026: d26.isometricStrength.lhAbductors },
    { name: "RH Abductors", 2025: d25.isometricStrength.rhAbductors, 2026: d26.isometricStrength.rhAbductors },
    { name: "LA Plantarflexors", 2025: d25.isometricStrength.laPlantarflexors, 2026: d26.isometricStrength.laPlantarflexors },
    { name: "RA Plantarflexors", 2025: d25.isometricStrength.raPlantarflexors, 2026: d26.isometricStrength.raPlantarflexors },
    { name: "LH Add/Abd Ratio", 2025: d25.isometricStrength.lhAddAbdRatio, 2026: d26.isometricStrength.lhAddAbdRatio },
    { name: "RH Add/Abd Ratio", 2025: d25.isometricStrength.rhAddAbdRatio, 2026: d26.isometricStrength.rhAddAbdRatio },
  ];

  // Trunk Endurance
  const trunkData = [
    { name: "Flexors", 2025: d25.trunkEndurance.flexors, 2026: d26.trunkEndurance.flexors },
    { name: "Extensors", 2025: d25.trunkEndurance.extensors, 2026: d26.trunkEndurance.extensors },
    { name: "Left Lateral", 2025: d25.trunkEndurance.leftLateral, 2026: d26.trunkEndurance.leftLateral },
    { name: "Right Lateral", 2025: d25.trunkEndurance.rightLateral, 2026: d26.trunkEndurance.rightLateral },
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
        {/* Joint ROM & Flexibility */}
        {activeTab === "jointrom" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Joint ROM & Flexibility (Degrees / cm)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jointROMData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {yearView !== "2025" && <Bar dataKey="2026" fill="#0ea5e9" />}
                {yearView !== "2026" && <Bar dataKey="2025" fill="#6366f1" />}
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-4 mt-6">
              {jointROMData.map((item) => (
                <div key={item.name} className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-600 font-semibold">{item.name}</div>
                  <div className="text-2xl font-bold text-slate-800 mt-2">{item["2026"]}</div>
                  <div className="text-xs text-slate-500 mt-1">2025: {item["2025"]}</div>
                  <div className="text-xs text-green-600 font-semibold mt-1">
                    +{(((item["2026"] - item["2025"]) / item["2025"] * 100).toFixed(1))}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Isometric Strength */}
        {activeTab === "isometric" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Isometric Strength - 12 Measurements (Newtons)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={isometricData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                {yearView !== "2025" && <Bar dataKey="2026" fill="#0ea5e9" />}
                {yearView !== "2026" && <Bar dataKey="2025" fill="#6366f1" />}
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {isometricData.map((item) => (
                <div key={item.name} className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-600 font-semibold">{item.name}</div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <div className="text-2xl font-bold text-slate-800">{item["2026"]}</div>
                    <div className="text-xs text-slate-500">N</div>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">2025: {item["2025"]} N</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Functional Movement Screen */}
        {activeTab === "fms" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Functional Movement Screen - Total Score (out of 21)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
                <div className="text-sm text-indigo-600 font-semibold">2025 Score</div>
                <div className="text-4xl font-bold text-indigo-700 mt-2">{fmsScore}</div>
                <div className="text-xs text-indigo-600 mt-1">/21</div>
              </div>
              <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-6 rounded-lg border border-sky-200">
                <div className="text-sm text-sky-600 font-semibold">2026 Score</div>
                <div className="text-4xl font-bold text-sky-700 mt-2">{fmsScore26}</div>
                <div className="text-xs text-sky-600 mt-1">/21</div>
              </div>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-lg border border-slate-200">
                <div className="text-sm text-slate-600 font-semibold">Status</div>
                <div className="text-2xl font-bold mt-2" style={{ color: fmsStatus(fmsScore26).color }}>
                  {fmsStatus(fmsScore26).text}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {fmsScore26 < 14 ? "Poor: <14" : fmsScore26 < 18 ? "Moderate: 14-17" : "Good: 18-21"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trunk Endurance */}
        {activeTab === "trunk" && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Trunk Muscle Endurance - Hold Times (Seconds)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trunkData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {yearView !== "2025" && <Bar dataKey="2026" fill="#0ea5e9" />}
                {yearView !== "2026" && <Bar dataKey="2025" fill="#6366f1" />}
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-4 gap-4 mt-6">
              {trunkData.map((item) => (
                <div key={item.name} className="bg-slate-50 p-4 rounded-lg">
                  <div className="text-sm text-slate-600 font-semibold">{item.name}</div>
                  <div className="text-2xl font-bold text-slate-800 mt-2">{item["2026"]}</div>
                  <div className="text-xs text-slate-500 mt-1">2025: {item["2025"]}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
