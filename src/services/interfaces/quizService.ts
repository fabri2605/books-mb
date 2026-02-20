import { Question, QuizSubmission, QuizResult, QuizStatus } from '../../types';

export interface IQuizService {
  getQuestions(bookId: string): Promise<Question[]>;
  submitQuiz(submission: QuizSubmission): Promise<QuizResult>;
  getQuizStatus(bookId: string): Promise<QuizStatus>;
}
