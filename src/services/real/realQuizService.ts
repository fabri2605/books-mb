import { AxiosInstance } from 'axios';
import { IQuizService } from '../interfaces/quizService';
import { Question, QuizSubmission, QuizResult } from '../../types';

export class RealQuizService implements IQuizService {
  constructor(private client: AxiosInstance) {}

  async getQuestions(bookId: string): Promise<Question[]> {
    const { data } = await this.client.get(`/books/${bookId}/questions`);
    return data;
  }

  async submitQuiz(submission: QuizSubmission): Promise<QuizResult> {
    const { data } = await this.client.post('/quiz/submit', submission);
    return data;
  }
}
