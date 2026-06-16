import { performanceClass } from "../utils/scoreUtils.js";

export default function ResultRing({ percentage }) {
  return <div className={`score-ring ring-${performanceClass(percentage)}`}>{percentage}%</div>;
}
