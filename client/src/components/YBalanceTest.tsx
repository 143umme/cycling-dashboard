import { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
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

  // Prepare chart data with swapped axes
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

  // Custom label component for disbalance percentages
  const renderCustomLabel = (props: any) => {
    const { x, y, payload } = props;
    if (!payload) return null;
    
    const disbalanceText = `${payload.disbalance.toFixed(1)}%`;
    return (
      <text 
        x={x} 
        y={y - 15} 
        fill="#666" 
        textAnchor="middle" 
        fontSize={11}
        fontWeight="bold"
      >
        {disbalanceText}
      </text>
    );
  };

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
          {/* Main Chart - Swapped Axes */}
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, left: 80, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  dataKey="left"
                  name="Reach Percentage (%)"
                  domain={[Math.min(...validData.map((d) => Math.min(d.left, d.right))) - 5, Math.max(...validData.map((d) => Math.max(d.left, d.right))) + 5]}
                  label={{ value: 'Reach Percentage (%)', position: 'insideBottomRight', offset: -10 }}
                />
                <YAxis
                  type="number"
                  dataKey="metricIndex"
                  name="Test Metric"
                  domain={[-0.5, 3.5]}
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
                
                {/* Left Leg - Blue */}
                <Scatter
                  name="Left Leg"
                  data={validData}
                  fill="#3b82f6"
                  shape="circle"
                >
                  {validData.map((entry, index) => (
                    <text
                      key={`left-${index}`}
                      x={entry.left}
                      y={entry.metricIndex}
                      textAnchor="middle"
                      fill="#3b82f6"
                      fontSize={12}
                      fontWeight="bold"
                    >
                      ●
                    </text>
                  ))}
                </Scatter>

                {/* Right Leg - Orange */}
                <Scatter
                  name="Right Leg"
                  data={validData.map((d) => ({ ...d, left: d.right }))}
                  fill="#f97316"
                  shape="circle"
                >
                  {validData.map((entry, index) => (
                    <text
                      key={`right-${index}`}
                      x={entry.right}
                      y={entry.metricIndex}
                      textAnchor="middle"
                      fill="#f97316"
                      fontSize={12}
                      fontWeight="bold"
                    >
                      ●
                    </text>
                  ))}
                </Scatter>

                {/* Disbalance labels */}
                {validData.map((entry, index) => {
                  const midX = (entry.left + entry.right) / 2;
                  return (
                    <text
                      key={`disbalance-${index}`}
                      x={midX}
                      y={entry.metricIndex - 0.35}
                      textAnchor="middle"
                      fill="#666"
                      fontSize={10}
                      fontWeight="bold"
                    >
                      {entry.disbalance.toFixed(1)}%
                    </text>
                  );
                })}
              </ScatterChart>
            </ResponsiveContainer>
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
