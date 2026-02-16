import { MockAuthService } from './mock/mockAuthService';
import { MockBookService } from './mock/mockBookService';
import { MockQuizService } from './mock/mockQuizService';
import { MockUserService } from './mock/mockUserService';
import { MockLeaderboardService } from './mock/mockLeaderboardService';

export const authService = new MockAuthService();
export const bookService = new MockBookService();
export const quizService = new MockQuizService();
export const userService = new MockUserService();
export const leaderboardService = new MockLeaderboardService();
