export const LETTERS = ["A", "B", "C", "D", "E", "F"];

export function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function normalizeQuestion(raw, index, courseId) {
  return {
    id: raw.id ?? index + 1,
    courseId,
    question: raw.question ?? raw.q ?? "",
    options: raw.options ?? raw.o ?? [],
    correctAnswers: raw.correctAnswers ?? raw.a ?? [],
    multiple: raw.multiple ?? raw.m ?? false,
    explanation: raw.explanation ?? ""
  };
}

export function sameAnswers(selected = [], correct = []) {
  const sel = [...selected].sort((a, b) => a - b);
  const ans = [...correct].sort((a, b) => a - b);
  return sel.length === ans.length && sel.every((value, index) => value === ans[index]);
}

export function formatAnswer(question, answers = []) {
  if (!answers.length) return "-";
  return answers.map((index) => `${LETTERS[index]}. ${question.options[index]}`).join(", ");
}
