export default function CourseCard({ course, onOpen }) {
  return (
    <article className="topic-card">
      <div className="topic-bar" style={{ background: course.color }} />
      <div className="topic-body">
        <div className="topic-icon-row">
          <div className="topic-icon">{course.icon}</div>
          <div className="topic-title">{course.title}</div>
        </div>
        <div className="topic-desc">{course.description}</div>
        <div className="topic-meta">
          <span>{course.topicCount} Topics</span>
          <span>{course.totalQuestions} Questions</span>
        </div>
        <button
          className="btn btn-primary start-btn"
          type="button"
          style={{ background: course.color }}
          onClick={() => onOpen(course.id)}
          disabled={!course.topicCount}
        >
          Open Course →
        </button>
      </div>
    </article>
  );
}
