import type { Athlete } from "@/lib/athleteData";

interface IKTMetricsSummaryProps {
  athlete: Athlete;
}

export default function IKTMetricsSummary({ athlete }: IKTMetricsSummaryProps) {
  const getColor = (value: number | undefined, threshold: number, isRatio: boolean = false): string => {
    if (value === undefined || isNaN(value)) return "bg-gray-100";
    
    if (isRatio) {
      // For H/Q ratio: higher is better (>50% is good)
      return value > 50 ? "bg-green-200" : "bg-red-200";
    } else {
      // For torque and asymmetry
      return value >= threshold ? "bg-green-200" : "bg-red-200";
    }
  };

  const renderMetricsGrid = (year: "2025" | "2026") => {
    const data = athlete.isokinetic?.[year];
    if (!data) return null;

    const speed60 = data.speed60;
    
    // Extract values
    const extL = speed60?.lExtensors || speed60?.lExtensor;
    const extR = speed60?.rExtensors || speed60?.rExtensor;
    const flxL = speed60?.lFlexors || speed60?.lFlexor;
    const flxR = speed60?.rFlexors || speed60?.rFlexor;
    const hqL = speed60?.lHQRatio;
    const hqR = speed60?.rHQRatio;
    const asymExt = speed60?.extensorAsymmetry;
    const asymFlx = speed60?.flexorAsymmetry;

    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">{year} Isokinetic Metrics (60°/s)</h3>
        
        <div className="grid grid-cols-3 gap-6">
          {/* Peak Torque */}
          <div className="border-2 border-slate-300 rounded-lg p-4 bg-slate-50">
            <h4 className="text-center font-bold text-slate-700 mb-4">Peak Torque (ft-lb)</h4>
            
            <div className="mb-4">
              <p className="text-center text-sm font-semibold text-slate-600 mb-2">Extensor</p>
              <div className="flex justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs text-slate-500 text-center mb-1">L</p>
                  <div className={`${getColor(extL, 1.0)} rounded-lg p-3 text-center font-bold text-lg border border-slate-300`}>
                    {extL?.toFixed(2) || "N/A"}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 text-center mb-1">R</p>
                  <div className={`${getColor(extR, 1.0)} rounded-lg p-3 text-center font-bold text-lg border border-slate-300`}>
                    {extR?.toFixed(2) || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-center text-sm font-semibold text-slate-600 mb-2">Flexor</p>
              <div className="flex justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs text-slate-500 text-center mb-1">L</p>
                  <div className={`${getColor(flxL, 0.6)} rounded-lg p-3 text-center font-bold text-lg border border-slate-300`}>
                    {flxL?.toFixed(2) || "N/A"}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate-500 text-center mb-1">R</p>
                  <div className={`${getColor(flxR, 0.6)} rounded-lg p-3 text-center font-bold text-lg border border-slate-300`}>
                    {flxR?.toFixed(2) || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* H/Q Ratio */}
          <div className="border-2 border-slate-300 rounded-lg p-4 bg-slate-50">
            <h4 className="text-center font-bold text-slate-700 mb-4">H/Q Ratio (%)</h4>
            
            <div className="mb-4">
              <p className="text-center text-sm font-semibold text-slate-600 mb-3">Left</p>
              <div className={`${getColor(hqL, 50, true)} rounded-lg p-4 text-center font-bold text-2xl border border-slate-300`}>
                {hqL?.toFixed(1) || "N/A"}
              </div>
            </div>

            <div>
              <p className="text-center text-sm font-semibold text-slate-600 mb-3">Right</p>
              <div className={`${getColor(hqR, 50, true)} rounded-lg p-4 text-center font-bold text-2xl border border-slate-300`}>
                {hqR?.toFixed(1) || "N/A"}
              </div>
            </div>
          </div>

          {/* Leg Asymmetry */}
          <div className="border-2 border-slate-300 rounded-lg p-4 bg-slate-50">
            <h4 className="text-center font-bold text-slate-700 mb-4">Leg Asymmetry (%)</h4>
            
            <div className="mb-4">
              <p className="text-center text-sm font-semibold text-slate-600 mb-3">Extensor</p>
              <div className={`${getColor(asymExt, 10)} rounded-lg p-4 text-center font-bold text-2xl border border-slate-300`}>
                {asymExt?.toFixed(1) || "N/A"}%
              </div>
            </div>

            <div>
              <p className="text-center text-sm font-semibold text-slate-600 mb-3">Flexor</p>
              <div className={`${getColor(asymFlx, 10)} rounded-lg p-4 text-center font-bold text-2xl border border-slate-300`}>
                {asymFlx?.toFixed(1) || "N/A"}%
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 p-3 bg-slate-100 rounded-lg text-xs text-slate-600">
          <p className="font-semibold mb-2">Color Legend:</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 border border-slate-300 rounded"></div>
              <span>Good (Above Threshold)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-200 border border-slate-300 rounded"></div>
              <span>Below Threshold</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderMetricsGrid("2025")}
        {renderMetricsGrid("2026")}
      </div>
    </div>
  );
}
