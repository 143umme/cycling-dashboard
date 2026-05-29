import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import type { Athlete } from "@/lib/athleteData";

interface IsokineticsChartProps {
  athlete: Athlete;
  year: "2025" | "2026";
}

export default function IsokineticsChart({ athlete, year }: IsokineticsChartProps) {
  const isMale = athlete.gender === "Male";
  // Normative values in Newton-meters
  const normFlexorNm = isMale ? 140 : 95;
  const normExtensorNm = isMale ? 240 : 155;
  // Convert to ft-lb (1 Nm = 0.73756 ft-lb)
  const normFlexorFtLb = Math.round(normFlexorNm * 0.73756);
  const normExtensorFtLb = Math.round(normExtensorNm * 0.73756);

  const yearData = athlete.isokinetic?.[year];

  if (!yearData) {
    return <div className="p-4 text-slate-500">No data available for {year}</div>;
  }

  // Prepare data points for all speeds
  const dataPoints = [
    // 60 °/s
    { flexor: yearData.speed60?.rFlexors || 0, extensor: yearData.speed60?.rExtensors || 0, speed: "60", side: "Right", color: "#1f77b4", shape: "circle" },
    { flexor: yearData.speed60?.lFlexors || 0, extensor: yearData.speed60?.lExtensors || 0, speed: "60", side: "Left", color: "#1f77b4", shape: "square" },
    // 180 °/s
    { flexor: yearData.speed180?.rFlexors || 0, extensor: yearData.speed180?.rExtensors || 0, speed: "180", side: "Right", color: "#22c55e", shape: "circle" },
    { flexor: yearData.speed180?.lFlexors || 0, extensor: yearData.speed180?.lExtensors || 0, speed: "180", side: "Left", color: "#22c55e", shape: "square" },
    // 240 °/s
    { flexor: yearData.speed240?.rFlexors || 0, extensor: yearData.speed240?.rExtensors || 0, speed: "240", side: "Right", color: "#ef4444", shape: "circle" },
    { flexor: yearData.speed240?.lFlexors || 0, extensor: yearData.speed240?.lExtensors || 0, speed: "240", side: "Left", color: "#ef4444", shape: "square" },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-2">Knee Isokinetic Peak Torque - {year}</h3>
      <p className="text-xs text-slate-500 mb-4">
        {athlete.name} • {athlete.gender} • Normative: Flexor {normFlexorFtLb} ft-lb, Extensor {normExtensorFtLb} ft-lb
      </p>

      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="flexor"
            name="Flexor (ft-lb)"
            type="number"
            domain={[0, 300]}
            label={{ value: "Flexor Peak Torque (ft-lb)", position: "insideBottomRight", offset: -10 }}
          />
          <YAxis
            dataKey="extensor"
            name="Extensor (ft-lb)"
            type="number"
            domain={[0, 350]}
            label={{ value: "Extensor Peak Torque (ft-lb)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }}
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value: any) => value.toFixed(0)}
          />

          {/* Normative Reference Lines */}
          <ReferenceLine
            x={normFlexorFtLb}
            stroke="#22c55e"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{ value: `Normative Flexor (${normFlexorFtLb} ft-lb)`, position: "top", fill: "#22c55e", fontSize: 10 }}
          />
          <ReferenceLine
            y={normExtensorFtLb}
            stroke="#22c55e"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{ value: `Normative Extensor (${normExtensorFtLb} ft-lb)`, position: "right", fill: "#22c55e", fontSize: 10 }}
          />

          {/* 60 °/s - Blue */}
          <Scatter
            name="Right 60°/s"
            data={[dataPoints[0]]}
            fill="#1f77b4"
            shape="circle"
          />
          <Scatter
            name="Left 60°/s"
            data={[dataPoints[1]]}
            fill="#1f77b4"
            shape="square"
          />

          {/* 180 °/s - Green */}
          <Scatter
            name="Right 180°/s"
            data={[dataPoints[2]]}
            fill="#22c55e"
            shape="circle"
          />
          <Scatter
            name="Left 180°/s"
            data={[dataPoints[3]]}
            fill="#22c55e"
            shape="square"
          />

          {/* 240 °/s - Red */}
          <Scatter
            name="Right 240°/s"
            data={[dataPoints[4]]}
            fill="#ef4444"
            shape="circle"
          />
          <Scatter
            name="Left 240°/s"
            data={[dataPoints[5]]}
            fill="#ef4444"
            shape="square"
          />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-xs font-semibold text-slate-700 mb-3">Legend</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div>● Right 60°/s (Blue Circle)</div>
          <div>■ Left 60°/s (Blue Square)</div>
          <div>● Right 180°/s (Green Circle)</div>
          <div>■ Left 180°/s (Green Square)</div>
          <div>● Right 240°/s (Red Circle)</div>
          <div>■ Left 240°/s (Red Square)</div>
          <div>- - Normative Flexor ({normFlexorFtLb} ft-lb)</div>
          <div>- - Normative Extensor ({normExtensorFtLb} ft-lb)</div>
        </div>
      </div>
    </div>
  );
}
