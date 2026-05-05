interface MetricCardProps {
  label: string;
  value2025: number;
  value2026: number;
  unit: string;
  normative: number;
}

export function MetricCard({ label, value2025, value2026, unit, normative }: MetricCardProps) {
  const change = value2026 - value2025;
  const percent = value2025 !== 0 ? ((change / value2025) * 100).toFixed(1) : "0";
  const isAboveNorm = value2026 >= normative;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-3 rounded-lg border border-slate-200">
      <p className="text-xs font-semibold text-slate-700 mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-600">2025:</span>
          <span className="text-sm font-bold text-indigo-600">{value2025.toFixed(1)}{unit}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-600">2026:</span>
          <span className="text-sm font-bold text-cyan-600">{value2026.toFixed(1)}{unit}</span>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-slate-300">
          <span className="text-xs text-slate-600">Change:</span>
          <span className={`text-xs font-bold ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
            {change >= 0 ? "+" : ""}{change.toFixed(1)} ({percent}%)
          </span>
        </div>
        <div className="flex justify-between items-center pt-1">
          <span className="text-xs text-slate-600">Norm:</span>
          <span className={`text-xs font-semibold ${isAboveNorm ? "text-green-600" : "text-orange-600"}`}>
            {isAboveNorm ? "✓" : "✗"} {normative}{unit}
          </span>
        </div>
      </div>
    </div>
  );
}
