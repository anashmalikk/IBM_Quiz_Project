import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import AppRoutes from "./routes/AppRoutes.jsx";
import { QuizProvider } from "./context/QuizContext.jsx";
import "./styles/global.css";
import "./styles/home.css";
import "./styles/quiz.css";
import "./styles/results.css";

function ErrorFallback({ error }) {
  return (
    <main className="container">
      <div className="empty-state">
        <div className="empty-icon">!</div>
        <div className="empty-txt">Something went wrong: {error.message}</div>
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <QuizProvider>
          <AppRoutes />
        </QuizProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
