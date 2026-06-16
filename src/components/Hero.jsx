export default function Hero({ stats }) {
  return (
    <section className="hero">
      <h1>IBM MAT Preparation <em>Quiz</em></h1>
      <p>Practice certification-style questions, track your progress, and improve your exam readiness across multiple topics.</p>
      <div className="hero-stats">
        <div className="hstat">
          <div className="hstat-num">{stats.totalCourses}</div>
          <div className="hstat-lbl">Total Courses</div>
        </div>
        {typeof stats.totalTopics === "number" && (
          <div className="hstat">
            <div className="hstat-num">{stats.totalTopics}</div>
            <div className="hstat-lbl">Total Topics</div>
          </div>
        )}
        <div className="hstat">
          <div className="hstat-num">{stats.totalQuestions}</div>
          <div className="hstat-lbl">Total Questions</div>
        </div>
        <div className="hstat">
          <div className="hstat-num">{stats.quizCount}</div>
          <div className="hstat-lbl">Quizzes Taken</div>
        </div>
      </div>
    </section>
  );
}
