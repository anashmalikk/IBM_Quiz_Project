import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateResults } from "../utils/scoreUtils.js";
import { sameAnswers, shuffle } from "../utils/questionUtils.js";
import { QUIZ_STATE_KEY, readStorage, removeStorage, writeStorage } from "../utils/storageUtils.js";
import useHistory from "../hooks/useHistory.js";

const QuizContext = createContext(null);

const emptyQuiz = {
  course: null,
  topic: null,
  questions: [],
  currentQuestion: 0,
  selectedAnswers: {},
  skippedQuestions: {},
  lockedQuestions: {},
  mode: "20",
  completed: false,
  results: null
};

function normalizeMode(mode) {
  return ["20", "50", "all"].includes(String(mode)) ? String(mode) : "all";
}

export function QuizProvider({ children }) {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(() => readStorage(QUIZ_STATE_KEY, emptyQuiz));
  const historyApi = useHistory();
  const { addHistoryEntry } = historyApi;

  useEffect(() => {
    writeStorage(QUIZ_STATE_KEY, quiz);
  }, [quiz]);

  const startQuiz = useCallback((course, topic, mode = "all", options = {}) => {
    const selectedMode = normalizeMode(mode);
    const shuffled = shuffle(topic.questions);
    const questions = selectedMode === "all" ? shuffled : shuffled.slice(0, Math.min(Number(selectedMode), shuffled.length));

    const nextQuiz = {
      ...emptyQuiz,
      course,
      topic,
      questions,
      mode: selectedMode
    };

    setQuiz(nextQuiz);
    navigate(`/course/${course.id}/topic/${topic.id}/${selectedMode}`, { replace: Boolean(options.replace) });
  }, [navigate]);

  const retryQuiz = useCallback(() => {
    if (quiz.course && quiz.topic) startQuiz(quiz.course, quiz.topic, quiz.mode);
  }, [quiz.course, quiz.mode, quiz.topic, startQuiz]);

  const resetQuiz = useCallback(() => {
    setQuiz(emptyQuiz);
    removeStorage(QUIZ_STATE_KEY);
  }, []);

  const checkAnswer = useCallback((questionIndex) => {
    setQuiz((current) => {
      const question = current.questions[questionIndex];
      const answer = current.selectedAnswers[questionIndex];
      if (!question || !answer?.selected?.length) return current;

      return {
        ...current,
        selectedAnswers: {
          ...current.selectedAnswers,
          [questionIndex]: {
            ...answer,
            isCorrect: sameAnswers(answer.selected, question.correctAnswers)
          }
        },
        lockedQuestions: { ...current.lockedQuestions, [questionIndex]: true }
      };
    });
  }, []);

  const toggleAnswer = useCallback((optionIndex) => {
    const indexToCheck = quiz.currentQuestion;
    const question = quiz.questions[indexToCheck];
    if (!question || quiz.lockedQuestions[indexToCheck] || quiz.skippedQuestions[indexToCheck]) return;

    if (!question.multiple) {
      const isCorrect = sameAnswers([optionIndex], question.correctAnswers);
      setQuiz((current) => ({
        ...current,
        selectedAnswers: {
          ...current.selectedAnswers,
          [indexToCheck]: { selected: [optionIndex], isCorrect }
        },
        lockedQuestions: { ...current.lockedQuestions, [indexToCheck]: true }
      }));
      return;
    }

    setQuiz((current) => {
      const currentAnswer = current.selectedAnswers[indexToCheck] ?? { selected: [], isCorrect: false };
      const selected = currentAnswer.selected.includes(optionIndex)
        ? currentAnswer.selected.filter((item) => item !== optionIndex)
        : [...currentAnswer.selected, optionIndex];

      return {
        ...current,
        selectedAnswers: {
          ...current.selectedAnswers,
          [indexToCheck]: { selected, isCorrect: false }
        }
      };
    });
  }, [quiz.currentQuestion, quiz.lockedQuestions, quiz.questions, quiz.skippedQuestions]);

  const skipQuestion = useCallback(() => {
    setQuiz((current) => ({
      ...current,
      skippedQuestions: { ...current.skippedQuestions, [current.currentQuestion]: true }
    }));
  }, []);

  const previousQuestion = useCallback(() => {
    setQuiz((current) => ({
      ...current,
      currentQuestion: Math.max(0, current.currentQuestion - 1)
    }));
  }, []);

  const finishQuiz = useCallback(() => {
    if (!quiz.course || !quiz.topic) return;
    const results = calculateResults(quiz.questions, quiz.selectedAnswers, quiz.skippedQuestions);
    addHistoryEntry({
      courseId: quiz.course.id,
      courseName: quiz.course.title,
      topicId: quiz.topic.id,
      topicName: quiz.topic.title,
      correct: results.correct,
      wrong: results.wrong,
      skipped: results.skipped,
      total: results.total,
      percentage: results.percentage,
      date: new Date().toLocaleDateString()
    });
    setQuiz((current) => ({ ...current, completed: true, results }));
    navigate(`/results/${quiz.course.id}/${quiz.topic.id}/${quiz.mode}`);
  }, [addHistoryEntry, navigate, quiz.course, quiz.mode, quiz.questions, quiz.selectedAnswers, quiz.skippedQuestions, quiz.topic]);

  const nextQuestion = useCallback(() => {
    const question = quiz.questions[quiz.currentQuestion];
    if (!question) return;

    if (question.multiple && !quiz.lockedQuestions[quiz.currentQuestion] && !quiz.skippedQuestions[quiz.currentQuestion]) {
      if (quiz.selectedAnswers[quiz.currentQuestion]?.selected?.length) {
        checkAnswer(quiz.currentQuestion);
      } else if (window.confirm("You have not selected any answers. Skip this question?")) {
        skipQuestion();
      }
      return;
    }

    if (quiz.currentQuestion < quiz.questions.length - 1) {
      setQuiz((current) => ({ ...current, currentQuestion: current.currentQuestion + 1 }));
    } else {
      finishQuiz();
    }
  }, [checkAnswer, finishQuiz, quiz, skipQuestion]);

  const value = useMemo(() => ({
    quiz,
    ...historyApi,
    startQuiz,
    retryQuiz,
    resetQuiz,
    toggleAnswer,
    checkAnswer,
    skipQuestion,
    previousQuestion,
    nextQuestion,
    finishQuiz
  }), [
    checkAnswer,
    finishQuiz,
    historyApi,
    nextQuestion,
    previousQuestion,
    quiz,
    resetQuiz,
    retryQuiz,
    skipQuestion,
    startQuiz,
    toggleAnswer
  ]);

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuizContext() {
  const value = useContext(QuizContext);
  if (!value) throw new Error("useQuizContext must be used inside QuizProvider");
  return value;
}
