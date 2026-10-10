const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1").replace(/\/$/, "");
const TOKEN_KEY = "smartgrade_token";

export type Role = "STUDENT" | "PROFESSOR";
export interface User { id: number; name: string; email: string; role: Role; createdAt?: string; }
export interface AuthResponse { token: string; user: User; }
export interface Subject { id: number; name: string; code?: string; description?: string; }
export interface ClassRecord { id: number; name: string; section?: string; subjectId: number; professorId?: number; }
export interface Assignment { id: number; classId: number; title: string; description?: string; instructions?: string; totalMarks: number; dueDate?: string; status: "DRAFT" | "ACTIVE" | "CLOSED" | "GRADED"; }
export interface Question { id: number; assignmentId: number; questionNumber: number; questionText: string; maxMarks: number; expectedAnswer?: string; markingCriteria?: string; }
export interface Submission { id: number; assignmentId: number; studentId: number; status: string; submittedAt?: string; fileName?: string; }
export interface StudentAnswer { id: number; submissionId: number; questionId: number; answerText?: string; }
export interface Evaluation { id: number; answerId: number; aiScore: number; confidenceScore?: number | null; evaluation?: string; feedback?: string | null; evaluatedAt?: string; }
export interface Grade { id: number; answerId: number; aiScore?: number; teacherScore?: number; finalScore?: number; teacherFeedback?: string; overridden?: boolean; }
export interface Feedback { id: number; answerId: number; feedbackType: "AI" | "TEACHER"; feedbackText: string; }

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; this.name = "ApiError"; }
}

export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response: Response;
  try { response = await fetch(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`, { ...options, headers }); }
  catch { throw new ApiError(0, "Unable to reach the server. Check that the backend is running."); }
  if (!response.ok) {
    const messages: Record<number, string> = { 400: "Please check the information and try again.", 401: "Your session has expired. Please sign in again.", 403: "You do not have permission to do that.", 404: "The requested item was not found.", 409: "This item already exists or conflicts with another request.", 500: "The server encountered an error. Please try again later.", 502: "The AI grading service failed to return a valid result. No score was generated.", 503: "The AI grading service is unavailable. No score was generated.", 504: "The AI grading service timed out. No score was generated." };
    if (response.status === 401 && token) window.dispatchEvent(new Event("smartgrade:unauthorized"));
    let message = messages[response.status] || `Request failed (${response.status}).`;
    try { const body = await response.json(); if (typeof body.message === "string" && response.status < 500) message = body.message; } catch { /* response has no JSON body */ }
    throw new ApiError(response.status, message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

const json = (method: string, body?: unknown): RequestInit => ({ method, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
export const api = {
  health: () => apiRequest<{ status: string }>("/health"),
  register: (data: { name: string; email: string; password: string; role: Role }) => apiRequest<AuthResponse>("/auth/register", json("POST", data)),
  login: (data: { email: string; password: string }) => apiRequest<AuthResponse>("/auth/login", json("POST", data)),
  me: () => apiRequest<User>("/users/me"),
  subjects: { list: () => apiRequest<Subject[]>("/subjects"), create: (data: unknown) => apiRequest<Subject>("/subjects", json("POST", data)), get: (id: number) => apiRequest<Subject>(`/subjects/${id}`), update: (id: number, data: unknown) => apiRequest<Subject>(`/subjects/${id}`, json("PUT", data)), remove: (id: number) => apiRequest<void>(`/subjects/${id}`, json("DELETE")) },
  classes: { list: () => apiRequest<ClassRecord[]>("/classes"), create: (data: unknown) => apiRequest<ClassRecord>("/classes", json("POST", data)), get: (id: number) => apiRequest<ClassRecord>(`/classes/${id}`), update: (id: number, data: unknown) => apiRequest<ClassRecord>(`/classes/${id}`, json("PUT", data)), remove: (id: number) => apiRequest<void>(`/classes/${id}`, json("DELETE")), students: (id: number) => apiRequest<User[]>(`/classes/${id}/students`), addStudent: (classId: number, studentId: number) => apiRequest<void>(`/classes/${classId}/students/${studentId}`, json("POST")), removeStudent: (classId: number, studentId: number) => apiRequest<void>(`/classes/${classId}/students/${studentId}`, json("DELETE")) },
  assignments: { list: () => apiRequest<Assignment[]>("/assignments"), create: (data: unknown) => apiRequest<Assignment>("/assignments", json("POST", data)), get: (id: number) => apiRequest<Assignment>(`/assignments/${id}`), update: (id: number, data: unknown) => apiRequest<Assignment>(`/assignments/${id}`, json("PUT", data)), remove: (id: number) => apiRequest<void>(`/assignments/${id}`, json("DELETE")), publish: (id: number) => apiRequest<Assignment>(`/assignments/${id}/publish`, json("POST")), close: (id: number) => apiRequest<Assignment>(`/assignments/${id}/close`, json("POST")), questions: (id: number) => apiRequest<Question[]>(`/assignments/${id}/questions`), addQuestion: (id: number, data: unknown) => apiRequest<Question>(`/assignments/${id}/questions`, json("POST", data)), submissions: (id: number) => apiRequest<Submission[]>(`/assignments/${id}/submissions`), submit: (id: number, data: unknown = {}) => apiRequest<Submission>(`/assignments/${id}/submissions`, json("POST", data)) },
  questions: { update: (id: number, data: unknown) => apiRequest<Question>(`/questions/${id}`, json("PUT", data)), remove: (id: number) => apiRequest<void>(`/questions/${id}`, json("DELETE")) },
  submissions: { get: (id: number) => apiRequest<Submission>(`/submissions/${id}`), student: (id: number) => apiRequest<Submission[]>(`/submissions/student/${id}`), answers: (id: number) => apiRequest<StudentAnswer[]>(`/submissions/${id}/answers`), addAnswer: (id: number, data: unknown) => apiRequest<StudentAnswer>(`/submissions/${id}/answers`, json("POST", data)), evaluate: (id: number) => apiRequest<Evaluation[]>(`/submissions/${id}/evaluate`, json("POST")) },
  answers: { update: (id: number, data: unknown) => apiRequest<StudentAnswer>(`/answers/${id}`, json("PUT", data)), evaluation: (id: number) => apiRequest<Evaluation[]>(`/answers/${id}/evaluation`), grades: (id: number) => apiRequest<Grade[]>(`/grades/answer/${id}`), updateGrade: (id: number, data: unknown) => apiRequest<Grade>(`/answers/${id}/grade`, json("PUT", data)), feedback: (id: number) => apiRequest<Feedback[]>(`/answers/${id}/feedback`), addFeedback: (id: number, data: unknown) => apiRequest<Feedback>(`/answers/${id}/feedback`, json("POST", data)) },
};
