// ---- Enums / Literals ----

export type Difficulty = 'easy' | 'medium' | 'hard';

// ---- Core domain models ----

export interface User {
  id: string;
  email: string;
  displayName: string;
  username: string;
  avatarUrl: string | null;
  totalPoints: number;
  booksCompleted: number;
  streakCount: number;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string | null;
  totalPoints: number;
  booksCompleted: number;
}

export type FriendshipStatus = 'none' | 'friends' | 'pending_sent' | 'pending_received';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string | null;
  difficulty: Difficulty;
  description: string;
  pageCount: number;
  questionCount: number;
  isExternal?: boolean;
  externalId?: string;
  readerCount?: number;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  bookId: string;
  text: string;
  options: QuestionOption[];
  correctOptionId?: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
}

export interface QuizSubmission {
  bookId: string;
  answers: QuizAnswer[];
}

export interface QuizResult {
  bookId: string;
  totalQuestions: number;
  correctAnswers: number;
  pointsEarned: number;
  difficulty: Difficulty;
  answers: {
    questionId: string;
    selectedOptionId: string;
    correctOptionId: string;
    isCorrect: boolean;
  }[];
  leveledUp?: boolean;
  newLevel?: number;
  bonusPoints?: number;
  // Engagement bonuses
  isPerfect?: boolean;
  perfectBonus?: number;
  isFirstQuiz?: boolean;
  isDailyBook?: boolean;
  streakCount?: number;
  streakMultiplier?: number;
  combinedMultiplier?: number;
  challengeResult?: ChallengeResult | null;
}

export interface QuizStatus {
  canAttempt: boolean;
  cooldownEndsAt: string | null;
  bestPoints: number;
  isDailyBook?: boolean;
}

export interface Challenge {
  id: string;
  challenger: PublicUser;
  challenged: PublicUser;
  book: { id: string; title: string; author: string; difficulty: Difficulty };
  status: 'pending' | 'accepted' | 'completed' | 'declined' | 'expired';
  challengerScore: number | null;
  challengedScore: number | null;
  winnerId: string | null;
  expiresAt: string;
  createdAt: string;
}

export interface ChallengeResult {
  id: string;
  winnerId: string | null;
  challengerScore: number | null;
  challengedScore: number | null;
}

export interface Achievement {
  id: string;
  icon: string;
  label: string;
  type: 'books' | 'points' | 'streak' | 'perfect';
  req: number;
  unlocked: boolean;
}

export interface AchievementNextHint {
  achievementId: string;
  label: string;
  remaining: number;
  unit: string;
}

export interface Season {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  totalPoints: number;
  booksCompleted: number;
}

// ---- Auth ----

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

// ---- API response wrappers ----

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ---- Navigation param types ----

export type RootStackParamList = {
  Auth: undefined;
  UsernameSetup: undefined;
  Main: undefined;
  BookDetail: { bookId: string };
  Quiz: { bookId: string };
  QuizResult: { result: QuizResult };
  UserProfile: { userId: string };
};

export type MainTabParamList = {
  Catalog: undefined;
  Leaderboard: undefined;
  Friends: undefined;
  Profile: undefined;
};
