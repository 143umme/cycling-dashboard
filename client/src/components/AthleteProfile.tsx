import type { Athlete, YearKey } from "@/lib/athleteData";

interface AthleteProfileProps {
  athlete: Athlete;
  yearView: YearKey | "Compare";
}

const catColor = (cat: string) => (cat === "Sprint" ? "#f97316" : "#16a34a");
const catBg = (cat: string) => (cat === "Sprint" ? "rgba(249,115,22,0.1)" : "rgba(22,163,74,0.1)");
const yearColor = (y: YearKey) => (y === "2025" ? "#6366f1" : "#0ea5e9");

export default function AthleteProfile({ athlete, yearView }: AthleteProfileProps) {
  const d25 = athlete.data["2025"];
  const d26 = athlete.data["2026"];
  const cc = catColor(athlete.category);
  const cbg = catBg(athlete.category);

  return (
    <div
      className="rounded-2xl p-5 flex items-center gap-5 shadow-sm border"
      style={{
        background: `linear-gradient(135deg, white 60%, ${cbg})`,
        borderColor: `${cc}33`,
      }}
    >
      {/* Avatar */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shrink-0 shadow-md"
        style={{
          background: `linear-gradient(135deg, ${cc}, ${cc}88)`,
          boxShadow: `0 4px 20px ${cc}44`,
        }}
      >
        {athlete.name.split(" ").map((n) => n[0]).join("")}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h1 className="font-display text-2xl font-bold text-slate-800 leading-tight tracking-wide">
          {athlete.name}
        </h1>
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <span
            className="px-2.5 py-0.5 rounded-full text-xs font-bold"
            style={{ background: cbg, color: cc }}
          >
            {athlete.category === "Sprint" ? "⚡" : "🌿"} {athlete.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            {athlete.gender}
          </span>
          <span className="text-xs text-slate-400 font-mono">{athlete.group === "SD" ? "Short Distance" : "Long Distance"}</span>
        </div>
      </div>

      {/* Year badges */}
      <div className="flex flex-col gap-1.5 shrink-0">
        {(["2025", "2026"] as YearKey[]).map((y) => (
          <div
            key={y}
            className="px-3 py-1 rounded-lg text-xs font-mono font-bold text-white text-center"
            style={{
              background: yearColor(y),
              opacity: yearView === "Compare" || yearView === y ? 1 : 0.35,
            }}
          >
            {y}
          </div>
        ))}
      </div>
    </div>
  );
}
