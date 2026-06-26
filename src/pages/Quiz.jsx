import { useEffect } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import ProgressBar from "../components/ProgressBar.jsx";
import QuestionCard from "../components/QuestionCard.jsx";
import QuizHeader from "../components/QuizHeader.jsx";
import useQuiz from "../hooks/useQuiz.js";
import { findCourse, findTopic } from "../services/courseLoader.js";

export default function Quiz() {
  const { courseId, topicId, mode: routeMode } = useParams();
  const [searchParams] = useSearchParams();
  const { quiz, startQuiz, toggleAnswer, skipQuestion, previousQuestion, nextQuestion } = useQuiz();
  const course = findCourse(courseId);
  const topic = findTopic(courseId, topicId);
  const question = quiz.questions[quiz.currentQuestion];
  const mode = ["20", "50", "all"].includes(routeMode) ? routeMode : ["20", "50", "all"].includes(searchParams.get("mode")) ? searchParams.get("mode") : "all";

  useEffect(() => {
    if (!course || !topic) return;
    if (quiz.course?.id === courseId && quiz.topic?.id === topicId && quiz.mode === mode && quiz.questions.length) return;
    startQuiz(course, topic, mode, { replace: true });
  }, [course, courseId, mode, quiz.course?.id, quiz.mode, quiz.questions.length, quiz.topic?.id, startQuiz, topic, topicId]);

  useEffect(() => {
    function handleKeys(event) {
      if (event.key === "ArrowRight") nextQuestion();
      if (event.key === "ArrowLeft") previousQuestion();
    }

    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [nextQuestion, previousQuestion]);

  if (!course || !topic) return <Navigate to="/" replace />;
  if (!quiz.course || quiz.course.id !== courseId || quiz.topic?.id !== topicId || !question) {
    return (
      <>
        <NavBar />
        <main className="quiz-wrap">
          <div className="empty-state">Loading quiz...</div>
        </main>
      </>
    );
  }

  const answer = quiz.selectedAnswers[quiz.currentQuestion];
  const selected = answer?.selected ?? [];
  const locked = Boolean(quiz.lockedQuestions[quiz.currentQuestion]);
  const skipped = Boolean(quiz.skippedQuestions[quiz.currentQuestion]);
  const answered = Object.keys(quiz.selectedAnswers).length + Object.keys(quiz.skippedQuestions).length;
  const correct = Object.values(quiz.selectedAnswers).filter((item) => item.isCorrect).length;
  const attempted = Object.keys(quiz.selectedAnswers).length;

  return (
    <>
      <NavBar />
      <main className="quiz-wrap">
        <QuizHeader
          course={quiz.course}
          topic={quiz.topic}
          correct={correct}
          attempted={attempted}
          current={quiz.currentQuestion}
          total={quiz.questions.length}
        />
        <ProgressBar current={quiz.currentQuestion} total={quiz.questions.length} answered={answered} />
        <QuestionCard
          question={question}
          number={quiz.currentQuestion + 1}
          selected={selected}
          locked={locked}
          skipped={skipped}
          answer={answer}
          onToggle={toggleAnswer}
        />
        <div className="quiz-nav">
          {!locked && !skipped && (
            <button className="skip-link" type="button" onClick={skipQuestion}>
              Skip this question
            </button>
          )}
          <div className="quiz-nav-buttons">
            <button className="btn btn-ghost btn-sm" type="button" disabled={quiz.currentQuestion === 0} onClick={previousQuestion}>
              ← Prev
            </button>
            <button className="btn btn-primary btn-sm" type="button" onClick={nextQuestion}>
              {quiz.currentQuestion === quiz.questions.length - 1 ? "Finish Quiz ✓" : "Next →"}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
