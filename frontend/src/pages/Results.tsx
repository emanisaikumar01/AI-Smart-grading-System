import { useState } from "react";
import { ChevronDown, ChevronUp, Edit2, CheckCircle, BrainCircuit, Sparkles, AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api, ApiError, type Evaluation, type Feedback, type Grade } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";

export function Results() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [resultQuestions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submissionInfo, setSubmissionInfo] = useState("");
  const [editingScore, setEditingScore] = useState("");
  const [editingFeedback, setEditingFeedback] = useState("");
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const [editingQ, setEditingQ] = useState<number | null>(null);
  const [submissionId, setSubmissionId] = useState<number | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true); setError("");
      try {
        const targetId = Number(params.get("submissionId"));
        const assignmentId = Number(params.get("assignmentId"));
        let submission = targetId ? await api.submissions.get(targetId) : null;
        if (!submission && assignmentId && user.role === "PROFESSOR") submission = (await api.assignments.submissions(assignmentId))[0] ?? null;
        if (!submission && user.role === "STUDENT") submission = (await api.submissions.student(user.id))[0] ?? null;
        if (!submission) { setQuestions([]); setSubmissionId(null); return; }
        setSubmissionId(submission.id);
        const [answers, questions] = await Promise.all([api.submissions.answers(submission.id), api.assignments.questions(submission.assignmentId)]);
        const rows = await Promise.all(answers.map(async (answer) => {
          const [grades, evaluations, feedback] = await Promise.all([
            api.answers.grades(answer.id).catch(() => [] as Grade[]),
            api.answers.evaluation(answer.id).catch(() => [] as Evaluation[]),
            api.answers.feedback(answer.id).catch(() => [] as Feedback[]),
          ]);
          const grade = grades[0]; const evaluation = evaluations[0];
          const question = questions.find((item) => item.id === answer.questionId);
          return { id: answer.id, questionNumber: question?.questionNumber, question: question?.questionText ?? `Question ${answer.questionId}`, studentAnswer: answer.answerText ?? "No answer text", aiScore: evaluation?.aiScore ?? grade?.aiScore ?? null, finalScore: grade?.finalScore ?? null, marks: question?.maxMarks ?? "—", aiEvaluation: evaluation?.evaluation ?? "Not evaluated yet.", aiFeedback: feedback[0]?.feedbackText ?? evaluation?.feedback ?? "The AI service did not return feedback.", confidence: evaluation?.confidenceScore ? `${Math.round(evaluation.confidenceScore * 100)}%` : "—", grade };
        }));
        if (!cancelled) { setQuestions(rows); setSubmissionInfo(`Submission ${submission.id} · Student ${submission.studentId} · ${submission.status}`); }
      } catch (cause) { if (!cancelled) setError(cause instanceof ApiError ? cause.message : "Could not load results."); }
      finally { if (!cancelled) setLoading(false); }
    };
    void load(); return () => { cancelled = true; };
  }, [user, params, refreshCount]);

  const evaluateSubmission = async () => {
    if (!submissionId) return;
    setEvaluating(true); setError("");
    try { await api.submissions.evaluate(submissionId); setRefreshCount((count) => count + 1); }
    catch (cause) { setError(cause instanceof ApiError ? cause.message : "AI evaluation failed. No score was generated."); }
    finally { setEvaluating(false); }
  };

  const saveOverride = async (q: any) => {
    setError("");
    try {
      const updated = await api.answers.updateGrade(q.id, { teacherScore: Number(editingScore), finalScore: Number(editingScore), teacherFeedback: editingFeedback, isOverridden: true });
      setQuestions((rows) => rows.map((row) => row.id === q.id ? { ...row, finalScore: updated.finalScore, grade: updated } : row));
      setEditingQ(null);
    } catch (cause) { setError(cause instanceof ApiError ? cause.message : "Could not save grade override."); }
  };

  const toggleExpand = (id: number) => {
    setExpandedQ(expandedQ === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grading Results</h1>
          <p className="text-muted-foreground mt-1">Review stored evaluation and make manual adjustments.</p>
        </div>
        <div className="flex gap-3">
          {user?.role === "PROFESSOR" && <Button onClick={() => void evaluateSubmission()} disabled={!submissionId || evaluating || loading}>{evaluating ? "Evaluating…" : "Evaluate submission"}</Button>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">{loading ? "Loading…" : submissionInfo || "No submission selected."}</p>
          </CardContent>
        </Card>

        <div className="md:col-span-3 space-y-4">
          <Card className="bg-primary/5 border-primary/20 shadow-none">
            <CardContent className="p-4 flex gap-4 items-start">
              <div className="p-2 bg-primary/20 rounded-full text-primary mt-1">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-primary">AI Overall Insight</h4>
                <p className="text-sm mt-1 text-slate-200">
                  {resultQuestions.some((question) => question.aiScore != null) ? "Stored AI scores and evaluation diagnostics are shown below." : "No AI scores are stored for this submission yet."}
                </p>
              </div>
            </CardContent>
          </Card>

          <h3 className="font-semibold text-lg mt-6 mb-2">Question-by-Question Evaluation</h3>
          
          {error && <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          {loading ? <div className="p-6 text-sm text-muted-foreground">Loading results…</div> : resultQuestions.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">No grading results to review.</div>
          ) : (
            <>
              {resultQuestions.map((q) => (
                <Card key={q.id} className="overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md">
                  <div
                    className="p-4 border-b border-primary/10 flex items-center justify-between cursor-pointer bg-[#1f2937]/45 hover:bg-primary/10"
                    onClick={() => toggleExpand(q.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center font-bold text-sm">Q{q.questionNumber ?? q.id}</div>
                      <div>
                        <h4 className="font-medium line-clamp-1">{q.question}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                  <span className="font-bold text-primary">{q.finalScore ?? q.aiScore ?? "—"}</span>
                        <span className="text-muted-foreground text-sm"> / {q.marks}</span>
                      </div>
                      {expandedQ === q.id ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                    </div>
                  </div>

                  {expandedQ === q.id && (
                    <CardContent className="p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="space-y-2">
                        <Label className="text-muted-foreground">Student Answer</Label>
                        <div className="p-4 rounded-md bg-muted/30 font-medium text-sm leading-relaxed border font-mono">{q.studentAnswer}</div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-primary font-medium">
                            <BrainCircuit className="w-4 h-4" /> AI Evaluation
                          </div>
                          <p className="text-sm text-slate-200">{q.aiEvaluation}</p>

                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-md">
                            <p className="text-sm font-medium text-primary mb-1">Feedback for Student</p>
                            <p className="text-sm text-blue-800 dark:text-blue-400">"{q.aiFeedback}"</p>
                          </div>
                        </div>

                        <div className="bg-card border rounded-lg p-4 shadow-sm flex flex-col h-full">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-emerald-500" /> Scoring
                            </h4>
                            {!editingQ || editingQ !== q.id ? (
                              <Button variant="ghost" size="sm" onClick={() => { setEditingScore(q.aiScore == null ? "" : String(q.aiScore)); setEditingFeedback(q.aiFeedback === "No stored feedback." ? "" : q.aiFeedback); setEditingQ(q.id); }}>
                                <Edit2 className="w-3 h-3 mr-2" /> Override
                              </Button>
                            ) : null}
                          </div>

                          {editingQ === q.id ? (
                            <div className="space-y-4 flex-1">
                              <div className="space-y-2">
                                <Label>Teacher Score</Label>
                                <div className="flex items-center gap-2">
                                  <Input type="number" min="0" max={q.marks === "—" ? undefined : q.marks} step="0.01" value={editingScore} onChange={(e) => setEditingScore(e.target.value)} className="w-20" />
                                  <span className="text-muted-foreground">/ {q.marks}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Teacher Feedback</Label>
                              <textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={editingFeedback} onChange={(e) => setEditingFeedback(e.target.value)} />
                              </div>
                              <div className="flex justify-end gap-2 mt-auto">
                                <Button variant="outline" size="sm" onClick={() => setEditingQ(null)}>Cancel</Button>
                                <Button size="sm" disabled={!editingScore} onClick={() => void saveOverride(q)}>Save Changes</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4 flex-1 flex flex-col justify-center items-center text-center">
                              <div>
                                <span className="text-xs text-muted-foreground block">AI score</span>
                                <span className="text-5xl font-bold text-primary">{q.aiScore ?? "—"}</span>
                                <span className="text-xl text-muted-foreground">/{q.marks}</span>
                                {q.finalScore != null && q.finalScore !== q.aiScore && <p className="mt-2 text-sm">Final score: {q.finalScore}/{q.marks}</p>}
                              </div>

                              {q.confidence === "Medium" && (
                                <Badge variant="warning" className="mt-2">
                                  <AlertTriangle className="w-3 h-3 mr-1" /> Medium Confidence
                                </Badge>
                              )}
                              <p className="text-xs text-muted-foreground mt-4">{q.grade?.overridden ? "Teacher override saved." : q.aiScore == null ? "No score is stored." : "Stored score. Click override to change."}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
