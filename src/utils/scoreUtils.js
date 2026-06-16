export function calculateResults(questions, answers, skipped) {
  let correct = 0;
  let wrong = 0;
  let skippedCount = 0;

  questions.forEach((_, index) => {
    if (skipped[index]) skippedCount += 1;
    else if (answers[index]?.isCorrect) correct += 1;
    else if (answers[index]) wrong += 1;
    else skippedCount += 1;
  });

  const total = questions.length;
  const percentage = total ? Math.round((correct / total) * 100) : 0;
  return { correct, wrong, skipped: skippedCount, total, percentage };
}

export function performanceClass(percentage) {
  if (percentage >= 80) return "good";
  if (percentage >= 60) return "avg";
  return "low";
}

export function performanceTitle(percentage) {
  if (percentage >= 80) return "Excellent Work!";
  if (percentage >= 60) return "Good Effort!";
  return "Keep Practicing!";
}
