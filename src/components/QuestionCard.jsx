import AnswerOption from "./AnswerOption.jsx";
import { formatAnswer } from "../utils/questionUtils.js";

export default function QuestionCard({ question, number, selected, locked, skipped, answer, onToggle }) {
  const correctAnswer = formatAnswer(question, question.correctAnswers);

  return (
    <section className="q-card">
      <div className="q-meta">
        <span className="q-num">Question {number}</span>
        <span className={`q-badge ${question.multiple ? "badge-multi" : "badge-single"}`}>
          {question.multiple ? "Multiple Select" : "Single Select"}
        </span>
      </div>
      {question.multiple && <div className="multi-hint">Select all correct answers</div>}
      <div className="q-text">{question.question}</div>
      <div className="opts-list">
        {question.options.map((option, index) => (
          <AnswerOption
            key={option}
            option={option}
            index={index}
            question={question}
            selected={selected}
            locked={locked}
            onToggle={onToggle}
          />
        ))}
      </div>
      {locked && answer?.isCorrect && (
        <div className="feedback fb-correct show">Correct! {question.correctAnswers.length > 1 ? "All correct options selected." : ""}</div>
      )}
      {locked && !answer?.isCorrect && (
        <div className="feedback fb-wrong show">Incorrect. Correct answer: <strong>{correctAnswer}</strong></div>
      )}
      {!locked && skipped && (
        <div className="feedback fb-partial show">Skipped. Correct answer: <strong>{correctAnswer}</strong></div>
      )}
      {locked && question.explanation && <div className="feedback fb-partial show">{question.explanation}</div>}
    </section>
  );
}
