import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/CourseCard.jsx";
import Hero from "../components/Hero.jsx";
import HistoryPanel from "../components/HistoryPanel.jsx";
import NavBar from "../components/NavBar.jsx";
import useQuiz from "../hooks/useQuiz.js";
import { loadCourses } from "../services/courseLoader.js";

export default function Home() {
  const navigate = useNavigate();
  const courses = loadCourses();
  const { history, stats, clearHistory, resetQuiz } = useQuiz();
  const dashboardStats = {
    totalCourses: courses.length,
    totalTopics: courses.reduce((sum, course) => sum + course.topicCount, 0),
    totalQuestions: courses.reduce((sum, course) => sum + course.totalQuestions, 0),
    quizCount: stats.quizCount
  };

  useEffect(() => {
    resetQuiz();
  }, [resetQuiz]);

  function handleClearHistory() {
    if (window.confirm("Clear all quiz history?")) clearHistory();
  }

  return (
    <>
      <NavBar />
      <main>
        <Hero stats={dashboardStats} />
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-title">Choose a Course</div>
              <div className="section-hint">New folders in local JSON data appear here automatically.</div>
            </div>
          </div>
          <div className="topics-grid">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onOpen={(courseId) => navigate(`/course/${courseId}`)}
              />
            ))}
          </div>
          <HistoryPanel history={history} courses={courses} onClear={handleClearHistory} />
        </div>
      </main>
    </>
  );
}
