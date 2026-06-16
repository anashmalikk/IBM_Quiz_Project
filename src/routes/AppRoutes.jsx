import { Navigate, Route, Routes } from "react-router-dom";
import Course from "../pages/Course.jsx";
import Home from "../pages/Home.jsx";
import Quiz from "../pages/Quiz.jsx";
import Results from "../pages/Results.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/course/:courseId" element={<Course />} />
      <Route path="/course/:courseId/topic/:topicId" element={<Quiz />} />
      <Route path="/results/:courseId/:topicId" element={<Results />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
