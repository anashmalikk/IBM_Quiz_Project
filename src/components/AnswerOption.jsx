import { LETTERS } from "../utils/questionUtils.js";

export default function AnswerOption({ option, index, question, selected, locked, onToggle }) {
  const isSelected = selected.includes(index);
  const isCorrect = question.correctAnswers.includes(index);
  let className = "opt";

  if (!locked && isSelected) className += " sel";
  if (locked && isCorrect && isSelected) className += " correct locked";
  else if (locked && isCorrect && !isSelected) className += " missed locked";
  else if (locked && !isCorrect && isSelected) className += " wrong locked";
  else if (locked) className += " locked";

  return (
    <button className={className} type="button" onClick={() => !locked && onToggle(index)}>
      <span className={question.multiple ? "opt-cb" : "opt-rb"}>{question.multiple && isSelected ? "✓" : ""}</span>
      <span className="opt-letter">{LETTERS[index]}.</span>
      <span className="opt-text">{option}</span>
    </button>
  );
}
