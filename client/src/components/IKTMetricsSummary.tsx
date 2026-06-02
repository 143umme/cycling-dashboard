import type { Athlete } from "@/lib/athleteData";
import { iktDataMap } from "@/lib/iktDataLoader";

interface IKTMetricsSummaryProps {
  athlete: Athlete;
}

export default function IKTMetricsSummary({ athlete }: IKTMetricsSummaryProps) {
  // Get IKT data from CSV
  const iktData = iktDataMap.get(athlete.name);

  if (!iktData) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
        <p className="text-center text-slate-600">IKT data not available for this athlete</p>
      </div>
    );
  }

  // Gender-specific thresholds for Peak Torque
  const isMale = athlete.gender === "Male";
  const extensorThreshold = isMale ? 1.0 : 0.8;
  const flexorThreshold = isMale ? 0.6 : 0.5;

  const getColor = (value: number | undefined, threshold: number, isRatio: boolean = false): string => {
    if (value === undefined || isNaN(value)) return "bg-gray-100";
    
    if (isRatio) {
      // For H/Q ratio: higher is better (>50% is good)
      return value > 50 ? "bg-green-200" : "bg-red-200";
    } else if (threshold === 10) {
      // For asymmetry: lower is better (<10% is good)
      return value < 10 ? "bg-green-200" : "bg-red-200";
    } else {
      // For normalized torque: higher is better
      return value >= threshold ? "bg-green-200" : "bg-red-200";
    }
  };

  const renderMetricsRow = (year: "2025" | "2026") => {
    if (year === "2026") {
      const nvL_Ext = iktData.nvL_Extensors_26;
      const nvR_Ext = iktData.nvR_Extensors_26;
      const nvL_Flx = iktData.nvL_Flexor_26;
      const nvR_Flx = iktData.nvR_Flexor_26;
      const asymExt = iktData.extensor60Assy_26;
      const asymFlx = iktData.flexor60Assy_26;
      const hqL = iktData.hqL60_26;
      const hqR = iktData.hqR60_26;

      return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">{year} Isokinetic Metrics (60°/s)</h3>
          
          <div className="grid grid-cols-3 gap-4">
            {/* Box 1: Peak Torque (Normalized) */}
            <div className="border-2 border-slate-300 rounded-lg p-4 bg-slate-50">
              <h4 className="text-center font-bold text-slate-700 mb-4 text-sm">Peak Torque (Normalized, ft-lb/lb)</h4>
              
              <div className="mb-4">
                <p className="text-center text-xs font-semibold text-slate-600 mb-2">Extensor</p>
                <div className="flex justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 text-center mb-1">L</p>
                    <div className={`${getColor(nvL_Ext, extensorThreshold)} rounded-lg p-3 text-center font-bold text-sm border border-slate-300`}>
                      {nvL_Ext?.toFixed(2) || "N/A"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 text-center mb-1">R</p>
                    <div className={`${getColor(nvR_Ext, extensorThreshold)} rounded-lg p-3 text-center font-bold text-sm border border-slate-300`}>
                      {nvR_Ext?.toFixed(2) || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-center text-xs font-semibold text-slate-600 mb-2">Flexor</p>
                <div className="flex justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 text-center mb-1">L</p>
                    <div className={`${getColor(nvL_Flx, flexorThreshold)} rounded-lg p-3 text-center font-bold text-sm border border-slate-300`}>
                      {nvL_Flx?.toFixed(2) || "N/A"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 text-center mb-1">R</p>
                    <div className={`${getColor(nvR_Flx, flexorThreshold)} rounded-lg p-3 text-center font-bold text-sm border border-slate-300`}>
                      {nvR_Flx?.toFixed(2) || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Leg Asymmetry */}
            <div className="border-2 border-slate-300 rounded-lg p-4 bg-slate-50">
              <h4 className="text-center font-bold text-slate-700 mb-4 text-sm">Leg Asymmetry (%)</h4>
              
              <div className="mb-4">
                <p className="text-center text-xs font-semibold text-slate-600 mb-3">Extensor</p>
                <div className={`${getColor(asymExt, 10)} rounded-lg p-4 text-center font-bold text-xl border border-slate-300`}>
                  {asymExt?.toFixed(1) || "N/A"}%
                </div>
              </div>

              <div>
                <p className="text-center text-xs font-semibold text-slate-600 mb-3">Flexor</p>
                <div className={`${getColor(asymFlx, 10)} rounded-lg p-4 text-center font-bold text-xl border border-slate-300`}>
                  {asymFlx?.toFixed(1) || "N/A"}%
                </div>
              </div>
            </div>

            {/* Box 3: H/Q Ratio */}
            <div className="border-2 border-slate-300 rounded-lg p-4 bg-slate-50">
              <h4 className="text-center font-bold text-slate-700 mb-4 text-sm">H/Q Ratio (%)</h4>
              
              <div className="mb-4">
                <p className="text-center text-xs font-semibold text-slate-600 mb-3">Left</p>
                <div className={`${getColor(hqL, 50, true)} rounded-lg p-4 text-center font-bold text-xl border border-slate-300`}>
                  {hqL?.toFixed(1) || "N/A"}
                </div>
              </div>

              <div>
                <p className="text-center text-xs font-semibold text-slate-600 mb-3">Right</p>
                <div className={`${getColor(hqR, 50, true)} rounded-lg p-4 text-center font-bold text-xl border border-slate-300`}>
                  {hqR?.toFixed(1) || "N/A"}
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
    } else {
      // 2025 data
      const nvL_Ext = iktData.nvL_Extensors_25;
      const nvR_Ext = iktData.nvR_Extensors_25;
      const nvL_Flx = iktData.nvL_Flexor_25;
      const nvR_Flx = iktData.nvR_Flexor_25;
      const asymExt = iktData.extensor60Assy_25;
      const asymFlx = iktData.flexor60Assy_25;
      const hqL = iktData.hqL60_25;
      const hqR = iktData.hqR60_25;

      return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">{year} Isokinetic Metrics (60°/s)</h3>
          
          <div className="grid grid-cols-3 gap-4">
            {/* Box 1: Peak Torque (Normalized) */}
            <div className="border-2 border-slate-300 rounded-lg p-4 bg-slate-50">
              <h4 className="text-center font-bold text-slate-700 mb-4 text-sm">Peak Torque (Normalized, ft-lb/lb)</h4>
              
              <div className="mb-4">
                <p className="text-center text-xs font-semibold text-slate-600 mb-2">Extensor</p>
                <div className="flex justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 text-center mb-1">L</p>
                    <div className={`${getColor(nvL_Ext, extensorThreshold)} rounded-lg p-3 text-center font-bold text-sm border border-slate-300`}>
                      {nvL_Ext?.toFixed(2) || "N/A"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 text-center mb-1">R</p>
                    <div className={`${getColor(nvR_Ext, extensorThreshold)} rounded-lg p-3 text-center font-bold text-sm border border-slate-300`}>
                      {nvR_Ext?.toFixed(2) || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-center text-xs font-semibold text-slate-600 mb-2">Flexor</p>
                <div className="flex justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 text-center mb-1">L</p>
                    <div className={`${getColor(nvL_Flx, flexorThreshold)} rounded-lg p-3 text-center font-bold text-sm border border-slate-300`}>
                      {nvL_Flx?.toFixed(2) || "N/A"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 text-center mb-1">R</p>
                    <div className={`${getColor(nvR_Flx, flexorThreshold)} rounded-lg p-3 text-center font-bold text-sm border border-slate-300`}>
                      {nvR_Flx?.toFixed(2) || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Leg Asymmetry */}
            <div className="border-2 border-slate-300 rounded-lg p-4 bg-slate-50">
              <h4 className="text-center font-bold text-slate-700 mb-4 text-sm">Leg Asymmetry (%)</h4>
              
              <div className="mb-4">
                <p className="text-center text-xs font-semibold text-slate-600 mb-3">Extensor</p>
                <div className={`${getColor(asymExt, 10)} rounded-lg p-4 text-center font-bold text-xl border border-slate-300`}>
                  {asymExt?.toFixed(1) || "N/A"}%
                </div>
              </div>

              <div>
                <p className="text-center text-xs font-semibold text-slate-600 mb-3">Flexor</p>
                <div className={`${getColor(asymFlx, 10)} rounded-lg p-4 text-center font-bold text-xl border border-slate-300`}>
                  {asymFlx?.toFixed(1) || "N/A"}%
                </div>
              </div>
            </div>

            {/* Box 3: H/Q Ratio */}
            <div className="border-2 border-slate-300 rounded-lg p-4 bg-slate-50">
              <h4 className="text-center font-bold text-slate-700 mb-4 text-sm">H/Q Ratio (%)</h4>
              
              <div className="mb-4">
                <p className="text-center text-xs font-semibold text-slate-600 mb-3">Left</p>
                <div className={`${getColor(hqL, 50, true)} rounded-lg p-4 text-center font-bold text-xl border border-slate-300`}>
                  {hqL?.toFixed(1) || "N/A"}
                </div>
              </div>

              <div>
                <p className="text-center text-xs font-semibold text-slate-600 mb-3">Right</p>
                <div className={`${getColor(hqR, 50, true)} rounded-lg p-4 text-center font-bold text-xl border border-slate-300`}>
                  {hqR?.toFixed(1) || "N/A"}
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
    }
  };

  return (
    <div className="space-y-6">
      {/* 2026 Row */}
      {renderMetricsRow("2026")}
      
      {/* 2025 Row */}
      {renderMetricsRow("2025")}
    </div>
  );
}
