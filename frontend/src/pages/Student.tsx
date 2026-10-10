import {
  Award,
  BookOpen,
  CalendarDays,
  Clock,
  MessageSquare,
  TrendingUp,
  UploadCloud,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { api, ApiError, type Assignment, type Feedback, type Question, type StudentAnswer, type Submission } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Progress } from "../components/ui/Progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";

export function Student() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [answering, setAnswering] = useState<Submission | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answerDrafts, setAnswerDrafts] = useState<Record<number, string>>({});
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [all, mine] = await Promise.all([api.assignments.list(), user ? api.submissions.student(user.id) : Promise.resolve([])]);
      setAssignments(all); setSubmissions(mine);
      const answerRows = await Promise.all(mine.map((submission) => api.submissions.answers(submission.id).catch(() => [])));
      const feedbackRows = await Promise.all(answerRows.flat().map((answer) => api.answers.feedback(answer.id).catch(() => [])));
      setFeedback(feedbackRows.flat());
    } catch (cause) { setError(cause instanceof ApiError ? cause.message : "Could not load your assignments."); }
    finally { setLoading(false); }
  }, [user]);
  useEffect(() => { void load(); }, [load]);
  const submit = async (assignment: Assignment) => {
    setError(""); setNotice("");
    try { const submission = await api.assignments.submit(assignment.id); const questions = await api.assignments.questions(assignment.id); setAnswering(submission); setQuestions(questions); setAnswerDrafts({}); setNotice(`Submission started for ${assignment.title}. Enter your answers below.`); await load(); }
    catch (cause) { setError(cause instanceof ApiError ? cause.message : "Could not submit the assignment."); }
  };
  const openAnswers = async (submission: Submission) => {
    try { const [questions, saved] = await Promise.all([api.assignments.questions(submission.assignmentId), api.submissions.answers(submission.id)]); setQuestions(questions); setAnswering(submission); setAnswerDrafts(Object.fromEntries(saved.map((answer) => [answer.questionId, answer.answerText ?? ""]))); }
    catch (cause) { setError(cause instanceof ApiError ? cause.message : "Could not load assignment answers."); }
  };
  const saveAnswers = async () => {
    if (!answering) return;
    try {
      const existing: StudentAnswer[] = await api.submissions.answers(answering.id);
      for (const question of questions) {
        const text = answerDrafts[question.id]?.trim(); if (!text) continue;
        const saved = existing.find((answer) => answer.questionId === question.id);
        if (saved) await api.answers.update(saved.id, { answerText: text });
        else await api.submissions.addAnswer(answering.id, { questionId: question.id, answerText: text });
      }
      setNotice("Your answers have been saved."); setError("");
    } catch (cause) { setError(cause instanceof ApiError ? cause.message : "Could not save your answers."); }
  };
  const studentStats: any[] = [
    { title: "Completed", value: submissions.filter((s) => s.status === "GRADED" || s.status === "REVIEWED").length, detail: "assignments finished", bg: "bg-emerald-100", icon: Award, color: "text-emerald-600" },
    { title: "In Progress", value: submissions.filter((s) => s.status === "SUBMITTED" || s.status === "PROCESSING").length, detail: "awaiting review", bg: "bg-yellow-100", icon: Clock, color: "text-yellow-600" },
    { title: "Average", value: "—", detail: "available after grading", bg: "bg-blue-100", icon: TrendingUp, color: "text-blue-600" },
    { title: "Feedback", value: feedback.length, detail: "stored feedback notes", bg: "bg-primary/10", icon: MessageSquare, color: "text-primary" },
  ];
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Track submissions, scores, and feedback from your courses.</p>
        </div>
        <Button onClick={() => document.getElementById("my-assignments")?.scrollIntoView({ behavior: "smooth" })} className="w-full bg-gradient-ai text-white border-0 shadow-glow hover:opacity-90 md:w-auto">
          <UploadCloud className="mr-2 h-5 w-5" />
          Upload Assignment
        </Button>
      </div>
      {error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      {notice && <p role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm">{notice}</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {studentStats.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">No statistics available yet.</p>
            </CardContent>
          </Card>
        ) : (
          studentStats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h2 className="mt-2 text-3xl font-bold">{stat.value}</h2>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{stat.detail}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader id="my-assignments">
            <CardTitle>My Assignments</CardTitle>
            <CardDescription>Current work, grading status, and progress</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <div className="p-6 text-sm text-muted-foreground">Loading assignments…</div> : assignments.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">No assignments found.</div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.filter((assignment) => assignment.status === "ACTIVE").map((assignment) => {
                  const submitted = submissions.find((submission) => submission.assignmentId === assignment.id);
                  return <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.title}</TableCell>
                    <TableCell>Class {assignment.classId}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="min-w-32">
                      <Progress value={submitted ? 100 : 0} className="h-2" />
                    </TableCell>
                    <TableCell className="font-medium">—</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          submitted?.status === "GRADED" || submitted?.status === "REVIEWED"
                            ? "success"
                            : submitted
                              ? "warning"
                              : "outline"
                        }
                      >
                        {submitted?.status ?? "Available"}
                      </Badge>
                    </TableCell>
                    <TableCell>{submitted ? <Button size="sm" variant="outline" disabled={submitted.status === "GRADED" || submitted.status === "REVIEWED"} onClick={() => void openAnswers(submitted)}>Answer</Button> : <Button size="sm" onClick={() => void submit(assignment)}>Start</Button>}</TableCell>
                  </TableRow>;
                })}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Feedback</CardTitle>
            <CardDescription>Recommended improvements from recent grading</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedback.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground">No feedback yet.</div>
            ) : (
              feedback.map((item) => (
                <div key={item.id} className="rounded-lg border border-primary/20 bg-[#1f2937]/55 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Study Note
                  </div>
                  <p className="text-sm text-muted-foreground">{item.feedbackText}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {answering && (
        <Card>
          <CardHeader><CardTitle>Assignment Answers</CardTitle><CardDescription>Enter your answers and save them to your submission.</CardDescription></CardHeader>
          <CardContent className="space-y-5">
            {questions.length === 0 ? <p className="text-sm text-muted-foreground">No questions have been added yet.</p> : questions.map((question) => <div key={question.id} className="space-y-2"><label htmlFor={`student-answer-${question.id}`} className="text-sm font-medium">Question {question.questionNumber}: {question.questionText}</label><textarea id={`student-answer-${question.id}`} className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm" value={answerDrafts[question.id] ?? ""} onChange={(e) => setAnswerDrafts((current) => ({ ...current, [question.id]: e.target.value }))} /></div>)}
          </CardContent>
          <CardContent className="pt-0"><Button disabled={questions.length === 0} onClick={() => void saveAnswers()}>Save Answers</Button></CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Course Progress</CardTitle>
          <CardDescription>How your active subjects are moving this term</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="p-4 text-sm text-muted-foreground">No course progress available.</div>
        </CardContent>
      </Card>
    </div>
  );
}
