import { Difficulty } from '../types';

export const POINTS_PER_CORRECT: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export function calculatePoints(difficulty: Difficulty, correctAnswers: number): number {
  return POINTS_PER_CORRECT[difficulty] * correctAnswers;
}

// ---------- Level colour palette ----------

export interface LevelColor {
  /** Primary/background colour for the level badge and XP bar. */
  bg: string;
  /** Lighter accent used for text on dark backgrounds. */
  accent: string;
  /** Human-readable tier label. */
  label: string;
}

const LEVEL_PALETTE: LevelColor[] = [
  { bg: '#6b7280', accent: '#d1d5db', label: 'Principiante' }, // 1 — gray
  { bg: '#4a7c5f', accent: '#6fcf97', label: 'Aprendiz' },     // 2 — green
  { bg: '#0d9488', accent: '#5eead4', label: 'Estudioso' },    // 3 — teal
  { bg: '#2563eb', accent: '#93c5fd', label: 'Lector' },       // 4 — blue
  { bg: '#7c3aed', accent: '#c4b5fd', label: 'Avanzado' },     // 5 — violet
  { bg: '#db2777', accent: '#f9a8d4', label: 'Experto' },      // 6 — pink
  { bg: '#dc2626', accent: '#fca5a5', label: 'Maestro' },      // 7 — red
  { bg: '#ea580c', accent: '#fdba74', label: 'Sabio' },        // 8 — orange
  { bg: '#d97706', accent: '#fcd34d', label: 'Erudito' },      // 9 — amber
  { bg: '#b45309', accent: '#f5a623', label: 'Leyenda' },      // 10+ — gold
];

/** Returns the colour theme for a given level (1-indexed, caps at last entry). */
export function getLevelColor(level: number): LevelColor {
  const idx = Math.min(level - 1, LEVEL_PALETTE.length - 1);
  return LEVEL_PALETTE[Math.max(0, idx)];
}

// ------------------------------------------

/** XP required to advance from level N to level N+1 (quadratic curve). */
function xpToNextLevel(level: number): number {
  return 25 * level * level;
}

export interface LevelInfo {
  level: number;
  /** 0–1 progress within the current level */
  xpProgress: number;
  /** raw XP accumulated inside the current level */
  xpInLevel: number;
  /** XP required to complete the current level */
  xpForNext: number;
}

/**
 * Derive level, progress and XP thresholds from a total points value.
 *
 * Progression:
 *   Lv 1 → 2 :  25 pts  (25 × 1²)
 *   Lv 2 → 3 : 100 pts  (25 × 2²)
 *   Lv 3 → 4 : 225 pts  (25 × 3²)
 *   Lv 4 → 5 : 400 pts  (25 × 4²)  … and so on.
 */
export function getLevelInfo(totalPoints: number): LevelInfo {
  let level = 1;
  let accumulated = 0;
  while (true) {
    const needed = xpToNextLevel(level);
    if (accumulated + needed > totalPoints) {
      const xpInLevel = totalPoints - accumulated;
      return { level, xpProgress: xpInLevel / needed, xpInLevel, xpForNext: needed };
    }
    accumulated += needed;
    level++;
  }
}
