import { Difficulty } from '../types';

export const POINTS_PER_CORRECT: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export function calculatePoints(difficulty: Difficulty, correctAnswers: number): number {
  return POINTS_PER_CORRECT[difficulty] * correctAnswers;
}
