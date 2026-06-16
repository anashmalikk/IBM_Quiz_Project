export default function QuizHeader({ course, topic, correct, attempted, current, total }) {
  return (
    <div className="quiz-header">
      <div className="quiz-topic-badge" style={{ background: topic?.color ?? course.color }}>
        {course.title} / {topic?.title}
      </div>
      <div className="live-score">Score: {correct}/{attempted}</div>
      <div className="quiz-counter">Q {current + 1} / {total}</div>
    </div>
  );
}
