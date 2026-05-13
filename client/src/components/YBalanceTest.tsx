import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [selectedYear, setSelectedYear] = useState<'2025' | '2026'>('2025');

  if (!yBalanceData || !yBalanceData[selectedYear]) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>⚖️ Y-Balance Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No Y-Balance data available for {selectedYear}</p>
        </CardContent>
      </Card>
    );
  }

  const data = yBalanceData[selectedYear];

  // Prepare chart data with proper ordering for line connection
  const chartData = [
    {
      metric: 'Anterior',
      metricIndex: 0,
      left: data.anterior,
      right: data.rightAnterior,
      disbalance: data.anteriorDisbalance,
    },
    {
      metric: 'Medial',
      metricIndex: 1,
      left: data.medial,
      right: data.rightMedial,
      disbalance: data.medialDisbalance,
    },
    {
      metric: 'Lateral',
      metricIndex: 2,
      left: data.lateral,
      right: data.rightLateral,
      disbalance: data.lateralDisbalance,
    },
    {
      metric: 'Composite',
      metricIndex: 3,
      left: data.leftComposite,
      right: data.rightComposite,
      disbalance: data.compositeDisbalance,
    },
  ];

  // Filter out NaN values
  const validData = chartData.filter(
    (d) => !isNaN(d.left) && !isNaN(d.right) && d.left !== null && d.right !== null
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>⚖️ Y-Balance Test ({selectedYear})</CardTitle>
            <Tabs value={selectedYear} onValueChange={(v) => setSelectedYear(v as '2025' | '2026')}>
              <TabsList>
                <TabsTrigger value="2025">2025 Data</TabsTrigger>
                <TabsTrigger value="2026">2026 Data</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Chart - Line Chart with Connected Points */}
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={validData} margin={{ top: 20, right: 30, left: 100, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="left"
                  type="number"
                  name="Reach Percentage (%)"
                  domain={[Math.min(...validData.map((d) => Math.min(d.left, d.right))) - 5, Math.max(...validData.map((d) => Math.max(d.left, d.right))) + 5]}
                  label={{ value: 'Reach Percentage (%)', position: 'insideBottomRight', offset: -10 }}
                />
                <YAxis
                  dataKey="metricIndex"
                  type="number"
                  domain={[-0.5, 3.5]}
                  ticks={[0, 1, 2, 3]}
                  tickFormatter={(value) => {
                    const metrics = ['Anterior', 'Medial', 'Lateral', 'Composite'];
                    return metrics[value] || '';
                  }}
                  label={{ value: 'Test Metric', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2 border border-gray-300 rounded shadow">
                          <p className="text-sm font-semibold">{data.metric}</p>
                          <p className="text-sm">Left: {data.left.toFixed(1)}%</p>
                          <p className="text-sm">Right: {data.right.toFixed(1)}%</p>
                          <p className="text-sm">Disbalance: {data.disbalance.toFixed(1)}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  x={94}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  label={{ value: 'Normative ≥ 94%', position: 'top', fill: '#dc2626', fontSize: 11 }}
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

          {/* Disbalance Labels */}
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Disbalance Percentages:</strong></p>
            {validData.map((item) => (
              <p key={item.metric}>
                {item.metric}: <span className={item.disbalance < 4 ? 'text-green-600 font-semibold' : 'text-orange-600 font-semibold'}>{item.disbalance.toFixed(1)}%</span>
              </p>
            ))}
          </div>

          {/* Detailed Metrics Table */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Detailed Metrics</h3>
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
                  {validData.map((item) => (
                    <tr key={item.metric} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-2 font-medium">{item.metric}</td>
                      <td className="p-2 text-center text-blue-600 font-semibold">{item.left.toFixed(1)}</td>
                      <td className="p-2 text-center text-orange-600 font-semibold">{item.right.toFixed(1)}</td>
                      <td className="p-2 text-center font-semibold">{item.disbalance.toFixed(1)}</td>
                      <td className="p-2 text-center">
                        <span className={`text-xs px-2 py-1 rounded font-semibold ${item.disbalance < 4 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {item.disbalance < 4 ? '✓ Balanced' : '⚠ Imbalanced'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
