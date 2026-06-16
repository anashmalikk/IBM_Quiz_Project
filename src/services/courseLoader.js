import { normalizeQuestion } from "../utils/questionUtils.js";

const topicModules = import.meta.glob("/src/data/courses/*/topic.json", { eager: true });
const questionModules = import.meta.glob("/src/data/courses/*/question.json", { eager: true });

const COURSE_META = {
  "ibm-mat": {
    title: "IBM MAT",
    description: "Multi-topic preparation for web, SAP, and cloud fundamentals.",
    icon: "🎓",
    color: "#0065BD"
  },
  "sap-ux": {
    title: "SAP UX",
    description: "SAP user experience, UI5, Fiori, and OData concepts.",
    icon: "🎨",
    color: "#0065BD"
  },
  "sap-abap": {
    title: "SAP ABAP",
    description: "ABAP syntax, object-oriented programming, and data dictionary basics.",
    icon: "💻",
    color: "#0A6ED1"
  },
  "sap-hana": {
    title: "SAP HANA",
    description: "In-memory database, SQL, modeling, and analytics basics.",
    icon: "🧠",
    color: "#5D36FF"
  },
  "sap-btp": {
    title: "SAP BTP",
    description: "SAP Business Technology Platform foundations, services, and security.",
    icon: "☁️",
    color: "#8E44AD"
  }
};

function moduleData(module) {
  return module.default ?? module;
}

function courseIdFromPath(path) {
  return path.split("/").at(-2);
}

function titleFromSlug(slug) {
  return slug
    .split("-")
    .map((part) => (part.length <= 3 ? part.toUpperCase() : part[0].toUpperCase() + part.slice(1)))
    .join(" ");
}

function getRawTopics(courseId) {
  return moduleData(topicModules[`/src/data/courses/${courseId}/topic.json`] ?? []);
}

function getRawQuestions(courseId) {
  return moduleData(questionModules[`/src/data/courses/${courseId}/question.json`] ?? []);
}

export function loadTopics(courseId) {
  const questions = getRawQuestions(courseId);
  const topics = getRawTopics(courseId);

  return Array.isArray(topics)
    ? topics.map((topic) => {
      const topicQuestions = questions
        .filter((question) => question.t === topic.id)
        .map((question, index) => normalizeQuestion(question, index, courseId));

      return {
        id: topic.id,
        courseId,
        title: topic.label,
        label: topic.label,
        description: topic.desc,
        desc: topic.desc,
        difficulty: topic.difficulty ?? "Practice",
        icon: topic.icon,
        color: topic.color,
        questions: topicQuestions,
        totalQuestions: topicQuestions.length,
        multiSelectCount: topicQuestions.filter((question) => question.multiple).length
      };
    })
    : [];
}

export function loadCourses() {
  return Object.keys(topicModules)
    .map((path) => {
      const id = courseIdFromPath(path);
      const meta = COURSE_META[id] ?? {};
      const topics = loadTopics(id);
      const totalQuestions = getRawQuestions(id).length;

      return {
        id,
        title: meta.title ?? titleFromSlug(id),
        description: meta.description ?? `${titleFromSlug(id)} topic-based quiz practice.`,
        icon: meta.icon ?? "📘",
        color: meta.color ?? "#0065BD",
        topics,
        topicCount: topics.length,
        totalQuestions
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function findCourse(courseId) {
  return loadCourses().find((course) => course.id === courseId);
}

export function findTopic(courseId, topicId) {
  return loadTopics(courseId).find((topic) => topic.id === topicId);
}
