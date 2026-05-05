import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ScatterChart, Scatter, PieChart, Pie, Cell } from "recharts";
import { MetricCard } from "./MetricCard";
import { useState } from "react";

interface TestTabsProps {
  athlete: any;
  year: "2025" | "2026" | "both";
}

const calculateChange = (val1: number, val2: number) => {
  const change = val2 - val1;
  const percent = val1 !== 0 ? ((change / val1) * 100).toFixed(1) : "0";
  return { change: change.toFixed(2), percent };
};

export function TestTabs({ athlete, year }: TestTabsProps) {
  const [activeTab, setActiveTab] = useState("joint");

  // Prepare data based on year selection
  const getYearData = (metric: string) => {
    if (year === "2025") return athlete[`${metric}_2025`] ?? 0;
    if (year === "2026") return athlete[`${metric}_2026`] ?? 0;
    return athlete[`${metric}_2025`] ?? 0;
  };

  // Joint ROM Data
  const jointRomData = [
    {
      name: "L Hip ROM",
      "2025": athlete.JRF_L_Hip_Total_ROM_2025 ?? 0,
      "2026": athlete.JRF_L_Hip_Total_ROM_2026 ?? 0,
      normative: 90,
    },
    {
      name: "R Hip ROM",
      "2025": athlete.JRF_R_Hip_Total_ROM_2025 ?? 0,
      "2026": athlete.JRF_R_Hip_Total_ROM_2026 ?? 0,
      normative: 90,
    },
  ];

  const forwardReachData = [
    {
      name: "Forward Reach",
      "2025": athlete.JRF_Forward_Reaching_Test_2025 ?? 0,
      "2026": athlete.JRF_Forward_Reaching_Test_2026 ?? 0,
      normative: 29,
    },
  ];

  // Isometric Strength Data
  const isometricData = [
    {
      name: "LH Flexors",
      "2025": athlete.IST_LH_Flexors_2025 ?? 0,
      "2026": athlete.IST_LH_Flexors_2026 ?? 0,
      normative: 200,
    },
    {
      name: "RH Flexors",
      "2025": athlete.IST_RH_Flexors_2025 ?? 0,
      "2026": athlete.IST_RH_Flexors_2026 ?? 0,
      normative: 200,
    },
    {
      name: "LH Extensors",
      "2025": athlete.IST_LH_Extensors_2025 ?? 0,
      "2026": athlete.IST_LH_Extensors_2026 ?? 0,
      normative: 200,
    },
    {
      name: "RH Extensors",
      "2025": athlete.IST_RH_Extensors_2025 ?? 0,
      "2026": athlete.IST_RH_Extensors_2026 ?? 0,
      normative: 200,
    },
    {
      name: "LH Adductors",
      "2025": athlete.IST_LH_Adductors_2025 ?? 0,
      "2026": athlete.IST_LH_Adductors_2026 ?? 0,
      normative: 200,
    },
    {
      name: "RH Adductors",
      "2025": athlete.IST_RH_Adductors_2025 ?? 0,
      "2026": athlete.IST_RH_Adductors_2026 ?? 0,
      normative: 200,
    },
    {
      name: "LH Abductors",
      "2025": athlete.IST_LH_Abductors_2025 ?? 0,
      "2026": athlete.IST_LH_Abductors_2026 ?? 0,
      normative: 200,
    },
    {
      name: "RH Abductors",
      "2025": athlete.IST_RH_Abductors_2025 ?? 0,
      "2026": athlete.IST_RH_Abductors_2026 ?? 0,
      normative: 200,
    },
    {
      name: "LA Plantarflexors",
      "2025": athlete.IST_LA_Plantarflexors_2025 ?? 0,
      "2026": athlete.IST_LA_Plantarflexors_2026 ?? 0,
      normative: 600,
    },
    {
      name: "RA Plantarflexors",
      "2025": athlete.IST_RA_Plantarflexors_2025 ?? 0,
      "2026": athlete.IST_RA_Plantarflexors_2026 ?? 0,
      normative: 600,
    },
  ];

  const ratioData = [
    {
      name: "LH Add/Abd Ratio",
      "2025": athlete.IST_LH_Add_Abd_Ratio_2025 ?? 0,
      "2026": athlete.IST_LH_Add_Abd_Ratio_2026 ?? 0,
      normative: 1,
    },
    {
      name: "RH Add/Abd Ratio",
      "2025": athlete.IST_RH_Add_Abd_Ratio_2025 ?? 0,
      "2026": athlete.IST_RH_Add_Abd_Ratio_2026 ?? 0,
      normative: 1,
    },
  ];

  // FMS Data
  const fmsScore = athlete.FMS_Total_Score_2026 ?? 0;
  const fmsScore2025 = athlete.FMS_Total_Score_2025 ?? 0;

  // Trunk Endurance Data
  const trunkData = [
    {
      name: "Flexors",
      "2025": athlete.TME_Flexors_2025 ?? 0,
      "2026": athlete.TME_Flexors_2026 ?? 0,
      normative: 240,
    },
    {
      name: "Extensors",
      "2025": athlete.TME_Extensors_2025 ?? 0,
      "2026": athlete.TME_Extensors_2026 ?? 0,
      normative: 180,
    },
    {
      name: "Left Lateral",
      "2025": athlete.TME_Left_Lateral_2025 ?? 0,
      "2026": athlete.TME_Left_Lateral_2026 ?? 0,
      normative: 120,
    },
    {
      name: "Right Lateral",
      "2025": athlete.TME_Right_Lateral_2025 ?? 0,
      "2026": athlete.TME_Right_Lateral_2026 ?? 0,
      normative: 120,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab("joint")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === "joint"
              ? "bg-blue-500 text-white"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          🦵 Joint ROM & Flexibility
        </button>
        <button
          onClick={() => setActiveTab("isometric")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === "isometric"
              ? "bg-orange-500 text-white"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          💪 Isometric Strength
        </button>
        <button
          onClick={() => setActiveTab("fms")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === "fms"
              ? "bg-green-500 text-white"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          🏃 Functional Movement
        </button>
        <button
          onClick={() => setActiveTab("trunk")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            activeTab === "trunk"
              ? "bg-teal-500 text-white"
              : "bg-slate-200 text-slate-700 hover:bg-slate-300"
          }`}
        >
          🧘 Trunk Endurance
        </button>
      </div>

      {/* Joint ROM & Flexibility Tab */}
      {activeTab === "joint" && (
        <div className="space-y-6">
          {/* Hip ROM Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Hip Range of Motion (Degrees)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jointRomData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceLine y={90} stroke="#ef4444" strokeDasharray="5 5" label="Normative (90°)" />
                <Bar dataKey="2025" fill="#4f46e5" />
                <Bar dataKey="2026" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {jointRomData.map((item, idx) => (
                <MetricCard
                  key={idx}
                  label={item.name}
                  value2025={item["2025"]}
                  value2026={item["2026"]}
                  unit="°"
                  normative={item.normative}
                />
              ))}
            </div>
          </div>

          {/* Forward Reaching Test */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Forward Reaching Test (cm)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={forwardReachData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <ReferenceLine y={29} stroke="#ef4444" strokeDasharray="5 5" label="Normative (29cm)" />
                <Bar dataKey="2025" fill="#4f46e5" />
                <Bar dataKey="2026" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 gap-4 mt-4">
              {forwardReachData.map((item, idx) => (
                <MetricCard
                  key={idx}
                  label={item.name}
                  value2025={item["2025"]}
                  value2026={item["2026"]}
                  unit="cm"
                  normative={item.normative}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Isometric Strength Tab */}
      {activeTab === "isometric" && (
        <div className="space-y-6">
          {/* Horizontal Bar Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Isometric Strength (N)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={isometricData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={140} />
                <Tooltip />
                <Legend />
                <Bar dataKey="2025" fill="#4f46e5" />
                <Bar dataKey="2026" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {isometricData.map((item, idx) => (
                <MetricCard
                  key={idx}
                  label={item.name}
                  value2025={item["2025"]}
                  value2026={item["2026"]}
                  unit="N"
                  normative={item.normative}
                />
              ))}
            </div>
          </div>

          {/* Add/Abd Ratios - Side by Side Dumbbells */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Add/Abd Ratios (Balance - 2025 vs 2026)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ratioData.map((item, idx) => {
                const { change, percent } = calculateChange(item["2025"], item["2026"]);
                const isBalanced = Math.abs(item["2026"] - item.normative) < 0.2;
                const maxValue = Math.max(item["2025"], item["2026"], item.normative) * 1.2;
                const scale = 100 / maxValue;
                const pos2025 = item["2025"] * scale;
                const pos2026 = item["2026"] * scale;
                const posNorm = item.normative * scale;

                const isLeft = idx === 0;
                const colors = isLeft
                  ? { primary: "indigo", secondary: "cyan" }
                  : { primary: "orange", secondary: "amber" };

                return (
                  <div key={idx} className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-4 text-center">{item.name}</h4>

                    {/* Dumbbell Chart */}
                    <div className="relative h-16 bg-white rounded-lg p-3 border border-slate-300 mb-3">
                      {/* Normative Reference Line */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-400"
                        style={{ left: `${posNorm}%` }}
                        title={`Normative: ${item.normative}`}
                      />

                      {/* Dumbbell Connector Line */}
                      <div className="absolute top-1/2 transform -translate-y-1/2 w-full">
                        <div
                          className={`absolute h-1.5 bg-gradient-to-r from-${colors.primary}-400 to-${colors.secondary}-400 top-1/2 transform -translate-y-1/2 rounded-full`}
                          style={{
                            left: `${Math.min(pos2025, pos2026)}%`,
                            width: `${Math.abs(pos2026 - pos2025)}%`,
                            backgroundColor: isLeft ? "#818cf8" : "#fb923c",
                          }}
                        />

                        {/* 2025 Circle */}
                        <div
                          className={`absolute w-5 h-5 rounded-full border-3 shadow-lg transform -translate-x-1/2 -translate-y-1/2 top-1/2`}
                          style={{
                            left: `${pos2025}%`,
                            backgroundColor: isLeft ? "#6366f1" : "#ea580c",
                            borderColor: isLeft ? "#4f46e5" : "#c2410c",
                          }}
                        />

                        {/* 2026 Circle */}
                        <div
                          className={`absolute w-5 h-5 rounded-full border-3 shadow-lg transform -translate-x-1/2 -translate-y-1/2 top-1/2`}
                          style={{
                            left: `${pos2026}%`,
                            backgroundColor: isLeft ? "#06b6d4" : "#f59e0b",
                            borderColor: isLeft ? "#0891b2" : "#d97706",
                          }}
                        />
                      </div>
                    </div>

                    {/* Legend and Status */}
                    <div className="flex justify-between items-center mt-3 text-xs">
                      <div className="flex gap-3">
                        <div className="flex items-center gap-1">
                          <div
                            className="w-3 h-3 rounded-full border border-slate-600"
                            style={{ backgroundColor: isLeft ? "#6366f1" : "#ea580c" }}
                          ></div>
                          <span className="text-slate-700">2025: <span className="font-semibold">{item["2025"].toFixed(2)}</span></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div
                            className="w-3 h-3 rounded-full border border-slate-600"
                            style={{ backgroundColor: isLeft ? "#06b6d4" : "#f59e0b" }}
                          ></div>
                          <span className="text-slate-700">2026: <span className="font-semibold">{item["2026"].toFixed(2)}</span></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1 h-3 bg-red-400"></div>
                          <span className="text-slate-700">Norm: <span className="font-semibold">{item.normative}</span></span>
                        </div>
                      </div>
                      <p className={`font-semibold ${parseFloat(change) >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {parseFloat(change) >= 0 ? "+" : ""}{parseFloat(change).toFixed(2)}
                      </p>
                    </div>
                    <p className={`text-xs mt-2 font-semibold text-center ${isBalanced ? "text-green-600" : "text-orange-600"}`}>
                      {isBalanced ? "✓ Balanced" : "⚠ Imbalanced"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Functional Movement Tab */}
      {activeTab === "fms" && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Functional Movement Screen (FMS)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 2025 Score Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200 text-center">
              <p className="text-sm font-semibold text-indigo-700 mb-2">2025 Score</p>
              <p className="text-4xl font-bold text-indigo-600 mb-1">{fmsScore2025}</p>
              <p className="text-xs text-indigo-600">/21</p>
              <p className={`text-xs font-semibold mt-2 ${fmsScore2025 >= 18 ? "text-green-600" : fmsScore2025 >= 14 ? "text-yellow-600" : "text-red-600"}`}>
                {fmsScore2025 >= 18 ? "✓ Good" : fmsScore2025 >= 14 ? "⚠ Moderate" : "✗ Poor"}
              </p>
            </div>

            {/* 2026 Score Card */}
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-lg border border-cyan-200 text-center">
              <p className="text-sm font-semibold text-cyan-700 mb-2">2026 Score</p>
              <p className="text-4xl font-bold text-cyan-600 mb-1">{fmsScore}</p>
              <p className="text-xs text-cyan-600">/21</p>
              <p className={`text-xs font-semibold mt-2 ${fmsScore >= 18 ? "text-green-600" : fmsScore >= 14 ? "text-yellow-600" : "text-red-600"}`}>
                {fmsScore >= 18 ? "✓ Good" : fmsScore >= 14 ? "⚠ Moderate" : "✗ Poor"}
              </p>
            </div>

            {/* Change Card */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-lg border border-slate-200 text-center">
              <p className="text-sm font-semibold text-slate-700 mb-2">Change</p>
              <p className={`text-4xl font-bold mb-1 ${fmsScore - fmsScore2025 >= 0 ? "text-green-600" : "text-red-600"}`}>
                {fmsScore - fmsScore2025 >= 0 ? "+" : ""}{fmsScore - fmsScore2025}
              </p>
              <p className={`text-xs font-semibold ${fmsScore - fmsScore2025 >= 0 ? "text-green-600" : "text-red-600"}`}>
                {fmsScore - fmsScore2025 >= 0 ? "Improvement" : "Decline"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trunk Endurance Tab */}
      {activeTab === "trunk" && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Trunk Muscle Endurance (seconds)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={trunkData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={90} />
                <Tooltip />
                <Legend />
                <ReferenceLine x={240} stroke="#ef4444" strokeDasharray="5 5" label="Norm" />
                <Bar dataKey="2025" fill="#4f46e5" />
                <Bar dataKey="2026" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {trunkData.map((item, idx) => (
                <MetricCard
                  key={idx}
                  label={item.name}
                  value2025={item["2025"]}
                  value2026={item["2026"]}
                  unit="sec"
                  normative={item.normative}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
