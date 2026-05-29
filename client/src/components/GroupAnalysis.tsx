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
  const currentGroup = groups[selectedGroup];

  // Get athletes in selected group
  const groupAthletes = athletes.filter(a => a.group === currentGroup.group && a.gender === currentGroup.gender);

  // Prepare data for charts - combining same units
  const prepareGroupData = () => {
    return groupAthletes.map(a => {
      const data2025 = a.data["2025"];
      const data2026 = a.data["2026"];
      return {
        name: a.name, // Full name for display
        fullName: a.name,
        // Joint ROM (angles) - both years
        lHipROM2025: data2025.jointROM.hipTotalRomL,
        lHipROM2026: data2026.jointROM.hipTotalRomL,
        rHipROM2025: data2025.jointROM.hipTotalRomR,
        rHipROM2026: data2026.jointROM.hipTotalRomR,
        // Forward Reach (cm) - both years
        forwardReach2025: data2025.jointROM.forwardReachingTest,
        forwardReach2026: data2026.jointROM.forwardReachingTest,
        // Isometric Strength (N) - Flexors & Extensors both years
        lhFlexors2025: data2025.isometricStrength.lhFlexors,
        rhFlexors2025: data2025.isometricStrength.rhFlexors,
        lhFlexors2026: data2026.isometricStrength.lhFlexors,
        rhFlexors2026: data2026.isometricStrength.rhFlexors,
        lhExtensors2025: data2025.isometricStrength.lhExtensors,
        rhExtensors2025: data2025.isometricStrength.rhExtensors,
        lhExtensors2026: data2026.isometricStrength.lhExtensors,
        rhExtensors2026: data2026.isometricStrength.rhExtensors,
        // Isometric Strength - Adductors (both years)
        lhAdductors2025: data2025.isometricStrength.lhAdductors,
        rhAdductors2025: data2025.isometricStrength.rhAdductors,
        lhAdductors2026: data2026.isometricStrength.lhAdductors,
        rhAdductors2026: data2026.isometricStrength.rhAdductors,
        // Isometric Strength - Abductors (both years)
        lhAbductors2025: data2025.isometricStrength.lhAbductors,
        rhAbductors2025: data2025.isometricStrength.rhAbductors,
        lhAbductors2026: data2026.isometricStrength.lhAbductors,
        rhAbductors2026: data2026.isometricStrength.rhAbductors,
        // Isometric Strength - Plantarflexors (both years)
        laPlantarflexors2025: data2025.isometricStrength.laPlantarflexors,
        raPlantarflexors2025: data2025.isometricStrength.raPlantarflexors,
        laPlantarflexors2026: data2026.isometricStrength.laPlantarflexors,
        raPlantarflexors2026: data2026.isometricStrength.raPlantarflexors,
        // Add/Abd Ratios (both years)
        lhAddAbdRatio2025: data2025.isometricStrength.lhAddAbdRatio,
        rhAddAbdRatio2025: data2025.isometricStrength.rhAddAbdRatio,
        lhAddAbdRatio2026: data2026.isometricStrength.lhAddAbdRatio,
        rhAddAbdRatio2026: data2026.isometricStrength.rhAddAbdRatio,
        // Trunk Endurance (seconds) - both years
        flexors2025: data2025.trunkEndurance.flexors,
        extensors2025: data2025.trunkEndurance.extensors,
        leftLateral2025: data2025.trunkEndurance.leftLateral,
        rightLateral2025: data2025.trunkEndurance.rightLateral,
        flexors2026: data2026.trunkEndurance.flexors,
        extensors2026: data2026.trunkEndurance.extensors,
        leftLateral2026: data2026.trunkEndurance.leftLateral,
        rightLateral2026: data2026.trunkEndurance.rightLateral,
        // FMS - both years
        fms2025: data2025.functionalMovement.totalScore,
        fms2026: data2026.functionalMovement.totalScore,
        // Y-Balance Test - All metrics for both years
        // Anterior
        ybalanceAnteriorLeft2025: a.data.yBalance?.["2025"]?.anterior ?? null,
        ybalanceAnteriorRight2025: a.data.yBalance?.["2025"]?.rightAnterior ?? null,
        ybalanceAnteriorLeft2026: a.data.yBalance?.["2026"]?.anterior ?? null,
        ybalanceAnteriorRight2026: a.data.yBalance?.["2026"]?.rightAnterior ?? null,
        ybalanceAnteriorDisbalance2025: a.data.yBalance?.["2025"]?.anteriorDisbalance ?? null,
        ybalanceAnteriorDisbalance2026: a.data.yBalance?.["2026"]?.anteriorDisbalance ?? null,
        // Medial
        ybalanceMedialLeft2025: a.data.yBalance?.["2025"]?.medial ?? null,
        ybalanceMedialRight2025: a.data.yBalance?.["2025"]?.rightMedial ?? null,
        ybalanceMedialLeft2026: a.data.yBalance?.["2026"]?.medial ?? null,
        ybalanceMedialRight2026: a.data.yBalance?.["2026"]?.rightMedial ?? null,
        ybalanceMedialDisbalance2025: a.data.yBalance?.["2025"]?.medialDisbalance ?? null,
        ybalanceMedialDisbalance2026: a.data.yBalance?.["2026"]?.medialDisbalance ?? null,
        // Lateral
        ybalanceLateralLeft2025: a.data.yBalance?.["2025"]?.lateral ?? null,
        ybalanceLateralRight2025: a.data.yBalance?.["2025"]?.rightLateral ?? null,
        ybalanceLateralLeft2026: a.data.yBalance?.["2026"]?.lateral ?? null,
        ybalanceLateralRight2026: a.data.yBalance?.["2026"]?.rightLateral ?? null,
        ybalanceLateralDisbalance2025: a.data.yBalance?.["2025"]?.lateralDisbalance ?? null,
        ybalanceLateralDisbalance2026: a.data.yBalance?.["2026"]?.lateralDisbalance ?? null,
        // Composite
        ybalanceCompositeLeft2025: a.data.yBalance?.["2025"]?.leftComposite ?? null,
        ybalanceCompositeRight2025: a.data.yBalance?.["2025"]?.rightComposite ?? null,
        ybalanceCompositeLeft2026: a.data.yBalance?.["2026"]?.leftComposite ?? null,
        ybalanceCompositeRight2026: a.data.yBalance?.["2026"]?.rightComposite ?? null,
        ybalanceCompositeDisbalance2025: a.data.yBalance?.["2025"]?.compositeDisbalance ?? null,
        ybalanceCompositeDisbalance2026: a.data.yBalance?.["2026"]?.compositeDisbalance ?? null,
      };
    });
  };

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
        {/* Hip ROM - Line Chart with 4 Lines (L/R 2025 & 2026) */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Hip Range of Motion (Degrees) - 4 Lines</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 11 }}
              />
              <YAxis label={{ value: "°", angle: -90, position: "insideLeft" }} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value.toFixed(1)} />
              <Legend />
              <Line type="monotone" dataKey="lHipROM2025" stroke="#6366f1" strokeDasharray="0" name="L Hip ROM 2025" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="lHipROM2026" stroke="#6366f1" strokeDasharray="5 5" name="L Hip ROM 2026" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="rHipROM2025" stroke="#0ea5e9" strokeDasharray="0" name="R Hip ROM 2025" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="rHipROM2026" stroke="#0ea5e9" strokeDasharray="5 5" name="R Hip ROM 2026" strokeWidth={2} dot={{ r: 4 }} />
              <ReferenceLine y={NORMATIVE_VALUES.hipROM} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Normative (90°)", position: "right", fill: "#64748b", fontSize: 11 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>



        {/* Forward Reach - Line Chart with Both Years */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Forward Reaching Test (cm)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 11 }}
              />
              <YAxis label={{ value: "cm", angle: -90, position: "insideLeft" }} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value.toFixed(1)} />
              <Legend />
              <Line type="monotone" dataKey="forwardReach2025" stroke="#3b82f6" name="2025" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="forwardReach2026" stroke="#f97316" name="2026" strokeWidth={2} dot={{ r: 4 }} />
              <ReferenceLine y={NORMATIVE_VALUES.forwardReach} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Normative (29cm)", position: "right", fill: "#64748b", fontSize: 11 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Isometric Strength - Comprehensive Table */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Isometric Strength - All Metrics (N)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-300">
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Athlete</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-700">Adductors L</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-700">Adductors R</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-700">Abductors L</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-700">Abductors R</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-700">Flexors L</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-700">Flexors R</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-700">Extensors L</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-700">Extensors R</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-700">Plantarflexors L</th>
                  <th className="px-3 py-2 text-center font-semibold text-slate-700">Plantarflexors R</th>
                </tr>
              </thead>
              <tbody>
                {groupData.map((athlete, idx) => {
                  const renderCell = (val2025: number | null, val2026: number | null) => {
                    if (!val2025 || !val2026) return <td className="px-3 py-2 text-center text-slate-400">-</td>;
                    const change = val2026 - val2025;
                    const changePercent = ((change / val2025) * 100).toFixed(1);
                    const isIncrease = change > 0;
                    return (
                      <td className="px-3 py-2 text-center">
                        <div className="text-xs">
                          <div className="font-semibold">{val2026.toFixed(0)}</div>
                          <div className={`text-xs font-bold ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                            {isIncrease ? '↑' : '↓'} {Math.abs(parseFloat(changePercent))}%
                          </div>
                        </div>
                      </td>
                    );
                  };
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td className="px-3 py-2 font-semibold text-slate-700">{athlete.name}</td>
                      {renderCell(athlete.lhAdductors2025, athlete.lhAdductors2026)}
                      {renderCell(athlete.rhAdductors2025, athlete.rhAdductors2026)}
                      {renderCell(athlete.lhAbductors2025, athlete.lhAbductors2026)}
                      {renderCell(athlete.rhAbductors2025, athlete.rhAbductors2026)}
                      {renderCell(athlete.lhFlexors2025, athlete.lhFlexors2026)}
                      {renderCell(athlete.rhFlexors2025, athlete.rhFlexors2026)}
                      {renderCell(athlete.lhExtensors2025, athlete.lhExtensors2026)}
                      {renderCell(athlete.rhExtensors2025, athlete.rhExtensors2026)}
                      {renderCell(athlete.laPlantarflexors2025, athlete.laPlantarflexors2026)}
                      {renderCell(athlete.raPlantarflexors2025, athlete.raPlantarflexors2026)}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-3">↑ = Improvement | ↓ = Decline | Values show 2026 data with % change from 2025</p>
        </div>

        {/* Add/Abd Ratios - Two Side-by-Side Horizontal Dumbbell Charts (2025 vs 2026) */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Add/Abd Ratios - Horizontal Dumbbell Chart</h3>
          <div className="grid grid-cols-2 gap-6">
            {/* 2025 Chart */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 text-center">2025</h4>
              <ResponsiveContainer width="100%" height={Math.max(300, groupData.length * 40)}>
                <ScatterChart margin={{ top: 20, right: 30, left: 120, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    type="number" 
                    dataKey="ratio" 
                    name="Ratio Value"
                    domain={[0.6, 1.5]}
                    label={{ value: "Ratio Value", position: "insideBottomRight", offset: -10 }}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    name="Athlete"
                    width={110}
                    tick={{ fontSize: 10 }}
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
                            <p className="text-slate-600">{data.side}: {data.ratio.toFixed(2)}</p>
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
                  <Scatter 
                    name="Left Leg" 
                    data={groupData.map((a, idx) => ({ 
                      name: a.name, 
                      ratio: a.lhAddAbdRatio2025, 
                      side: "LH",
                      y: idx 
                    }))} 
                    fill="#6366f1" 
                    shape="circle"
                  />
                  <Scatter 
                    name="Right Leg" 
                    data={groupData.map((a, idx) => ({ 
                      name: a.name, 
                      ratio: a.rhAddAbdRatio2025, 
                      side: "RH",
                      y: idx 
                    }))} 
                    fill="#f97316" 
                    shape="circle"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            {/* 2026 Chart */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 text-center">2026</h4>
              <ResponsiveContainer width="100%" height={Math.max(300, groupData.length * 40)}>
                <ScatterChart margin={{ top: 20, right: 30, left: 120, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    type="number" 
                    dataKey="ratio" 
                    name="Ratio Value"
                    domain={[0.6, 1.5]}
                    label={{ value: "Ratio Value", position: "insideBottomRight", offset: -10 }}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    name="Athlete"
                    width={110}
                    tick={{ fontSize: 10 }}
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
                            <p className="text-slate-600">{data.side}: {data.ratio.toFixed(2)}</p>
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
                  <Scatter 
                    name="Left Leg" 
                    data={groupData.map((a, idx) => ({ 
                      name: a.name, 
                      ratio: a.lhAddAbdRatio2026, 
                      side: "LH",
                      y: idx 
                    }))} 
                    fill="#6366f1" 
                    shape="circle"
                  />
                  <Scatter 
                    name="Right Leg" 
                    data={groupData.map((a, idx) => ({ 
                      name: a.name, 
                      ratio: a.rhAddAbdRatio2026, 
                      side: "RH",
                      y: idx 
                    }))} 
                    fill="#f97316" 
                    shape="circle"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Trunk Endurance - Side by Side 2025 vs 2026 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Trunk Endurance (seconds)</h3>
          <div className="grid grid-cols-2 gap-6">
            {/* 2025 Chart */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 text-center">2025</h4>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={groupData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" label={{ value: "sec", position: "insideBottomRight", offset: -10 }} tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value.toFixed(1)} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="flexors2025" fill="#6366f1" name="Flexors" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="extensors2025" fill="#10b981" name="Extensors" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="leftLateral2025" fill="#f59e0b" name="Left Lateral" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="rightLateral2025" fill="#ec4899" name="Right Lateral" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* 2026 Chart */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 text-center">2026</h4>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={groupData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" label={{ value: "sec", position: "insideBottomRight", offset: -10 }} tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 9 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value.toFixed(1)} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="flexors2026" fill="#6366f1" name="Flexors" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="extensors2026" fill="#10b981" name="Extensors" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="leftLateral2026" fill="#f59e0b" name="Left Lateral" radius={[0, 8, 8, 0]} />
                  <Bar dataKey="rightLateral2026" fill="#ec4899" name="Right Lateral" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* FMS Scores - Composed Chart with both years */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Functional Movement Screen (out of 21) - 2025 vs 2026</h3>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 11 }}
              />
              <YAxis domain={[0, 21]} label={{ value: "Score", angle: -90, position: "insideLeft" }} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value.toFixed(0)} />
              <Legend />
              <Bar dataKey="fms2025" fill="#6366f1" name="FMS 2025" radius={[8, 8, 0, 0]} />
              <Bar dataKey="fms2026" fill="#f97316" name="FMS 2026" radius={[8, 8, 0, 0]} />
              <ReferenceLine y={14} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "Poor (14)", position: "right", fill: "#dc2626", fontSize: 10 }} />
              <ReferenceLine y={18} stroke="#eab308" strokeDasharray="5 5" label={{ value: "Good (18)", position: "right", fill: "#b45309", fontSize: 10 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Y-Balance Test - Anterior Direction */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Y-Balance Test - Anterior Direction</h3>
          <p className="text-xs text-slate-500 mb-4">Individual athlete reach percentages (higher is better, ≥94% is normative) - 2025 vs 2026</p>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 10 }} />
              <YAxis domain={[60, 140]} label={{ value: "%", angle: -90, position: "insideLeft" }} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
              <Legend />
              <Bar dataKey="ybalanceAnteriorLeft2025" fill="#6366f1" name="Anterior 2025" radius={[8, 8, 0, 0]} />
              <Bar dataKey="ybalanceAnteriorLeft2026" fill="#f97316" name="Anterior 2026" radius={[8, 8, 0, 0]} />
              <ReferenceLine y={94} stroke="#10b981" strokeDasharray="5 5" label={{ value: "Norm (94%)", position: "right", fill: "#059669", fontSize: 9 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Y-Balance Test - Medial Direction */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Y-Balance Test - Medial Direction</h3>
          <p className="text-xs text-slate-500 mb-4">Individual athlete reach percentages (higher is better, ≥94% is normative) - 2025 vs 2026</p>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 10 }} />
              <YAxis domain={[60, 140]} label={{ value: "%", angle: -90, position: "insideLeft" }} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
              <Legend />
              <Bar dataKey="ybalanceMedialLeft2025" fill="#8b5cf6" name="Medial 2025" radius={[8, 8, 0, 0]} />
              <Bar dataKey="ybalanceMedialLeft2026" fill="#ec4899" name="Medial 2026" radius={[8, 8, 0, 0]} />
              <ReferenceLine y={94} stroke="#10b981" strokeDasharray="5 5" label={{ value: "Norm (94%)", position: "right", fill: "#059669", fontSize: 9 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Y-Balance Test - Lateral Direction */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Y-Balance Test - Lateral Direction</h3>
          <p className="text-xs text-slate-500 mb-4">Individual athlete reach percentages (higher is better, ≥94% is normative) - 2025 vs 2026</p>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 10 }} />
              <YAxis domain={[60, 140]} label={{ value: "%", angle: -90, position: "insideLeft" }} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
              <Legend />
              <Bar dataKey="ybalanceLateralLeft2025" fill="#14b8a6" name="Lateral 2025" radius={[8, 8, 0, 0]} />
              <Bar dataKey="ybalanceLateralLeft2026" fill="#f59e0b" name="Lateral 2026" radius={[8, 8, 0, 0]} />
              <ReferenceLine y={94} stroke="#10b981" strokeDasharray="5 5" label={{ value: "Norm (94%)", position: "right", fill: "#059669", fontSize: 9 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Y-Balance Test - Composite Score */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Y-Balance Test - Composite Score</h3>
          <p className="text-xs text-slate-500 mb-4">Individual athlete composite reach percentages (higher is better, ≥94% is normative) - 2025 vs 2026</p>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 10 }} />
              <YAxis domain={[60, 140]} label={{ value: "%", angle: -90, position: "insideLeft" }} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
              <Legend />
              <Bar dataKey="ybalanceCompositeLeft2025" fill="#06b6d4" name="Composite 2025" radius={[8, 8, 0, 0]} />
              <Bar dataKey="ybalanceCompositeLeft2026" fill="#d946ef" name="Composite 2026" radius={[8, 8, 0, 0]} />
              <ReferenceLine y={94} stroke="#10b981" strokeDasharray="5 5" label={{ value: "Norm (94%)", position: "right", fill: "#059669", fontSize: 9 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Y-Balance Disbalance - 2025 vs 2026 Comparison */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Y-Balance Test - Disbalance Index</h3>
          <p className="text-xs text-slate-500 mb-4">Individual athlete disbalance percentages by direction (lower is better, &lt;4% is balanced)</p>
          <div className="grid grid-cols-2 gap-4">
            {/* Anterior Disbalance - 2025 vs 2026 */}
            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-2 text-center">Anterior</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={groupData} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 8 }} />
                  <YAxis domain={[0, 10]} type="number" tick={{ fontSize: 8 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
                  <Bar dataKey="ybalanceAnteriorDisbalance2025" fill="#6366f1" name="2025" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ybalanceAnteriorDisbalance2026" fill="#f97316" name="2026" radius={[4, 4, 0, 0]} />
                  <Legend />
                  <ReferenceLine y={4} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "4%", position: "top", fill: "#dc2626", fontSize: 8 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Medial Disbalance - 2025 vs 2026 */}
            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-2 text-center">Medial</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={groupData} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 8 }} />
                  <YAxis domain={[0, 10]} type="number" tick={{ fontSize: 8 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
                  <Bar dataKey="ybalanceMedialDisbalance2025" fill="#8b5cf6" name="2025" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ybalanceMedialDisbalance2026" fill="#ec4899" name="2026" radius={[4, 4, 0, 0]} />
                  <Legend />
                  <ReferenceLine y={4} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "4%", position: "top", fill: "#dc2626", fontSize: 8 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Lateral Disbalance - 2025 vs 2026 */}
            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-2 text-center">Lateral</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={groupData} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 8 }} />
                  <YAxis domain={[0, 10]} type="number" tick={{ fontSize: 8 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
                  <Bar dataKey="ybalanceLateralDisbalance2025" fill="#14b8a6" name="2025" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ybalanceLateralDisbalance2026" fill="#f59e0b" name="2026" radius={[4, 4, 0, 0]} />
                  <Legend />
                  <ReferenceLine y={4} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "4%", position: "top", fill: "#dc2626", fontSize: 8 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Composite Disbalance - 2025 vs 2026 */}
            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-2 text-center">Composite</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={groupData} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 8 }} />
                  <YAxis domain={[0, 10]} type="number" tick={{ fontSize: 8 }} />
                  <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
                  <Bar dataKey="ybalanceCompositeDisbalance2025" fill="#06b6d4" name="2025" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ybalanceCompositeDisbalance2026" fill="#d946ef" name="2026" radius={[4, 4, 0, 0]} />
                  <Legend />
                  <ReferenceLine y={4} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "4%", position: "top", fill: "#dc2626", fontSize: 8 }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Isokinetic Knee Test - Comprehensive Table */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Isokinetic Knee Test - Peak Torque (ft-lb)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-300">
                  <th className="px-2 py-2 text-left font-semibold text-slate-700">Athlete</th>
                  <th colSpan={4} className="px-2 py-2 text-center font-semibold text-slate-700 border-l border-slate-300">60°/s</th>
                  <th colSpan={4} className="px-2 py-2 text-center font-semibold text-slate-700 border-l border-slate-300">180°/s</th>
                  <th colSpan={4} className="px-2 py-2 text-center font-semibold text-slate-700 border-l border-slate-300">240°/s</th>
                </tr>
                <tr className="bg-slate-50 border-b border-slate-300">
                  <th className="px-2 py-1 text-left font-semibold text-slate-600"></th>
                  <th className="px-2 py-1 text-center font-semibold text-slate-600">L Ext</th>
                  <th className="px-2 py-1 text-center font-semibold text-slate-600">R Ext</th>
                  <th className="px-2 py-1 text-center font-semibold text-slate-600">L Flx</th>
                  <th className="px-2 py-1 text-center font-semibold text-slate-600 border-l border-slate-300">R Flx</th>
                  <th className="px-2 py-1 text-center font-semibold text-slate-600">L Ext</th>
                  <th className="px-2 py-1 text-center font-semibold text-slate-600">R Ext</th>
                  <th className="px-2 py-1 text-center font-semibold text-slate-600">L Flx</th>
                  <th className="px-2 py-1 text-center font-semibold text-slate-600 border-l border-slate-300">R Flx</th>
                  <th className="px-2 py-1 text-center font-semibold text-slate-600">L Ext</th>
                  <th className="px-2 py-1 text-center font-semibold text-slate-600">R Ext</th>
                  <th className="px-2 py-1 text-center font-semibold text-slate-600">L Flx</th>
                  <th className="px-2 py-1 text-center font-semibold text-slate-600 border-l border-slate-300">R Flx</th>
                </tr>
              </thead>
              <tbody>
                {groupAthletes.map((athlete, idx) => {
                  const renderCell = (val2025: number | undefined, val2026: number | undefined) => {
                    if (!val2025 || !val2026) return <td className="px-2 py-1 text-center text-slate-400 text-xs">-</td>;
                    const change = val2026 - val2025;
                    const changePercent = ((change / val2025) * 100).toFixed(1);
                    const isIncrease = change > 0;
                    return (
                      <td className="px-2 py-1 text-center text-xs">
                        <div className="font-semibold">{val2026.toFixed(0)}</div>
                        <div className={`text-xs font-bold ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                          {isIncrease ? '↑' : '↓'} {Math.abs(parseFloat(changePercent))}%
                        </div>
                      </td>
                    );
                  };
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td className="px-2 py-1 font-semibold text-slate-700 text-xs">{athlete.name}</td>
                      {/* 60°/s */}
                      {renderCell(athlete.isokinetic?.['2025']?.speed60?.lExtensors, athlete.isokinetic?.['2026']?.speed60?.lExtensors)}
                      {renderCell(athlete.isokinetic?.['2025']?.speed60?.rExtensors, athlete.isokinetic?.['2026']?.speed60?.rExtensors)}
                      {renderCell(athlete.isokinetic?.['2025']?.speed60?.lFlexors, athlete.isokinetic?.['2026']?.speed60?.lFlexors)}
                      {renderCell(athlete.isokinetic?.['2025']?.speed60?.rFlexors, athlete.isokinetic?.['2026']?.speed60?.rFlexors)}
                      {/* 180°/s */}
                      {renderCell(athlete.isokinetic?.['2025']?.speed180?.lExtensors, athlete.isokinetic?.['2026']?.speed180?.lExtensors)}
                      {renderCell(athlete.isokinetic?.['2025']?.speed180?.rExtensors, athlete.isokinetic?.['2026']?.speed180?.rExtensors)}
                      {renderCell(athlete.isokinetic?.['2025']?.speed180?.lFlexors, athlete.isokinetic?.['2026']?.speed180?.lFlexors)}
                      {renderCell(athlete.isokinetic?.['2025']?.speed180?.rFlexors, athlete.isokinetic?.['2026']?.speed180?.rFlexors)}
                      {/* 240°/s */}
                      {renderCell(athlete.isokinetic?.['2025']?.speed240?.lExtensors, athlete.isokinetic?.['2026']?.speed240?.lExtensors)}
                      {renderCell(athlete.isokinetic?.['2025']?.speed240?.rExtensors, athlete.isokinetic?.['2026']?.speed240?.rExtensors)}
                      {renderCell(athlete.isokinetic?.['2025']?.speed240?.lFlexors, athlete.isokinetic?.['2026']?.speed240?.lFlexors)}
                      {renderCell(athlete.isokinetic?.['2025']?.speed240?.rFlexors, athlete.isokinetic?.['2026']?.speed240?.rFlexors)}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-3">↑ = Improvement | ↓ = Decline | L=Left, R=Right | Ext=Extensors, Flx=Flexors | Values show 2026 data with % change from 2025</p>
          
          {/* Grid of scatter plots - 2 per row */}
          <div className="grid grid-cols-2 gap-6" style={{display: 'none'}}>
            {/* 2025 Scatter Plot */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 text-center">2025 Data</h4>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 10, right: 20, bottom: 50, left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="flexor" name="Flexor (ft-lb)" label={{ value: "Flexor (ft-lb)", position: "insideBottomRight", offset: -10 }} type="number" />
                  <YAxis dataKey="extensor" name="Extensor (ft-lb)" label={{ value: "Extensor (ft-lb)", angle: -90, position: "insideLeft" }} type="number" />
                  <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="Athletes" data={groupAthletes.map(a => ({
                    flexor: ((a.isokinetic?.['2025']?.speed60?.lFlexors || 0) + (a.isokinetic?.['2025']?.speed60?.rFlexors || 0)) / 2,
                    extensor: ((a.isokinetic?.['2025']?.speed60?.lExtensors || 0) + (a.isokinetic?.['2025']?.speed60?.rExtensors || 0)) / 2,
                    name: a.name
                  }))} fill="#1f77b4" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* 2026 Scatter Plot */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 text-center">2026 Data</h4>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 10, right: 20, bottom: 50, left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="flexor" name="Flexor (ft-lb)" label={{ value: "Flexor (ft-lb)", position: "insideBottomRight", offset: -10 }} type="number" />
                  <YAxis dataKey="extensor" name="Extensor (ft-lb)" label={{ value: "Extensor (ft-lb)", angle: -90, position: "insideLeft" }} type="number" />
                  <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter name="Athletes" data={groupAthletes.map(a => ({
                    flexor: ((a.isokinetic?.['2026']?.speed60?.lFlexors || 0) + (a.isokinetic?.['2026']?.speed60?.rFlexors || 0)) / 2,
                    extensor: ((a.isokinetic?.['2026']?.speed60?.lExtensors || 0) + (a.isokinetic?.['2026']?.speed60?.rExtensors || 0)) / 2,
                    name: a.name
                  }))} fill="#0ea5e9" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
