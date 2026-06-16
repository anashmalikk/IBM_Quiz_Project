import { useCallback, useMemo } from "react";
import useLocalStorage from "./useLocalStorage.js";
import {
  HISTORY_KEY,
  LEGACY_HISTORY_KEY,
  readStorage,
  removeStorage,
  writeStorage
} from "../utils/storageUtils.js";

function initialHistory() {
  return readStorage(HISTORY_KEY, readStorage(LEGACY_HISTORY_KEY, []));
}

function normalizeEntry(entry) {
  return {
    courseId: entry.courseId,
    topicId: entry.topicId,
    courseName: entry.courseName ?? entry.topicLabel,
    topicName: entry.topicName ?? entry.topicLabel ?? entry.courseName,
    topicLabel: entry.topicLabel ?? entry.topicName ?? entry.courseName,
    correct: entry.correct,
    wrong: entry.wrong,
    skipped: entry.skipped,
    total: entry.total,
    percentage: entry.percentage ?? entry.percent,
    percent: entry.percent ?? entry.percentage,
    date: entry.date
  };
}

export default function useHistory() {
  const [history, setHistory] = useLocalStorage(HISTORY_KEY, initialHistory());

  const persist = useCallback((nextHistory) => {
    const normalized = nextHistory.map(normalizeEntry);
    setHistory(normalized);
    writeStorage(LEGACY_HISTORY_KEY, normalized);
  }, [setHistory]);

  const addHistoryEntry = useCallback((entry) => {
    persist([normalizeEntry(entry), ...history].slice(0, 100));
  }, [history, persist]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    removeStorage(HISTORY_KEY);
    removeStorage(LEGACY_HISTORY_KEY);
  }, [setHistory]);

  const clearCourseHistory = useCallback((courseId) => {
    persist(history.filter((entry) => entry.courseId !== courseId));
  }, [history, persist]);

  const stats = useMemo(() => {
    const totalAnswered = history.reduce((sum, entry) => sum + entry.total, 0);
    const bestScore = history.length
      ? `${Math.max(...history.map((entry) => Math.round((entry.correct / entry.total) * 100)))}%`
      : "-";
    return { totalAnswered, bestScore, quizCount: history.length };
  }, [history]);

  const getBestScore = useCallback((courseId, topicId) => {
    const entries = history.filter((entry) => {
      if (topicId) return entry.courseId === courseId && entry.topicId === topicId;
      return entry.courseId === courseId;
    });
    if (!entries.length) return null;
    return Math.max(...entries.map((entry) => Math.round((entry.correct / entry.total) * 100)));
  }, [history]);

  return { history, addHistoryEntry, clearHistory, clearCourseHistory, stats, getBestScore };
}
