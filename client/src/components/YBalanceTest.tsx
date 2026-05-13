import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card } from '@/components/ui/card';

interface YBalanceData {
  [year: string]: {
    anteriorLeft?: number;
    anteriorRight?: number;
    medialLeft?: number;
    medialRight?: number;
    lateralLeft?: number;
    lateralRight?: number;
    leftComposite?: number;
    rightComposite?: number;
    compositeDisbalance?: number;
  };
}

interface YBalanceTestProps {
  athleteName: string;
  yBalanceData?: YBalanceData;
}

export function YBalanceTest({ athleteName, yBalanceData }: YBalanceTestProps) {
  const [selectedYear, setSelectedYear] = useState<'2025' | '2026'>('2025');

  if (!yBalanceData || !yBalanceData[selectedYear]) {
    return (
      <div className="text-center py-8 text-slate-500">
        No Y-Balance data available for {selectedYear}
      </div>
    );
  }

  const yearData = yBalanceData[selectedYear];

  // Extract values for the chart - EXACT PYTHON CODE LOGIC
  const metrics = ['Anterior', 'Medial', 'Lateral', 'Composite'];
  const leftLegValues = [
    yearData.anteriorLeft ?? null,
    yearData.medialLeft ?? null,
    yearData.lateralLeft ?? null,
    yearData.leftComposite ?? null,
  ];
  const rightLegValues = [
    yearData.anteriorRight ?? null,
    yearData.medialRight ?? null,
    yearData.lateralRight ?? null,
    yearData.rightComposite ?? null,
  ];

  // Prepare data for chart
  const chartData = metrics.map((metric, idx) => ({
    metric,
    leftLeg: leftLegValues[idx],
    rightLeg: rightLegValues[idx],
    disbalance: leftLegValues[idx] !== null && rightLegValues[idx] !== null 
      ? Math.abs(leftLegValues[idx]! - rightLegValues[idx]!)
      : null,
  }));

  // Calculate all valid values for axis range
  const allValidValues = [...leftLegValues, ...rightLegValues].filter(v => v !== null) as number[];
  const minValue = allValidValues.length > 0 ? Math.min(...allValidValues) - 8 : 70;
  const maxValue = allValidValues.length > 0 ? Math.max(...allValidValues) + 8 : 130;

  // Calculate overall balance status
  const disbalances = chartData
    .map(d => d.disbalance)
    .filter(d => d !== null) as number[];
  const avgDisbalance = disbalances.length > 0 
    ? disbalances.reduce((a, b) => a + b, 0) / disbalances.length 
    : 0;
  const isBalanced = avgDisbalance < 4;

  return (
    <div className="space-y-6">
      {/* Year Selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSelectedYear('2025')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedYear === '2025'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          2025 Data
        </button>
        <button
          onClick={() => setSelectedYear('2026')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedYear === '2026'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}
        >
          2026 Data
        </button>
      </div>

      {/* Main Chart - EXACT PYTHON CODE VISUALIZATION */}
      <Card className="p-6 bg-white shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">
          {athleteName} - Y-Balance Test (20{selectedYear})
        </h3>
        
        <ResponsiveContainer width="100%" height={500}>
          <LineChart
            data={chartData}
            margin={{ top: 40, right: 120, left: 80, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="metric" 
              label={{ value: 'Test Metric', position: 'bottom', offset: 10, fontSize: 12 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              label={{ value: 'Reach Percentage (%)', angle: -90, position: 'insideLeft', offset: 10 }}
              domain={[minValue, maxValue]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              formatter={(value: any) => value !== null ? `${value.toFixed(1)}%` : 'N/A'}
              labelFormatter={(label) => `${label}`}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
              verticalAlign="bottom"
              height={36}
            />
            
            {/* Normative Reference Line at 94% */}
            <ReferenceLine 
              y={94} 
              stroke="#ef4444" 
              strokeDasharray="5 5" 
              strokeWidth={2}
              label={{ value: 'Normative ≥ 94%', position: 'top', fill: '#dc2626', fontSize: 12, offset: 10 }}
            />
            
            {/* Left Leg - Blue Circles */}
            <Line
              type="monotone"
              dataKey="leftLeg"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 8, strokeWidth: 2, stroke: '#000' }}
              name="Left Leg"
              isAnimationActive={false}
            />
            
            {/* Right Leg - Orange Circles */}
            <Line
              type="monotone"
              dataKey="rightLeg"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ fill: '#f97316', r: 8, strokeWidth: 2, stroke: '#000' }}
              name="Right Leg"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Disbalance Information - Exact Python Code Style */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-sm font-medium text-slate-700 mb-3">
            Difference Normative: &lt;4%
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {chartData.map((item, idx) => (
              item.disbalance !== null && (
                <div key={idx} className="text-sm">
                  <span className="font-medium text-slate-700">{item.metric}:</span>
                  <span className={`ml-2 font-bold text-lg ${item.disbalance < 4 ? 'text-green-600' : 'text-orange-600'}`}>
                    {item.disbalance.toFixed(1)}%
                  </span>
                </div>
              )
            ))}
          </div>
        </div>
      </Card>

      {/* Balance Status Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-200 shadow-sm">
          <p className="text-xs font-medium text-slate-600 mb-2">Left Leg Average</p>
          <p className="text-3xl font-bold text-blue-600">
            {leftLegValues.filter(v => v !== null).length > 0
              ? (leftLegValues.filter(v => v !== null).reduce((a: any, b: any) => a + b, 0) / leftLegValues.filter(v => v !== null).length).toFixed(1)
              : 'N/A'}%
          </p>
        </Card>

        <Card className="p-4 bg-orange-50 border-orange-200 shadow-sm">
          <p className="text-xs font-medium text-slate-600 mb-2">Right Leg Average</p>
          <p className="text-3xl font-bold text-orange-600">
            {rightLegValues.filter(v => v !== null).length > 0
              ? (rightLegValues.filter(v => v !== null).reduce((a: any, b: any) => a + b, 0) / rightLegValues.filter(v => v !== null).length).toFixed(1)
              : 'N/A'}%
          </p>
        </Card>

        <Card className={`p-4 shadow-sm ${isBalanced ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className="text-xs font-medium text-slate-600 mb-2">Balance Status</p>
          <p className={`text-lg font-bold ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
            {isBalanced ? '✓ Balanced' : '⚠ Imbalanced'}
          </p>
          <p className="text-xs text-slate-600 mt-1">Avg: {avgDisbalance.toFixed(1)}%</p>
        </Card>
      </div>

      {/* Detailed Metrics Table */}
      <Card className="p-6 bg-white shadow-sm border border-slate-100">
        <h4 className="font-semibold text-slate-800 mb-4">Detailed Metrics</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-300 bg-slate-50">
                <th className="text-left py-3 px-3 font-bold text-slate-700">Test Metric</th>
                <th className="text-center py-3 px-3 font-bold text-slate-700">Left Leg (%)</th>
                <th className="text-center py-3 px-3 font-bold text-slate-700">Right Leg (%)</th>
                <th className="text-center py-3 px-3 font-bold text-slate-700">Disbalance (%)</th>
                <th className="text-center py-3 px-3 font-bold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-3 font-semibold text-slate-700">{item.metric}</td>
                  <td className="text-center py-3 px-3 text-slate-600">
                    {item.leftLeg !== null ? `${item.leftLeg.toFixed(1)}%` : 'N/A'}
                  </td>
                  <td className="text-center py-3 px-3 text-slate-600">
                    {item.rightLeg !== null ? `${item.rightLeg.toFixed(1)}%` : 'N/A'}
                  </td>
                  <td className="text-center py-3 px-3">
                    {item.disbalance !== null ? (
                      <span className={`font-bold text-lg ${item.disbalance < 4 ? 'text-green-600' : 'text-orange-600'}`}>
                        {item.disbalance.toFixed(1)}%
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="text-center py-3 px-3">
                    {item.disbalance !== null && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.disbalance < 4
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {item.disbalance < 4 ? '✓ Good' : '⚠ Check'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Reference Standards */}
      <Card className="p-4 bg-blue-50 border-blue-200 shadow-sm">
        <p className="text-sm font-semibold text-slate-700 mb-2">Reference Standards:</p>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>• <strong>Normative:</strong> ≥ 94% for all directions</li>
          <li>• <strong>Balanced:</strong> Left-Right disbalance &lt; 4%</li>
          <li>• <strong>Composite:</strong> Average of Anterior, Medial, and Lateral</li>
        </ul>
      </Card>
    </div>
  );
}
