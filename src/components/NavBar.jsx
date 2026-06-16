import { useNavigate } from "react-router-dom";
import useQuiz from "../hooks/useQuiz.js";

export default function NavBar() {
  const navigate = useNavigate();
  const { quiz, resetQuiz } = useQuiz();
  const showHomeButton = quiz.course && !quiz.completed;

  function goHome() {
    const hasProgress = Object.keys(quiz.selectedAnswers).length > 0 || Object.keys(quiz.skippedQuestions).length > 0;
    if (hasProgress && !window.confirm("Quit this quiz? Your progress is saved, but you will leave the quiz screen.")) return;
    resetQuiz();
    navigate("/");
  }

  return (
    <nav className="nav">
      <div className="nav-logo">SAP <span>Quiz Master</span></div>
      <div className="nav-sub">Certification Practice</div>
      <div className="nav-right">
        {showHomeButton && (
          <button className="nav-btn" type="button" onClick={goHome}>
            Home
          </button>
        )}
      </div>
    </nav>
  );
}
