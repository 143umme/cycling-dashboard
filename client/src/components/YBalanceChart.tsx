import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
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
    // Data structure: each point represents a test metric with left and right reach percentages
    const data = year === "2026" 
      ? [
          {
            metric: 'Anterior',
            leftReach: ybtData.ybtLA_26,
            rightReach: ybtData.ybtRA_26,
            disbalance: ybtData.anteriorDisbalance_26,
          },
          {
            metric: 'Medial',
            leftReach: ybtData.ybtLM_26,
            rightReach: ybtData.ybtRM_26,
            disbalance: ybtData.postMedialDisbalance_26,
          },
          {
            metric: 'Lateral',
            leftReach: ybtData.ybtLL_26,
            rightReach: ybtData.ybtRL_26,
            disbalance: ybtData.postLateralDisbalance_26,
          },
          {
            metric: 'Composite',
            leftReach: ybtData.leftComposite_26,
            rightReach: ybtData.rightComposite_26,
            disbalance: ybtData.compositeDisbalance_26,
          },
        ]
      : [
          {
            metric: 'Anterior',
            leftReach: ybtData.ybtLA_25,
            rightReach: ybtData.ybtRA_25,
            disbalance: ybtData.anteriorDisbalance_25,
          },
          {
            metric: 'Medial',
            leftReach: ybtData.ybtLM_25,
            rightReach: ybtData.ybtRM_25,
            disbalance: ybtData.postMedialDisbalance_25,
          },
          {
            metric: 'Lateral',
            leftReach: ybtData.ybtLL_25,
            rightReach: ybtData.ybtRL_25,
            disbalance: ybtData.postLateralDisbalance_25,
          },
          {
            metric: 'Composite',
            leftReach: ybtData.leftComposite_25,
            rightReach: ybtData.rightComposite_25,
            disbalance: ybtData.compositeDisbalance_25,
          },
        ];

    return (
      <div key={year} className="bg-white rounded-lg p-6 shadow-sm border border-slate-100 mb-8">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-base font-semibold text-slate-700">{athleteName} - Y-Balance Test ({year})</h3>
          <div className="border-2 border-slate-800 px-3 py-1 bg-white">
            <p className="text-xs font-semibold text-slate-800">Difference Normative: &lt;4%</p>
          </div>
        </div>

        <div className="relative">
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 100, left: 100, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                type="number"
                label={{ value: 'Reach Percentage (%)', position: 'bottom', offset: 10 }}
                domain={[70, 135]}
                ticks={[80, 90, 100, 110, 120, 130]}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                type="category"
                dataKey="metric"
                label={{ value: 'Test Metric', angle: -90, position: 'insideLeft' }}
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
                x={94} 
                stroke="#dc2626" 
                strokeDasharray="5 5"
                label={{ value: 'Normative ≥ 94%', position: 'top', fill: '#dc2626', fontSize: 12 }}
              />
              <Line 
                type="linear" 
                dataKey="leftReach" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ fill: '#2563eb', r: 7, strokeWidth: 2, stroke: '#000' }}
                name="Left Leg"
                isAnimationActive={false}
              />
              <Line 
                type="linear" 
                dataKey="rightReach" 
                stroke="#f97316" 
                strokeWidth={3}
                dot={{ fill: '#f97316', r: 7, strokeWidth: 2, stroke: '#000' }}
                name="Right Leg"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Disbalance labels overlay */}
          <div className="absolute top-0 right-0 w-32 space-y-20 mt-24">
            {data.map((item, idx) => (
              <div key={item.metric} className="text-center">
                <div className="bg-white border-2 border-slate-800 px-2 py-1 inline-block">
                  <p className="text-xs font-bold text-slate-800">
                    {item.disbalance.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
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
