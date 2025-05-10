import { questions as defaultQuestions } from "./questions"

export function getQuestions() {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    // Try to get admin-edited questions from localStorage
    const savedQuestions = localStorage.getItem("adminQuestions")
    if (savedQuestions) {
      return JSON.parse(savedQuestions)
    }
  }

  // Fall back to default questions
  return defaultQuestions
}
