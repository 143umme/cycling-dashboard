import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface YBalanceData {
  anterior: number;
  medial: number;
  lateral: number;
  leftComposite: number;
  rightAnterior: number;
  rightMedial: number;
  rightLateral: number;
  rightComposite: number;
  anteriorDisbalance: number;
  medialDisbalance: number;
  lateralDisbalance: number;
  compositeDisbalance: number;
}

interface YBalanceTestProps {
  athleteName: string;
  yBalanceData?: {
    '2025'?: YBalanceData;
    '2026'?: YBalanceData;
  };
}

export function YBalanceTest({ athleteName, yBalanceData }: YBalanceTestProps) {
  if (!yBalanceData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>⚖️ Y-Balance Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No Y-Balance data available</p>
        </CardContent>
      </Card>
    );
  }

  const renderYearContent = (year: '2025' | '2026') => {
    const data = yBalanceData[year];
    
    if (!data) {
      return (
        <div className="text-center text-gray-500 py-8">
          No data available for {year}
        </div>
      );
    }

    // Prepare chart data - using metric names as X-axis
    const chartData = [
      {
        name: 'Anterior',
        left: data.anterior,
        right: data.rightAnterior,
      },
      {
        name: 'Medial',
        left: data.medial,
        right: data.rightMedial,
      },
      {
        name: 'Lateral',
        left: data.lateral,
        right: data.rightLateral,
      },
      {
        name: 'Composite',
        left: data.leftComposite,
        right: data.rightComposite,
      },
    ];

    // Filter out NaN values
    const validData = chartData.filter(
      (d) => !isNaN(d.left) && !isNaN(d.right) && d.left !== null && d.right !== null
    );

    // Calculate disbalance for each metric
    const disbalanceData = [
      { metric: 'Anterior', disbalance: data.anteriorDisbalance },
      { metric: 'Medial', disbalance: data.medialDisbalance },
      { metric: 'Lateral', disbalance: data.lateralDisbalance },
      { metric: 'Composite', disbalance: data.compositeDisbalance },
    ].filter((d) => !isNaN(d.disbalance) && d.disbalance !== null);

    return (
      <div className="space-y-6">
        {/* Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">{athleteName} - Y-Balance Test ({year})</h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={validData} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  domain={[70, 135]}
                  label={{ value: 'Reach Percentage (%)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2 border border-gray-300 rounded shadow">
                          <p className="text-sm font-semibold">{data.name}</p>
                          <p className="text-sm text-blue-600">Left: {data.left.toFixed(1)}%</p>
                          <p className="text-sm text-orange-600">Right: {data.right.toFixed(1)}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  y={94}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  label={{ value: 'Normative ≥ 94%', position: 'right', fill: '#dc2626', fontSize: 11 }}
                />
                <Legend />
                
                {/* Left Leg - Blue Line connecting Anterior -> Medial -> Lateral -> Composite */}
                <Line
                  type="monotone"
                  dataKey="left"
                  stroke="#3b82f6"
                  name="Left Leg"
                  strokeWidth={2.5}
                  dot={{ fill: '#3b82f6', r: 6, strokeWidth: 2, stroke: '#fff' }}
                  connectNulls
                  isAnimationActive={false}
                />

                {/* Right Leg - Orange Line connecting Anterior -> Medial -> Lateral -> Composite */}
                <Line
                  type="monotone"
                  dataKey="right"
                  stroke="#f97316"
                  name="Right Leg"
                  strokeWidth={2.5}
                  dot={{ fill: '#f97316', r: 6, strokeWidth: 2, stroke: '#fff' }}
                  connectNulls
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Metrics Table */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-4">Detailed Metrics ({year})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="p-2 text-left">Test Metric</th>
                  <th className="p-2 text-center">Left Leg (%)</th>
                  <th className="p-2 text-center">Right Leg (%)</th>
                  <th className="p-2 text-center">Disbalance (%)</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {validData.map((item) => {
                  const disbalance = disbalanceData.find((d) => d.metric === item.name)?.disbalance ?? 0;
                  return (
                    <tr key={item.name} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-2 font-medium">{item.name}</td>
                      <td className="p-2 text-center text-blue-600 font-semibold">{item.left.toFixed(1)}</td>
                      <td className="p-2 text-center text-orange-600 font-semibold">{item.right.toFixed(1)}</td>
                      <td className="p-2 text-center font-semibold">{disbalance.toFixed(1)}</td>
                      <td className="p-2 text-center">
                        <span className={`text-xs px-2 py-1 rounded font-semibold ${disbalance < 4 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {disbalance < 4 ? '✓ Balanced' : '⚠ Imbalanced'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Side by side layout for 2025 and 2026 */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          {renderYearContent('2026')}
        </div>
        <div>
          {renderYearContent('2025')}
        </div>
      </div>
    </div>
  );
}
