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
          <CardTitle>🏃 Y-Balance Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No Y-Balance data available for {selectedYear}</p>
        </CardContent>
      </Card>
    );
  }

  const data = yBalanceData[selectedYear];

  // Prepare chart data
  const chartData = [
    {
      metric: 'Anterior',
      left: data.anterior,
      right: data.rightAnterior,
      disbalance: data.anteriorDisbalance,
    },
    {
      metric: 'Medial',
      left: data.medial,
      right: data.rightMedial,
      disbalance: data.medialDisbalance,
    },
    {
      metric: 'Lateral',
      left: data.lateral,
      right: data.rightLateral,
      disbalance: data.lateralDisbalance,
    },
    {
      metric: 'Composite',
      left: data.leftComposite,
      right: data.rightComposite,
      disbalance: data.compositeDisbalance,
    },
  ];

  // Filter out NaN values
  const validData = chartData.filter(
    (d) => !isNaN(d.left) && !isNaN(d.right) && d.left !== null && d.right !== null
  );

  // Calculate stats
  const avgLeftLeg = validData.length > 0 ? (validData.reduce((sum, d) => sum + d.left, 0) / validData.length).toFixed(1) : 'N/A';
  const avgRightLeg = validData.length > 0 ? (validData.reduce((sum, d) => sum + d.right, 0) / validData.length).toFixed(1) : 'N/A';
  const avgDisbalance = validData.length > 0 ? (validData.reduce((sum, d) => sum + d.disbalance, 0) / validData.length).toFixed(1) : 'N/A';

  const isBalanced = validData.every((d) => d.disbalance < 4);
  const allAboveNorm = validData.every((d) => d.left >= 94 && d.right >= 94);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>🏃 Y-Balance Test</CardTitle>
            <Tabs value={selectedYear} onValueChange={(v) => setSelectedYear(v as '2025' | '2026')}>
              <TabsList>
                <TabsTrigger value="2025">2025</TabsTrigger>
                <TabsTrigger value="2026">2026</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Chart */}
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={validData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="metric"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  label={{ value: 'Reach Percentage (%)', angle: -90, position: 'insideLeft' }}
                  domain={[Math.min(...validData.map((d) => Math.min(d.left, d.right))) - 8, Math.max(...validData.map((d) => Math.max(d.left, d.right))) + 8]}
                />
                <Tooltip
                  formatter={(value) => typeof value === 'number' ? value.toFixed(1) : 'N/A'}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                />
                <Legend />
                <ReferenceLine
                  y={94}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  label={{ value: 'Normative ≥ 94%', position: 'insideTopLeft', offset: 10, fill: '#ef4444' }}
                />
                <Line
                  type="monotone"
                  dataKey="left"
                  stroke="#3b82f6"
                  name="Left Leg"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 7, strokeWidth: 2, stroke: '#000' }}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="right"
                  stroke="#f97316"
                  name="Right Leg"
                  strokeWidth={3}
                  dot={{ fill: '#f97316', r: 7, strokeWidth: 2, stroke: '#000' }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">Avg Left Leg</p>
              <p className="text-2xl font-bold text-blue-600">{avgLeftLeg}%</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <p className="text-sm text-gray-600">Avg Right Leg</p>
              <p className="text-2xl font-bold text-orange-600">{avgRightLeg}%</p>
            </div>
            <div className={`p-4 rounded-lg border ${isBalanced ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className="text-sm text-gray-600">Avg Disbalance</p>
              <p className={`text-2xl font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>{avgDisbalance}%</p>
            </div>
            <div className={`p-4 rounded-lg border ${allAboveNorm ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <p className="text-sm text-gray-600">Status</p>
              <p className={`text-lg font-bold ${allAboveNorm ? 'text-green-600' : 'text-yellow-600'}`}>
                {allAboveNorm ? '✓ Above Norm' : isBalanced ? '✓ Balanced' : '⚠ Imbalanced'}
              </p>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Detailed Metrics</h3>
            {validData.map((item) => (
              <div key={item.metric} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">{item.metric}</span>
                  <span className={`text-sm px-2 py-1 rounded ${item.disbalance < 4 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    Disbalance: {item.disbalance.toFixed(1)}%
                  </span>
                </div>
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Left: </span>
                    <span className={`font-semibold ${item.left >= 94 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {item.left.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Right: </span>
                    <span className={`font-semibold ${item.right >= 94 ? 'text-blue-600' : 'text-orange-600'}`}>
                      {item.right.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
            <p className="font-semibold mb-2">Reference Standards:</p>
            <ul className="space-y-1">
              <li>• <strong>Normative:</strong> ≥ 94% for all directions</li>
              <li>• <strong>Balanced:</strong> Left-Right disbalance &lt; 4%</li>
              <li>• <strong>Composite:</strong> Average of Anterior, Medial, and Lateral</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
