import { useState, useEffect } from 'react';
import { Question, QuizAnswer, QuizResult } from '../types';
import { quizService } from '../services';

export function useQuiz(bookId: string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    quizService.getQuestions(bookId).then((qs) => {
      setQuestions(qs);
      setLoading(false);
    });
  }, [bookId]);

  const currentQuestion = questions[currentIndex] ?? null;
  const selectedOptionId = currentQuestion ? (answers.get(currentQuestion.id) ?? null) : null;
  const isLastQuestion = currentIndex === questions.length - 1;
  const canGoNext = selectedOptionId !== null;

  function selectAnswer(optionId: string) {
    if (!currentQuestion) return;
    setAnswers((prev) => new Map(prev).set(currentQuestion.id, optionId));
  }

  function nextQuestion() {
    if (!isLastQuestion) {
      setCurrentIndex((i) => i + 1);
    }
  }

  function prevQuestion() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }

  async function submitQuiz(): Promise<QuizResult> {
    setSubmitting(true);
    const quizAnswers: QuizAnswer[] = questions.map((q) => ({
      questionId: q.id,
      selectedOptionId: answers.get(q.id) ?? '',
    }));
    const res = await quizService.submitQuiz({ bookId, answers: quizAnswers });
    setResult(res);
    setSubmitting(false);
    return res;
  }

  return {
    questions,
    currentQuestion,
    currentIndex,
    selectedOptionId,
    isLastQuestion,
    canGoNext,
    loading,
    submitting,
    result,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    submitQuiz,
  };
}
