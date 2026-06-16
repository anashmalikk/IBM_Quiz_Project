export default function ProgressBar({ current, total, answered }) {
  const pct = total ? Math.max(2, Math.round((current / total) * 100)) : 2;
  return (
    <div className="progress-wrap">
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="progress-labels">
        <span>{answered} answered</span>
        <span>{total - answered} remaining</span>
      </div>
    </div>
  );
}
