import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell, ScatterChart, Scatter } from "recharts";
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
      const year = yearView === "2025" ? "2025" : yearView === "2026" ? "2026" : "2026";
      const data = a.data[year];
      return {
        name: a.name, // Full name for display
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
        {/* Hip ROM - Line Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Hip Range of Motion (Degrees)</h3>
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
              <Line type="monotone" dataKey="lHipROM" stroke="#6366f1" name="L Hip ROM" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="rHipROM" stroke="#0ea5e9" name="R Hip ROM" strokeWidth={2} dot={{ r: 4 }} />
              <ReferenceLine y={NORMATIVE_VALUES.hipROM} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Normative (90°)", position: "right", fill: "#64748b", fontSize: 11 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Forward Reach - Area Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Forward Reaching Test (cm)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
              <defs>
                <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Area type="monotone" dataKey="forwardReach" stroke="#f97316" fillOpacity={1} fill="url(#colorReach)" />
              <ReferenceLine y={NORMATIVE_VALUES.forwardReach} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Normative (29cm)", position: "right", fill: "#64748b", fontSize: 11 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Isometric Strength - Bar Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Isometric Strength - Main Measurements (N)</h3>
          <ResponsiveContainer width="100%" height={400}>
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
              <Bar dataKey="lhFlexors" fill="#6366f1" name="LH Flexors" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rhFlexors" fill="#0ea5e9" name="RH Flexors" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lhExtensors" fill="#10b981" name="LH Extensors" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rhExtensors" fill="#f59e0b" name="RH Extensors" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={NORMATIVE_VALUES.hipStrength} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: "Normative (200N)", position: "right", fill: "#64748b", fontSize: 11 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Isometric Strength Ratios - Pie Charts Grid */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Isometric Strength - Add/Abd Ratios</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {groupData.map((athlete, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <p className="text-xs font-semibold text-slate-700 mb-2 text-center">{athlete.name}</p>
                <div className="flex gap-4">
                  {/* LH Ratio */}
                  <div className="flex flex-col items-center">
                    <ResponsiveContainer width={120} height={120}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Add", value: (athlete.lhAddAbdRatio / (1 + athlete.lhAddAbdRatio)) * 100 },
                            { name: "Abd", value: (100 / (1 + athlete.lhAddAbdRatio)) * 100 },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={50}
                          paddingAngle={1}
                          dataKey="value"
                        >
                          <Cell fill="#6366f1" />
                          <Cell fill="#0ea5e9" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-slate-600 mt-1">LH: {athlete.lhAddAbdRatio.toFixed(2)}</p>
                  </div>
                  {/* RH Ratio */}
                  <div className="flex flex-col items-center">
                    <ResponsiveContainer width={120} height={120}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Add", value: (athlete.rhAddAbdRatio / (1 + athlete.rhAddAbdRatio)) * 100 },
                            { name: "Abd", value: (100 / (1 + athlete.rhAddAbdRatio)) * 100 },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={50}
                          paddingAngle={1}
                          dataKey="value"
                        >
                          <Cell fill="#f97316" />
                          <Cell fill="#ec4899" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-slate-600 mt-1">RH: {athlete.rhAddAbdRatio.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trunk Endurance - Scatter Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Trunk Endurance (seconds)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                type="category"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fontSize: 11 }}
              />
              <YAxis label={{ value: "sec", angle: -90, position: "insideLeft" }} />
              <Tooltip contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <Legend />
              <Scatter name="Flexors" data={groupData.map(d => ({ name: d.name, value: d.flexors }))} fill="#6366f1" />
              <Scatter name="Extensors" data={groupData.map(d => ({ name: d.name, value: d.extensors }))} fill="#10b981" />
              <Scatter name="Left Lateral" data={groupData.map(d => ({ name: d.name, value: d.leftLateral }))} fill="#f59e0b" />
              <Scatter name="Right Lateral" data={groupData.map(d => ({ name: d.name, value: d.rightLateral }))} fill="#ec4899" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* FMS Scores - Bar Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Functional Movement Screen (out of 21)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={groupData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
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
              <Bar dataKey="fms" fill="#8b5cf6" name="FMS Score" radius={[8, 8, 0, 0]} />
              <ReferenceLine y={14} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "Poor (14)", position: "right", fill: "#dc2626", fontSize: 10 }} />
              <ReferenceLine y={18} stroke="#eab308" strokeDasharray="5 5" label={{ value: "Good (18)", position: "right", fill: "#b45309", fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
