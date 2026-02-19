import apiClient from './api/client';
import { RealAuthService } from './real/realAuthService';
import { RealBookService } from './real/realBookService';
import { RealQuizService } from './real/realQuizService';
import { RealUserService } from './real/realUserService';
import { RealLeaderboardService } from './real/realLeaderboardService';

export const authService = new RealAuthService(apiClient);
export const bookService = new RealBookService(apiClient);
export const quizService = new RealQuizService(apiClient);
export const userService = new RealUserService(apiClient);
export const leaderboardService = new RealLeaderboardService(apiClient);
