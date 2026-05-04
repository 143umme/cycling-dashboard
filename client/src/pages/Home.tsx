import { useState, useMemo } from "react";
import { athletes, type Athlete, type Gender, type Category, type YearKey, getTeamAverages } from "@/lib/athleteData";
import Sidebar from "@/components/Sidebar";
import AthleteProfile from "@/components/AthleteProfile";
import TestTabs from "@/components/TestTabs";
import GroupAnalysis from "@/components/GroupAnalysis";

export default function Home() {
  const [selectedAthleteId, setSelectedAthleteId] = useState<number | null>(athletes[0]?.id ?? null);
  const [genderFilter, setGenderFilter] = useState<Gender | "All">("All");
  const [categoryFilter, setCategoryFilter] = useState<Category | "All">("All");
  const [yearView, setYearView] = useState<YearKey | "Compare">("Compare");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"athlete" | "group">("athlete");

  const filteredAthletes = useMemo(() => {
    return athletes.filter((a) => {
      const matchGender = genderFilter === "All" || a.gender === genderFilter;
      const matchCategory = categoryFilter === "All" || a.category === categoryFilter;
      const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGender && matchCategory && matchSearch;
    });
  }, [genderFilter, categoryFilter, searchQuery]);

  const selectedAthlete: Athlete | null = useMemo(() => {
    if (selectedAthleteId === null) return null;
    return athletes.find((a) => a.id === selectedAthleteId) ?? null;
  }, [selectedAthleteId]);

  const effectiveSelected = useMemo(() => {
    if (!selectedAthlete) return null;
    const inFilter = filteredAthletes.some((a) => a.id === selectedAthlete.id);
    return inFilter ? selectedAthlete : null;
  }, [selectedAthlete, filteredAthletes]);

  const teamAvg2025 = useMemo(() => getTeamAverages("2025", filteredAthletes), [filteredAthletes]);
  const teamAvg2026 = useMemo(() => getTeamAverages("2026", filteredAthletes), [filteredAthletes]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f4f8]">
      {/* Sidebar */}
      <Sidebar
        athletes={filteredAthletes}
        allAthletes={athletes}
        selectedId={effectiveSelected?.id ?? null}
        onSelect={setSelectedAthleteId}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="font-display text-slate-500 text-sm font-semibold tracking-wider uppercase">
              {viewMode === "athlete" ? "Athlete Profile" : "Group Comparison"}
            </span>
            {viewMode === "athlete" ? (
              effectiveSelected && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="font-display text-slate-800 text-sm font-bold">{effectiveSelected.name}</span>
                </>
              )
            ) : (
              <>
                <span className="text-slate-300">/</span>
                <span className="font-display text-slate-800 text-sm font-bold">All Groups</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {(["athlete", "group"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
                    viewMode === mode
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  {mode === "athlete" ? "👤 Athlete" : "👥 Groups"}
                </button>
              ))}
            </div>

            {/* Year Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {(["2025", "Compare", "2026"] as const).map((y) => (
                <button
                  key={y}
                  onClick={() => setYearView(y)}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all duration-200 ${
                    yearView === y
                      ? y === "2025"
                        ? "bg-indigo-500 text-white shadow-sm"
                        : y === "2026"
                        ? "bg-sky-500 text-white shadow-sm"
                        : "bg-slate-700 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === "athlete" ? (
            effectiveSelected ? (
              <div className="p-6 space-y-6">
                <AthleteProfile athlete={effectiveSelected} yearView={yearView} />
                <TestTabs
                  athlete={effectiveSelected}
                  yearView={yearView}
                  teamAvg2025={teamAvg2025}
                  teamAvg2026={teamAvg2026}
                />
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500">
                <p>Select an athlete from the sidebar to view their profile</p>
              </div>
            )
          ) : (
            <div className="p-6 space-y-6">
              <GroupAnalysis yearView={yearView} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
