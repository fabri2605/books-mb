import { Question, QuizSubmission, QuizResult } from '../../types';

export interface IQuizService {
  getQuestions(bookId: string): Promise<Question[]>;
  submitQuiz(submission: QuizSubmission): Promise<QuizResult>;
}
