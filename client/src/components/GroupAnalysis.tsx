import { useState } from "react";
import { LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from "recharts";
import { athletes, type GroupType, type Gender, type YearKey, getGroupStats } from "@/lib/athleteData";

interface GroupAnalysisProps {
  yearView: YearKey | "Compare";
}

const groups = [
  { group: "SD" as GroupType, gender: "Male" as Gender, label: "Short Distance - Male", color: "#f97316", bgColor: "#fed7aa" },
  { group: "SD" as GroupType, gender: "Female" as Gender, label: "Short Distance - Female", color: "#ec4899", bgColor: "#fbcfe8" },
  { group: "LD" as GroupType, gender: "Male" as Gender, label: "Long Distance - Male", color: "#22c55e", bgColor: "#dcfce7" },
  { group: "LD" as GroupType, gender: "Female" as Gender, label: "Long Distance - Female", color: "#0891b2", bgColor: "#cffafe" },
];

export default function GroupAnalysis({ yearView }: GroupAnalysisProps) {
  const [selectedGroup, setSelectedGroup] = useState(0);
  const currentGroup = groups[selectedGroup];

  // Get athletes in selected group
  const groupAthletes = athletes.filter(a => a.group === currentGroup.group && a.gender === currentGroup.gender);

  // Prepare data for different chart types
  const prepareChartData = (testKey: string, subKey: string) => {
    return groupAthletes.map(a => {
      const year = yearView === "2025" ? "2025" : yearView === "2026" ? "2026" : "2026";
      let value: any = a.data[year];
      for (const k of testKey.split('.')) {
        value = value[k];
      }
      return {
        name: a.name.split(' ')[0], // First name only for space
        fullName: a.name,
        value: value[subKey],
        category: a.category,
      };
    });
  };

  // Joint ROM Data
  const hipRomLData = prepareChartData("jointROM", "hipTotalRomL");
  const hipRomRData = prepareChartData("jointROM", "hipTotalRomR");
  const forwardReachData = prepareChartData("jointROM", "forwardReachingTest");

  // Isometric Strength Data
  const lhFlexorsData = prepareChartData("isometricStrength", "lhFlexors");
  const rhFlexorsData = prepareChartData("isometricStrength", "rhFlexors");
  const lhExtensorsData = prepareChartData("isometricStrength", "lhExtensors");
  const rhExtensorsData = prepareChartData("isometricStrength", "rhExtensors");

  // Trunk Endurance Data
  const flexorsData = prepareChartData("trunkEndurance", "flexors");
  const extensorsData = prepareChartData("trunkEndurance", "extensors");
  const leftLateralData = prepareChartData("trunkEndurance", "leftLateral");
  const rightLateralData = prepareChartData("trunkEndurance", "rightLateral");

  // FMS Data
  const fmsData = groupAthletes.map(a => {
    const year = yearView === "2025" ? "2025" : yearView === "2026" ? "2026" : "2026";
    return {
      name: a.name.split(' ')[0],
      fullName: a.name,
      score: a.data[year].functionalMovement.totalScore,
      category: a.category,
    };
  });

  return (
    <div className="space-y-6">
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

      {/* Joint ROM & Flexibility */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Joint ROM & Flexibility</h3>
        
        {/* L Hip ROM - Area Chart */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-4">L Hip Total ROM (°) - Area Chart</h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={hipRomLData}>
              <defs>
                <linearGradient id="colorHipL" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentGroup.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={currentGroup.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: any) => (typeof value === 'number' ? value.toFixed(1) : value)} />
              <Area type="monotone" dataKey="value" stroke={currentGroup.color} fillOpacity={1} fill="url(#colorHipL)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* R Hip ROM - Line Chart */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-4">R Hip Total ROM (°) - Line Chart</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hipRomRData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: any) => (typeof value === 'number' ? value.toFixed(1) : value)} />
              <Line type="monotone" dataKey="value" stroke={currentGroup.color} strokeWidth={3} dot={{ fill: currentGroup.color, r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Forward Reach - Bar Chart */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-4">Forward Reaching Test (cm) - Bar Chart</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={forwardReachData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: any) => (typeof value === 'number' ? value.toFixed(1) : value)} />
              <Bar dataKey="value" fill={currentGroup.color} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Isometric Strength */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Isometric Strength (Newtons)</h3>

        {/* LH Flexors - Scatter Chart */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-4">LH Flexors - Scatter Plot</h4>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" type="category" />
              <YAxis dataKey="value" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="LH Flexors" data={lhFlexorsData} fill={currentGroup.color} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* RH Flexors - Area Chart */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-4">RH Flexors - Area Chart</h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={rhFlexorsData}>
              <defs>
                <linearGradient id="colorRhF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentGroup.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={currentGroup.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: any) => (typeof value === 'number' ? value.toFixed(1) : value)} />
              <Area type="monotone" dataKey="value" stroke={currentGroup.color} fillOpacity={1} fill="url(#colorRhF)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* LH Extensors - Line Chart */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-4">LH Extensors - Line Chart</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lhExtensorsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: any) => (typeof value === 'number' ? value.toFixed(1) : value)} />
              <Line type="monotone" dataKey="value" stroke={currentGroup.color} strokeWidth={3} dot={{ fill: currentGroup.color, r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* RH Extensors - Bar Chart */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-4">RH Extensors - Bar Chart</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rhExtensorsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: any) => (typeof value === 'number' ? value.toFixed(1) : value)} />
              <Bar dataKey="value" fill={currentGroup.color} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trunk Endurance */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Trunk Muscle Endurance (Seconds)</h3>

        {/* Flexors - Area Chart */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-4">Flexors - Area Chart</h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={flexorsData}>
              <defs>
                <linearGradient id="colorFlex" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentGroup.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={currentGroup.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: any) => (typeof value === 'number' ? value.toFixed(1) : value)} />
              <Area type="monotone" dataKey="value" stroke={currentGroup.color} fillOpacity={1} fill="url(#colorFlex)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Extensors - Line Chart */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-4">Extensors - Line Chart</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={extensorsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: any) => (typeof value === 'number' ? value.toFixed(1) : value)} />
              <Line type="monotone" dataKey="value" stroke={currentGroup.color} strokeWidth={3} dot={{ fill: currentGroup.color, r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Left Lateral - Bar Chart */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-4">Left Lateral - Bar Chart</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={leftLateralData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: any) => (typeof value === 'number' ? value.toFixed(1) : value)} />
              <Bar dataKey="value" fill={currentGroup.color} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right Lateral - Scatter Chart */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-4">Right Lateral - Scatter Plot</h4>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" type="category" />
              <YAxis dataKey="value" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="Right Lateral" data={rightLateralData} fill={currentGroup.color} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Functional Movement Screen */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Functional Movement Screen (Score /21)</h3>
        <div className="bg-white rounded-lg p-6 border border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-4">FMS Scores - Bar Chart with Status</h4>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={fmsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 21]} />
              <Tooltip 
                formatter={(value: any) => value}
                content={({ active, payload }: any) => {
                  if (active && payload && payload[0]) {
                    const score = payload[0].value as number;
                    let status = "Poor";
                    let color = "#ef4444";
                    if (score >= 18) { status = "Good"; color = "#22c55e"; }
                    else if (score >= 14) { status = "Moderate"; color = "#eab308"; }
                    return (
                      <div className="bg-white p-2 rounded border border-slate-200 text-xs">
                        <p className="font-semibold">{payload[0].payload.fullName}</p>
                        <p>Score: {score}/21</p>
                        <p style={{ color }}>Status: {status}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="score" fill={currentGroup.color} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
