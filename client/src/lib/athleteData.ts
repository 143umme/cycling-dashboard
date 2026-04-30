// ============================================================
// CYCLING TEAM PRESEASON DASHBOARD — Real Athlete Data
// Loaded from Excel file
// ============================================================

import realAthleteDataJson from './realAthleteData.json';

export type Gender = "Male" | "Female";
export type Category = "Sprint" | "Endurance";
export type YearKey = "2025" | "2026";
export type GroupType = "SD" | "LD";

// Joint ROM & Flexibility
export interface JointROMData {
  hipTotalRomL: number;
  hipTotalRomR: number;
  forwardReachingTest: number;
}

// Isometric Strength (12 measurements)
export interface IsometricStrengthData {
  lhFlexors: number;
  rhFlexors: number;
  lhExtensors: number;
  rhExtensors: number;
  lhAdductors: number;
  rhAdductors: number;
  lhAbductors: number;
  rhAbductors: number;
  laPlantarflexors: number;
  raPlantarflexors: number;
  lhAddAbdRatio: number;
  rhAddAbdRatio: number;
}

// Functional Movement Screen
export interface FunctionalMovementData {
  totalScore: number;
}

// Trunk Muscle Endurance
export interface TrunkEnduranceData {
  flexors: number;
  extensors: number;
  leftLateral: number;
  rightLateral: number;
}

// Complete year data
export interface AthleteYear {
  jointROM: JointROMData;
  isometricStrength: IsometricStrengthData;
  functionalMovement: FunctionalMovementData;
  trunkEndurance: TrunkEnduranceData;
}

// Athlete profile
export interface Athlete {
  id: number;
  name: string;
  gender: Gender;
  category: Category;
  group: GroupType;
  data: {
    "2025": AthleteYear;
    "2026": AthleteYear;
  };
}

// Load real data from JSON
export const athletes: Athlete[] = (realAthleteDataJson as any[]).map((a) => ({
  id: a.id,
  name: a.name,
  gender: a.gender as Gender,
  category: a.category as Category,
  group: a.group as GroupType,
  data: {
    "2025": a.data["2025"],
    "2026": a.data["2026"],
  },
}));

export const TEAM_SIZE = athletes.length;

// Get group label
export function getGroupLabel(group: GroupType): string {
  return group === "SD" ? "Short Distance (Sprint)" : "Long Distance (Endurance)";
}

// Get group color
export function getGroupColor(group: GroupType): string {
  return group === "SD" ? "#f97316" : "#16a34a";
}

// Compute team averages
export function getTeamAverages(year: YearKey, filtered?: Athlete[]): AthleteYear {
  const pool = filtered ?? athletes;
  const n = pool.length;
  if (n === 0) return pool[0]?.data[year] ?? athletes[0].data[year];

  function avg(fn: (a: AthleteYear) => number): number {
    return parseFloat((pool.reduce((s, a) => s + fn(a.data[year]), 0) / n).toFixed(1));
  }

  return {
    jointROM: {
      hipTotalRomL: avg(a => a.jointROM.hipTotalRomL),
      hipTotalRomR: avg(a => a.jointROM.hipTotalRomR),
      forwardReachingTest: avg(a => a.jointROM.forwardReachingTest),
    },
    isometricStrength: {
      lhFlexors: avg(a => a.isometricStrength.lhFlexors),
      rhFlexors: avg(a => a.isometricStrength.rhFlexors),
      lhExtensors: avg(a => a.isometricStrength.lhExtensors),
      rhExtensors: avg(a => a.isometricStrength.rhExtensors),
      lhAdductors: avg(a => a.isometricStrength.lhAdductors),
      rhAdductors: avg(a => a.isometricStrength.rhAdductors),
      lhAbductors: avg(a => a.isometricStrength.lhAbductors),
      rhAbductors: avg(a => a.isometricStrength.rhAbductors),
      laPlantarflexors: avg(a => a.isometricStrength.laPlantarflexors),
      raPlantarflexors: avg(a => a.isometricStrength.raPlantarflexors),
      lhAddAbdRatio: avg(a => a.isometricStrength.lhAddAbdRatio),
      rhAddAbdRatio: avg(a => a.isometricStrength.rhAddAbdRatio),
    },
    functionalMovement: {
      totalScore: Math.round(avg(a => a.functionalMovement.totalScore)),
    },
    trunkEndurance: {
      flexors: avg(a => a.trunkEndurance.flexors),
      extensors: avg(a => a.trunkEndurance.extensors),
      leftLateral: avg(a => a.trunkEndurance.leftLateral),
      rightLateral: avg(a => a.trunkEndurance.rightLateral),
    },
  };
}

// Get group statistics
export function getGroupStats(group: GroupType, gender: Gender, year: YearKey) {
  const filtered = athletes.filter(a => a.group === group && a.gender === gender);
  return {
    count: filtered.length,
    average: getTeamAverages(year, filtered),
  };
}

// Get all groups
export function getAllGroups() {
  return [
    { group: "SD" as GroupType, gender: "Male" as Gender, label: "Short Distance - Male" },
    { group: "SD" as GroupType, gender: "Female" as Gender, label: "Short Distance - Female" },
    { group: "LD" as GroupType, gender: "Male" as Gender, label: "Long Distance - Male" },
    { group: "LD" as GroupType, gender: "Female" as Gender, label: "Long Distance - Female" },
  ];
}
