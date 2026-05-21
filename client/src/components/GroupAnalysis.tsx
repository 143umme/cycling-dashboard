import { athletes, type GroupType, type Gender, type YearKey } from "@/lib/athleteData";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line, ReferenceLine } from "recharts";

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

  // Prepare data for Y-Balance - Individual athletes with 2025 vs 2026
  const prepareYBalanceData = () => {
    return groupAthletes.map(a => {
      const ybalance = (a.data.yBalance as any) || {};
      return {
        name: a.name.split(" ")[0],
        anteriorLeft2025: ybalance.anteriorLeft || 0,
        anteriorLeft2026: ybalance.anteriorLeft || 0,
        anteriorRight2025: ybalance.anteriorRight || 0,
        anteriorRight2026: ybalance.anteriorRight || 0,
        medialLeft2025: ybalance.medialLeft || 0,
        medialLeft2026: ybalance.medialLeft || 0,
        medialRight2025: ybalance.medialRight || 0,
        medialRight2026: ybalance.medialRight || 0,
        lateralLeft2025: ybalance.lateralLeft || 0,
        lateralLeft2026: ybalance.lateralLeft || 0,
        lateralRight2025: ybalance.lateralRight || 0,
        lateralRight2026: ybalance.lateralRight || 0,
        compositeLeft2025: ybalance.compositeLeft || 0,
        compositeLeft2026: ybalance.compositeLeft || 0,
        compositeRight2025: ybalance.compositeRight || 0,
        compositeRight2026: ybalance.compositeRight || 0,
      };
    });
  };

  // Prepare data for Hip ROM - Individual athletes
  const prepareHipROMData = () => {
    return groupAthletes.map(a => {
      const data2025 = a.data["2025"];
      const data2026 = a.data["2026"];
      return {
        name: a.name.split(" ")[0],
        lHipROM2025: data2025?.jointROM?.hipTotalRomL || 0,
        lHipROM2026: data2026?.jointROM?.hipTotalRomL || 0,
        rHipROM2025: data2025?.jointROM?.hipTotalRomR || 0,
        rHipROM2026: data2026?.jointROM?.hipTotalRomR || 0,
      };
    });
  };

  // Prepare data for Forward Reach - Individual athletes
  const prepareForwardReachData = () => {
    return groupAthletes.map(a => {
      const data2025 = a.data["2025"];
      const data2026 = a.data["2026"];
      return {
        name: a.name.split(" ")[0],
        forwardReach2025: data2025?.jointROM?.forwardReachingTest || 0,
        forwardReach2026: data2026?.jointROM?.forwardReachingTest || 0,
      };
    });
  };

  // Prepare data for Add/Abd Ratio - Individual athletes
  const prepareAddAbdRatioData = () => {
    return groupAthletes.map(a => {
      const data2025 = a.data["2025"];
      const data2026 = a.data["2026"];
      return {
        name: a.name.split(" ")[0],
        lhAddAbdRatio2025: data2025?.isometricStrength?.lhAddAbdRatio || 0,
        lhAddAbdRatio2026: data2026?.isometricStrength?.lhAddAbdRatio || 0,
        rhAddAbdRatio2025: data2025?.isometricStrength?.rhAddAbdRatio || 0,
        rhAddAbdRatio2026: data2026?.isometricStrength?.rhAddAbdRatio || 0,
      };
    });
  };

  // Prepare data for Trunk Endurance - Individual athletes
  const prepareTrunkEnduranceData = () => {
    return groupAthletes.map(a => {
      const data2025 = a.data["2025"];
      const data2026 = a.data["2026"];
      return {
        name: a.name.split(" ")[0],
        flexors2025: data2025?.trunkEndurance?.flexors || 0,
        flexors2026: data2026?.trunkEndurance?.flexors || 0,
        extensors2025: data2025?.trunkEndurance?.extensors || 0,
        extensors2026: data2026?.trunkEndurance?.extensors || 0,
        lateralLeft2025: data2025?.trunkEndurance?.leftLateral || 0,
        lateralLeft2026: data2026?.trunkEndurance?.leftLateral || 0,
        lateralRight2025: data2025?.trunkEndurance?.rightLateral || 0,
        lateralRight2026: data2026?.trunkEndurance?.rightLateral || 0,
      };
    });
  };

  // Prepare data for FMS - Individual athletes
  const prepareFMSData = () => {
    return groupAthletes.map(a => {
      const data2025 = a.data["2025"];
      const data2026 = a.data["2026"];
      return {
        name: a.name.split(" ")[0],
        fms2025: data2025?.functionalMovement?.totalScore || 0,
        fms2026: data2026?.functionalMovement?.totalScore || 0,
      };
    });
  };

  const ybalanceData = prepareYBalanceData();
  const hipROMData = prepareHipROMData();
  const forwardReachData = prepareForwardReachData();
  const addAbdRatioData = prepareAddAbdRatioData();
  const trunkEnduranceData = prepareTrunkEnduranceData();
  const fmsData = prepareFMSData();

  return (
    <div className="space-y-8">
      {/* Group Selection */}
      <div className="flex gap-3 flex-wrap">
        {groups.map((g, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedGroup(idx)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedGroup === idx
                ? "bg-slate-800 text-white shadow-lg"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Y-Balance Test - Individual Athletes */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Y-Balance Test - Anterior</h3>
          <p className="text-sm text-slate-600 mb-4">Individual athlete reach percentages (higher is better, ≥94% is normative)</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ybalanceData} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[70, 150]} type="number" ticks={[70, 90, 110, 130, 150]} />
              <Tooltip formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
              <Legend />
              <Bar dataKey="anteriorLeft2025" fill="#3b82f6" name="Left 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="anteriorLeft2026" fill="#60a5fa" name="Left 2026" radius={[4, 4, 0, 0]} />
              <Bar dataKey="anteriorRight2025" fill="#f97316" name="Right 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="anteriorRight2026" fill="#fb923c" name="Right 2026" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={94} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "Normative (94%)", position: "right", fill: "#dc2626", fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Y-Balance Test - Medial</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ybalanceData} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[70, 150]} type="number" ticks={[70, 90, 110, 130, 150]} />
              <Tooltip formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
              <Legend />
              <Bar dataKey="medialLeft2025" fill="#3b82f6" name="Left 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="medialLeft2026" fill="#60a5fa" name="Left 2026" radius={[4, 4, 0, 0]} />
              <Bar dataKey="medialRight2025" fill="#f97316" name="Right 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="medialRight2026" fill="#fb923c" name="Right 2026" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={94} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "Normative (94%)", position: "right", fill: "#dc2626", fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Y-Balance Test - Lateral</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ybalanceData} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[70, 150]} type="number" ticks={[70, 90, 110, 130, 150]} />
              <Tooltip formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
              <Legend />
              <Bar dataKey="lateralLeft2025" fill="#3b82f6" name="Left 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lateralLeft2026" fill="#60a5fa" name="Left 2026" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lateralRight2025" fill="#f97316" name="Right 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lateralRight2026" fill="#fb923c" name="Right 2026" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={94} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "Normative (94%)", position: "right", fill: "#dc2626", fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Y-Balance Test - Composite</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ybalanceData} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis domain={[70, 150]} type="number" ticks={[70, 90, 110, 130, 150]} />
              <Tooltip formatter={(value: any) => value ? value.toFixed(1) : "N/A"} />
              <Legend />
              <Bar dataKey="compositeLeft2025" fill="#3b82f6" name="Left 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="compositeLeft2026" fill="#60a5fa" name="Left 2026" radius={[4, 4, 0, 0]} />
              <Bar dataKey="compositeRight2025" fill="#f97316" name="Right 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="compositeRight2026" fill="#fb923c" name="Right 2026" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={94} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "Normative (94%)", position: "right", fill: "#dc2626", fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hip ROM - Individual Athletes */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Hip Range of Motion (Degrees)</h3>
        <p className="text-sm text-slate-600 mb-4">Individual athlete hip ROM with 2025 vs 2026 comparison</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hipROMData} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="lHipROM2025" fill="#3b82f6" name="L Hip ROM 2025" radius={[4, 4, 0, 0]} />
            <Bar dataKey="lHipROM2026" fill="#60a5fa" name="L Hip ROM 2026" radius={[4, 4, 0, 0]} />
            <Bar dataKey="rHipROM2025" fill="#f97316" name="R Hip ROM 2025" radius={[4, 4, 0, 0]} />
            <Bar dataKey="rHipROM2026" fill="#fb923c" name="R Hip ROM 2026" radius={[4, 4, 0, 0]} />
            <ReferenceLine y={NORMATIVE_VALUES.hipROM} stroke="#22c55e" strokeDasharray="5 5" label={{ value: `Normative (${NORMATIVE_VALUES.hipROM}°)`, position: "right", fill: "#16a34a", fontSize: 10 }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Forward Reach - Individual Athletes */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Forward Reaching Test (cm)</h3>
        <p className="text-sm text-slate-600 mb-4">Individual athlete forward reach with 2025 vs 2026 comparison</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={forwardReachData} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="forwardReach2025" fill="#3b82f6" name="Forward Reach 2025" radius={[4, 4, 0, 0]} />
            <Bar dataKey="forwardReach2026" fill="#60a5fa" name="Forward Reach 2026" radius={[4, 4, 0, 0]} />
            <ReferenceLine y={NORMATIVE_VALUES.forwardReach} stroke="#22c55e" strokeDasharray="5 5" label={{ value: `Normative (${NORMATIVE_VALUES.forwardReach}cm)`, position: "right", fill: "#16a34a", fontSize: 10 }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Add/Abd Ratio - Individual Athletes */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Add/Abd Ratio</h3>
        <p className="text-sm text-slate-600 mb-4">Individual athlete add/abd ratio with 2025 vs 2026 comparison</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={addAbdRatioData} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis domain={[0.6, 1.4]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="lhAddAbdRatio2025" fill="#3b82f6" name="LH Ratio 2025" radius={[4, 4, 0, 0]} />
            <Bar dataKey="lhAddAbdRatio2026" fill="#60a5fa" name="LH Ratio 2026" radius={[4, 4, 0, 0]} />
            <Bar dataKey="rhAddAbdRatio2025" fill="#f97316" name="RH Ratio 2025" radius={[4, 4, 0, 0]} />
            <Bar dataKey="rhAddAbdRatio2026" fill="#fb923c" name="RH Ratio 2026" radius={[4, 4, 0, 0]} />
            <ReferenceLine y={1.0} stroke="#ef4444" strokeDasharray="5 5" label={{ value: "Normative (1.0)", position: "right", fill: "#dc2626", fontSize: 10 }} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Trunk Endurance - Multiple Graphs */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Trunk Endurance - Flexors (seconds)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trunkEnduranceData} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="flexors2025" fill="#3b82f6" name="Flexors 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="flexors2026" fill="#60a5fa" name="Flexors 2026" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={NORMATIVE_VALUES.trunkFlexors} stroke="#22c55e" strokeDasharray="5 5" label={{ value: `Normative (${NORMATIVE_VALUES.trunkFlexors}s)`, position: "right", fill: "#16a34a", fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Trunk Endurance - Extensors (seconds)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trunkEnduranceData} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="extensors2025" fill="#3b82f6" name="Extensors 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="extensors2026" fill="#60a5fa" name="Extensors 2026" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={NORMATIVE_VALUES.trunkExtensors} stroke="#22c55e" strokeDasharray="5 5" label={{ value: `Normative (${NORMATIVE_VALUES.trunkExtensors}s)`, position: "right", fill: "#16a34a", fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Trunk Endurance - Lateral (seconds)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trunkEnduranceData} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="lateralLeft2025" fill="#3b82f6" name="Lateral Left 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lateralLeft2026" fill="#60a5fa" name="Lateral Left 2026" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lateralRight2025" fill="#f97316" name="Lateral Right 2025" radius={[4, 4, 0, 0]} />
              <Bar dataKey="lateralRight2026" fill="#fb923c" name="Lateral Right 2026" radius={[4, 4, 0, 0]} />
              <ReferenceLine y={NORMATIVE_VALUES.trunkLateral} stroke="#22c55e" strokeDasharray="5 5" label={{ value: `Normative (${NORMATIVE_VALUES.trunkLateral}s)`, position: "right", fill: "#16a34a", fontSize: 10 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FMS - Individual Athletes */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Functional Movement Screen (FMS)</h3>
        <p className="text-sm text-slate-600 mb-4">Individual athlete FMS total scores with 2025 vs 2026 comparison</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={fmsData} margin={{ top: 20, right: 30, left: 60, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis domain={[0, 21]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="fms2025" fill="#3b82f6" name="FMS Score 2025" radius={[4, 4, 0, 0]} />
            <Bar dataKey="fms2026" fill="#60a5fa" name="FMS Score 2026" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
