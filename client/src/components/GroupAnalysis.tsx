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

        {/* Isometric Strength - Adductors (LH & RH) - 2025 vs 2026 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Isometric Strength - Adductors (N) - 2025 vs 2026</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 11 }}
              />
              <YAxis label={{ value: "N", angle: -90, position: "insideLeft" }} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value.toFixed(1)} />
              <Legend />
              <Bar dataKey="lhAdductors2025" fill="#8b5cf6" name="LH Adductors 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lhAdductors2026" fill="#c4b5fd" name="LH Adductors 2026" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rhAdductors2025" fill="#6366f1" name="RH Adductors 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rhAdductors2026" fill="#818cf8" name="RH Adductors 2026" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={NORMATIVE_VALUES.hipStrength} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Normative (200N)", position: "right", fill: "#64748b", fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Isometric Strength - Abductors (LH & RH) - 2025 vs 2026 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Isometric Strength - Abductors (N) - 2025 vs 2026</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 11 }}
              />
              <YAxis label={{ value: "N", angle: -90, position: "insideLeft" }} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value.toFixed(1)} />
              <Legend />
              <Bar dataKey="lhAbductors2025" fill="#0ea5e9" name="LH Abductors 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lhAbductors2026" fill="#06b6d4" name="LH Abductors 2026" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rhAbductors2025" fill="#0284c7" name="RH Abductors 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rhAbductors2026" fill="#38bdf8" name="RH Abductors 2026" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={NORMATIVE_VALUES.hipStrength} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Normative (200N)", position: "right", fill: "#64748b", fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hip Flexors - Grouped Bar Chart (2025 vs 2026) */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Hip Flexors (N) - 2025 vs 2026</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 11 }}
              />
              <YAxis label={{ value: "N", angle: -90, position: "insideLeft" }} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value.toFixed(1)} />
              <Legend />
              <Bar dataKey="lhFlexors2025" fill="#6366f1" name="LH Flexors 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lhFlexors2026" fill="#818cf8" name="LH Flexors 2026" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rhFlexors2025" fill="#0ea5e9" name="RH Flexors 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rhFlexors2026" fill="#06b6d4" name="RH Flexors 2026" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={NORMATIVE_VALUES.hipStrength} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Normative (200N)", position: "right", fill: "#64748b", fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hip Extensors - Grouped Bar Chart (2025 vs 2026) */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Hip Extensors (N) - 2025 vs 2026</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 11 }}
              />
              <YAxis label={{ value: "N", angle: -90, position: "insideLeft" }} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value.toFixed(1)} />
              <Legend />
              <Bar dataKey="lhExtensors2025" fill="#10b981" name="LH Extensors 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lhExtensors2026" fill="#6ee7b7" name="LH Extensors 2026" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rhExtensors2025" fill="#f59e0b" name="RH Extensors 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rhExtensors2026" fill="#fcd34d" name="RH Extensors 2026" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={NORMATIVE_VALUES.hipStrength} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Normative (200N)", position: "right", fill: "#64748b", fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ankle Plantarflexors - 2025 vs 2026 */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Ankle Plantarflexors (N) - 2025 vs 2026</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 11 }}
              />
              <YAxis label={{ value: "N", angle: -90, position: "insideLeft" }} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} formatter={(value: any) => value.toFixed(1)} />
              <Legend />
              <Bar dataKey="laPlantarflexors2025" fill="#10b981" name="L Ankle Plantarflexors 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="laPlantarflexors2026" fill="#86efac" name="L Ankle Plantarflexors 2026" radius={[4, 4, 0, 0]} />
              <Bar dataKey="raPlantarflexors2025" fill="#f59e0b" name="R Ankle Plantarflexors 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="raPlantarflexors2026" fill="#fcd34d" name="R Ankle Plantarflexors 2026" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={600} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Normative (600N)", position: "right", fill: "#64748b", fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
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
          <div className="grid grid-cols-3 gap-4">
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
          </div>
        </div>

      </div>
    </div>
  );
}
