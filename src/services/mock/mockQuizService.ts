import { IQuizService } from '../interfaces/quizService';
import { Question, QuizSubmission, QuizResult } from '../../types';
import { mockQuestions, mockBooks } from './mockData';
import { calculatePoints } from '../../utils/scoring';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class MockQuizService implements IQuizService {
  async getQuestions(bookId: string): Promise<Question[]> {
    await delay(500);
    const questions = mockQuestions[bookId];
    if (!questions) {
      throw new Error(`No questions available for book ${bookId}`);
    }
    // Return questions without correctOptionId (simulating server behavior)
    return questions.map(({ correctOptionId: _, ...q }) => q);
  }

  async submitQuiz(submission: QuizSubmission): Promise<QuizResult> {
    await delay(400);
    const questions = mockQuestions[submission.bookId];
    if (!questions) throw new Error(`No questions for book ${submission.bookId}`);

    const book = mockBooks.find((b) => b.id === submission.bookId);
    if (!book) throw new Error(`Book ${submission.bookId} not found`);

    const answersResult = submission.answers.map((answer) => {
      const question = questions.find((q) => q.id === answer.questionId);
      const correctOptionId = question?.correctOptionId ?? '';
      return {
        questionId: answer.questionId,
        selectedOptionId: answer.selectedOptionId,
        correctOptionId,
        isCorrect: answer.selectedOptionId === correctOptionId,
      };
    });

    const correctAnswers = answersResult.filter((a) => a.isCorrect).length;

    return {
      bookId: submission.bookId,
      totalQuestions: questions.length,
      correctAnswers,
      pointsEarned: calculatePoints(book.difficulty, correctAnswers),
      difficulty: book.difficulty,
      answers: answersResult,
    };
  }
}
