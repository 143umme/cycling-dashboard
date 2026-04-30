// ============================================================
// SIDEBAR — Dark charcoal sidebar with athlete list + filters
// Design: Athletic Performance Studio
// bg: #1a1f2e, accent: #2563eb, Sprint: #f97316, Endurance: #16a34a
// ============================================================

import { Search, Users, Zap, Wind, ChevronRight } from "lucide-react";
import type { Athlete, Gender, Category } from "@/lib/athleteData";

interface SidebarProps {
  athletes: Athlete[];
  allAthletes: Athlete[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  genderFilter: Gender | "All";
  setGenderFilter: (v: Gender | "All") => void;
  categoryFilter: Category | "All";
  setCategoryFilter: (v: Category | "All") => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}

const categoryColor = (cat: Category) =>
  cat === "Sprint" ? "#f97316" : "#16a34a";

const genderInitial = (g: string) => g[0];

export default function Sidebar({
  athletes,
  allAthletes,
  selectedId,
  onSelect,
  genderFilter,
  setGenderFilter,
  categoryFilter,
  setCategoryFilter,
  searchQuery,
  setSearchQuery,
}: SidebarProps) {
  const sprintCount = allAthletes.filter((a) => a.category === "Sprint").length;
  const enduranceCount = allAthletes.filter((a) => a.category === "Endurance").length;
  const maleCount = allAthletes.filter((a) => a.gender === "Male").length;
  const femaleCount = allAthletes.filter((a) => a.gender === "Female").length;

  return (
    <aside
      className="w-[260px] shrink-0 flex flex-col h-full overflow-hidden"
      style={{ background: "#1a1f2e" }}
    >
      {/* Logo */}
      <div className="px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #2563eb, #0ea5e9)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="2" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="2" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="22" y2="12" />
            </svg>
          </div>
          <div>
            <div className="font-display text-white font-bold text-sm leading-tight tracking-wide">CYCLING TEAM</div>
            <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Preseason 2025–2026</div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="px-4 py-3 grid grid-cols-2 gap-2 border-b border-white/10">
        <div className="bg-white/5 rounded-lg px-3 py-2">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Athletes</div>
          <div className="font-mono text-white text-lg font-bold leading-tight">{allAthletes.length}</div>
        </div>
        <div className="bg-white/5 rounded-lg px-3 py-2">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Filtered</div>
          <div className="font-mono text-white text-lg font-bold leading-tight">{athletes.length}</div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search athlete..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/8 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />
        </div>
      </div>

      {/* Gender Filter */}
      <div className="px-4 pb-2">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Gender</div>
        <div className="flex gap-1">
          {(["All", "Male", "Female"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGenderFilter(g)}
              className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-all duration-150 ${
                genderFilter === g
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/10"
              }`}
              style={genderFilter === g ? {} : { background: "rgba(255,255,255,0.04)" }}
            >
              {g === "All" ? `All (${allAthletes.length})` : g === "Male" ? `M (${maleCount})` : `F (${femaleCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 pb-3 border-b border-white/10">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">Category</div>
        <div className="flex gap-1">
          {(["All", "Sprint", "Endurance"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-all duration-150`}
              style={
                categoryFilter === c
                  ? {
                      background: c === "Sprint" ? "#f97316" : c === "Endurance" ? "#16a34a" : "#2563eb",
                      color: "white",
                    }
                  : { background: "rgba(255,255,255,0.04)", color: "#94a3b8" }
              }
            >
              {c === "All" ? "All" : c === "Sprint" ? `⚡ ${sprintCount}` : `🌿 ${enduranceCount}`}
            </button>
          ))}
        </div>
      </div>

      {/* Team Overview button */}
      <div className="px-4 pt-3 pb-2">
        <button
          onClick={() => onSelect(null)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
            selectedId === null
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "text-slate-400 hover:text-white hover:bg-white/8"
          }`}
          style={selectedId !== null ? { background: "rgba(255,255,255,0.03)" } : {}}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Team Overview</span>
          {selectedId === null && <ChevronRight className="w-3 h-3 ml-auto" />}
        </button>
      </div>

      {/* Athlete List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-0.5 scrollbar-thin">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-2 px-1">
          Athletes ({athletes.length})
        </div>
        {athletes.length === 0 && (
          <div className="text-center text-slate-500 text-xs py-8">No athletes match filters</div>
        )}
        {athletes.map((athlete) => {
          const isSelected = selectedId === athlete.id;
          const catColor = categoryColor(athlete.category);
          return (
            <button
              key={athlete.id}
              onClick={() => onSelect(athlete.id)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-150 text-left group"
              style={
                isSelected
                  ? { background: "rgba(37,99,235,0.15)", borderLeft: `3px solid ${catColor}` }
                  : { background: "transparent", borderLeft: "3px solid transparent" }
              }
              onMouseEnter={(e) => {
                if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {/* Avatar */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${catColor}99, ${catColor}44)`,
                  border: `1.5px solid ${catColor}66`,
                }}
              >
                {athlete.name.split(" ").map((n) => n[0]).join("")}
              </div>
              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <div
                  className={`text-xs font-semibold truncate leading-tight ${
                    isSelected ? "text-white" : "text-slate-300"
                  }`}
                >
                  {athlete.name}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[9px] font-mono" style={{ color: catColor }}>
                    {athlete.category === "Sprint" ? "⚡" : "🌿"} {athlete.category}
                  </span>
                  <span className="text-[9px] text-slate-600">·</span>
                  <span className="text-[9px] text-slate-500 font-mono">{genderInitial(athlete.gender)}</span>
                  <span className="text-[9px] text-slate-600">·</span>
                  <span className="text-[9px] text-slate-500 font-mono">{athlete.group}</span>
                </div>
              </div>
              {isSelected && <ChevronRight className="w-3 h-3 text-blue-400 shrink-0" />}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
