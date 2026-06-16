import { useState } from "react";
import { formatAnswer } from "../utils/questionUtils.js";

const filters = [
  ["all", "All"],
  ["wrong", "Wrong Only"],
  ["correct", "Correct Only"],
  ["skipped", "Skipped"]
];

export default function ReviewList({ questions, selectedAnswers, skippedQuestions }) {
  const [filter, setFilter] = useState("all");

  const visibleQuestions = questions
    .map((question, index) => ({ question, index, skipped: skippedQuestions[index], answer: selectedAnswers[index] }))
    .filter(({ skipped, answer }) => {
      const isCorrect = answer?.isCorrect;
      if (filter === "correct") return isCorrect;
      if (filter === "wrong") return !isCorrect && !skipped;
      if (filter === "skipped") return skipped;
      return true;
    });

  return (
    <section className="review-card">
      <div className="review-head">
        <strong>Review Answers</strong>
      </div>
      <div className="review-filters">
        {filters.map(([value, label]) => (
          <button
            key={value}
            className={`chip ${filter === value ? "active" : ""}`}
            type="button"
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
      {!visibleQuestions.length ? (
        <div className="empty-state">No questions match this filter.</div>
      ) : (
        visibleQuestions.map(({ question, index, skipped, answer }) => {
          const statusClass = skipped ? "ri-skipped" : answer?.isCorrect ? "ri-correct" : "ri-wrong";
          const statusText = skipped ? "Skipped" : answer?.isCorrect ? "Correct" : "Wrong";
          return (
            <article className="review-item" key={question.id}>
              <div className="ri-meta">
                <span className="ri-num">Q{index + 1}</span>
                <span className={`ri-status ${statusClass}`}>{statusText}</span>
              </div>
              <div className="ri-q">{question.question}</div>
              {!skipped && <div className="ri-ans ri-your">Your Answer: {formatAnswer(question, answer?.selected)}</div>}
              <div className="ri-ans ri-correct-ans">Correct Answer: {formatAnswer(question, question.correctAnswers)}</div>
            </article>
          );
        })
      )}
    </section>
  );
}
