import { Navigate, useNavigate, useParams } from "react-router-dom";
import HistoryPanel from "../components/HistoryPanel.jsx";
import NavBar from "../components/NavBar.jsx";
import TopicCard from "../components/TopicCard.jsx";
import useQuiz from "../hooks/useQuiz.js";
import { findCourse, loadTopics } from "../services/courseLoader.js";

export default function Course() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { startQuiz, history, getBestScore, clearCourseHistory } = useQuiz();
  const course = findCourse(courseId);
  const topics = loadTopics(courseId);
  const courseHistory = history.filter((entry) => entry.courseId === courseId);

  if (!course) return <Navigate to="/" replace />;

  function handleClearHistory() {
    if (window.confirm(`Clear quiz history for ${course.title}?`)) clearCourseHistory(course.id);
  }

  return (
    <>
      <NavBar />
      <main>
        <section className="hero course-hero">
          <h1>{course.icon} <em>{course.title}</em></h1>
          <p>{course.description}</p>
          <div className="hero-stats">
            <div className="hstat">
              <div className="hstat-num">{topics.length}</div>
              <div className="hstat-lbl">Topics</div>
            </div>
            <div className="hstat">
              <div className="hstat-num">{course.totalQuestions}</div>
              <div className="hstat-lbl">Questions</div>
            </div>
          </div>
        </section>
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-title">Choose a Topic</div>
              <div className="section-hint">Start a quiz from one topic inside this course.</div>
            </div>
            <button className="btn btn-ghost btn-sm" type="button" onClick={() => navigate("/")}>
              ← Courses
            </button>
          </div>
          <div className="topics-grid topic-quiz-grid">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                bestScore={getBestScore(course.id, topic.id)}
                onStart={(topicId, mode) => startQuiz(course, topic, mode)}
              />
            ))}
          </div>
          <HistoryPanel history={courseHistory} courses={[course]} onClear={handleClearHistory} />
        </div>
      </main>
    </>
  );
}
