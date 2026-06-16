export const HISTORY_KEY = "quizHistory";
export const LEGACY_HISTORY_KEY = "sapQuizHistory";
export const QUIZ_STATE_KEY = "quizState";

export function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorage(key) {
  localStorage.removeItem(key);
}
