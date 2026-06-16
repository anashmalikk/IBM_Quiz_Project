import { useState } from "react";

export default function TopicCard({ topic, bestScore, onStart }) {
  const [mode, setMode] = useState("20");
  const quickCount = Math.min(20, topic.totalQuestions);
  const standardCount = Math.min(50, topic.totalQuestions);
  const modeOptions = [
    ["20", `Quick (${quickCount} Q)`],
    ["50", `Standard (${standardCount} Q)`],
    ["all", `All (${topic.totalQuestions} Q)`]
  ];

  return (
    <article className="topic-card quiz-topic-card">
      <div className="topic-bar" style={{ background: topic.color }} />
      <div className="topic-body">
        <div className="topic-icon-row">
          <div className="topic-icon">{topic.icon}</div>
          <div className="topic-title">{topic.title}</div>
        </div>
        <div className="topic-desc">{topic.description}</div>
        <div className="topic-meta">
          <span>{topic.totalQuestions} questions</span>
          <span>{topic.multiSelectCount} multi-select</span>
        </div>
        {bestScore !== null ? (
          <div className="topic-best">
            <span className="best-label">Best: <strong>{bestScore}%</strong></span>
            <div className="best-bar-wrap">
              <div
                className="best-bar"
                style={{
                  width: `${bestScore}%`,
                  background: bestScore >= 80 ? "var(--green)" : bestScore >= 60 ? "var(--gold)" : "var(--red)"
                }}
              />
            </div>
          </div>
        ) : (
          <div className="topic-best topic-best-empty" />
        )}
        <div className="mode-chips" aria-label={`Question count for ${topic.title}`}>
          {modeOptions.map(([value, label]) => (
            <button
              key={value}
              className={`chip mode-chip ${mode === value ? "active" : ""}`}
              type="button"
              onClick={() => setMode(value)}
              disabled={!topic.totalQuestions}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          className="btn btn-primary start-btn"
          type="button"
          style={{ background: topic.color }}
          onClick={() => onStart(topic.id, mode)}
          disabled={!topic.totalQuestions}
        >
          Start Quiz →
        </button>
      </div>
    </article>
  );
}
