import { performanceClass } from "../utils/scoreUtils.js";

export default function HistoryPanel({ history, courses, onClear }) {
  return (
    <section className="history-section">
      <div className="history-head">
        <div className="history-title">Recent Quiz History</div>
        {history.length > 0 && (
          <button className="btn btn-danger btn-sm" type="button" onClick={onClear}>
            Clear History
          </button>
        )}
      </div>
      <div className="history-list">
        {!history.length ? (
          <div className="empty-state">
            <div className="empty-icon">?</div>
            <div className="empty-txt">No quizzes taken yet. Start one above!</div>
          </div>
        ) : (
          history.slice(0, 15).map((entry, index) => {
            const pct = Math.round((entry.correct / entry.total) * 100);
            const course = courses.find((item) => item.id === entry.courseId);
            return (
              <div className={`hist-item hi-${performanceClass(pct)}`} key={`${entry.courseId}-${entry.date}-${index}`}>
                <div className="hist-topic">{course?.icon} {entry.courseName} / {entry.topicName ?? entry.topicLabel}</div>
                <div className="hist-right">
                  <span className="hist-q">{entry.correct}/{entry.total}</span>
                  <span className="hist-score">{pct}%</span>
                  <span className="hist-date">{entry.date}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
