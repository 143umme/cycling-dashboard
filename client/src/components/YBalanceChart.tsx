import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ybtDataMap, type YBTData } from '@/lib/ybtDataLoader';

interface YBalanceChartProps {
  athleteName: string;
}

export default function YBalanceChart({ athleteName }: YBalanceChartProps) {
  const ybtData = ybtDataMap.get(athleteName);

  if (!ybtData) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
        <p className="text-center text-slate-600">Y-Balance Test data not available for this athlete</p>
      </div>
    );
  }

  const renderYearChart = (year: "2025" | "2026") => {
    const data = year === "2026" 
      ? [
          {
            metric: 'Anterior',
            leftLeg: ybtData.ybtLA_26,
            rightLeg: ybtData.ybtRA_26,
            disbalance: ybtData.anteriorDisbalance_26,
          },
          {
            metric: 'Medial',
            leftLeg: ybtData.ybtLM_26,
            rightLeg: ybtData.ybtRM_26,
            disbalance: ybtData.postMedialDisbalance_26,
          },
          {
            metric: 'Lateral',
            leftLeg: ybtData.ybtLL_26,
            rightLeg: ybtData.ybtRL_26,
            disbalance: ybtData.postLateralDisbalance_26,
          },
          {
            metric: 'Composite',
            leftLeg: ybtData.leftComposite_26,
            rightLeg: ybtData.rightComposite_26,
            disbalance: ybtData.compositeDisbalance_26,
          },
        ]
      : [
          {
            metric: 'Anterior',
            leftLeg: ybtData.ybtLA_25,
            rightLeg: ybtData.ybtRA_25,
            disbalance: ybtData.anteriorDisbalance_25,
          },
          {
            metric: 'Medial',
            leftLeg: ybtData.ybtLM_25,
            rightLeg: ybtData.ybtRM_25,
            disbalance: ybtData.postMedialDisbalance_25,
          },
          {
            metric: 'Lateral',
            leftLeg: ybtData.ybtLL_25,
            rightLeg: ybtData.ybtRL_25,
            disbalance: ybtData.postLateralDisbalance_25,
          },
          {
            metric: 'Composite',
            leftLeg: ybtData.leftComposite_25,
            rightLeg: ybtData.rightComposite_25,
            disbalance: ybtData.compositeDisbalance_25,
          },
        ];

    return (
      <div key={year} className="bg-white rounded-lg p-6 shadow-sm border border-slate-100 mb-8">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-bold text-slate-800">{athleteName} - Y-Balance Test ({year})</h3>
          <div className="border-2 border-slate-800 px-3 py-1 bg-white">
            <p className="text-sm font-semibold text-slate-800">Difference Normative: &lt;4%</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={500}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 100, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="metric" 
              label={{ value: 'Test Metric', position: 'insideBottomLeft', offset: -10 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ value: 'Reach Percentage (%)', angle: -90, position: 'insideLeft' }}
              domain={[70, 135]}
              ticks={[80, 90, 100, 110, 120, 130]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: any) => `${value.toFixed(1)}%`}
              contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1' }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              wrapperStyle={{ paddingBottom: '20px' }}
            />
            <ReferenceLine 
              y={94} 
              stroke="#dc2626" 
              strokeDasharray="5 5"
              label={{ value: 'Normative ≥ 94%', position: 'top', fill: '#dc2626', fontSize: 12 }}
            />
            <Line 
              type="monotone" 
              dataKey="leftLeg" 
              stroke="#2563eb" 
              strokeWidth={3}
              dot={{ fill: '#2563eb', r: 7, strokeWidth: 2, stroke: '#000' }}
              name="Left Leg"
              isAnimationActive={false}
            />
            <Line 
              type="monotone" 
              dataKey="rightLeg" 
              stroke="#f97316" 
              strokeWidth={3}
              dot={{ fill: '#f97316', r: 7, strokeWidth: 2, stroke: '#000' }}
              name="Right Leg"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Disbalance labels */}
        <div className="mt-6 grid grid-cols-4 gap-4 text-center">
          {data.map((item) => (
            <div key={item.metric} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs font-semibold text-slate-600 mb-1">{item.metric}</p>
              <p className="text-sm font-bold text-slate-800">
                {item.disbalance.toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {renderYearChart("2026")}
      {renderYearChart("2025")}
    </div>
  );
}
