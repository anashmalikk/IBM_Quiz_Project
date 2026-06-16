import { Navigate, useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import ResultRing from "../components/ResultRing.jsx";
import ReviewList from "../components/ReviewList.jsx";
import useQuiz from "../hooks/useQuiz.js";
import { calculateResults, performanceTitle } from "../utils/scoreUtils.js";

export default function Results() {
  const { courseId, topicId } = useParams();
  const navigate = useNavigate();
  const { quiz, retryQuiz, resetQuiz } = useQuiz();

  if (!quiz.course || !quiz.topic || quiz.course.id !== courseId || quiz.topic.id !== topicId) {
    return <Navigate to="/" replace />;
  }

  const results = quiz.results ?? calculateResults(quiz.questions, quiz.selectedAnswers, quiz.skippedQuestions);

  function goHome() {
    resetQuiz();
    navigate("/");
  }

  return (
    <>
      <NavBar />
      <main className="results-wrap">
        <section className="score-hero">
          <ResultRing percentage={results.percentage} />
          <div className="score-title">{performanceTitle(results.percentage)}</div>
          <div className="score-subtitle">{quiz.course.title} / {quiz.topic.title}</div>
          <div className="score-grid">
            <div className="sg-item correct">
              <div className="sg-num">{results.correct}</div>
              <div className="sg-lbl">Correct</div>
            </div>
            <div className="sg-item wrong">
              <div className="sg-num">{results.wrong}</div>
              <div className="sg-lbl">Wrong</div>
            </div>
            <div className="sg-item skipped">
              <div className="sg-num">{results.skipped}</div>
              <div className="sg-lbl">Skipped</div>
            </div>
          </div>
        </section>
        <div className="results-actions">
          <button className="btn btn-ghost" type="button" onClick={goHome}>← Home</button>
          <button className="btn btn-primary" type="button" onClick={retryQuiz}>Retry Topic</button>
        </div>
        <ReviewList
          questions={quiz.questions}
          selectedAnswers={quiz.selectedAnswers}
          skippedQuestions={quiz.skippedQuestions}
        />
      </main>
    </>
  );
}
