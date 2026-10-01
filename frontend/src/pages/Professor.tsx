import {
  BarChart3,
  CheckCircle2,
  FileEdit,
  MessageSquareWarning,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, ApiError, type Assignment, type ClassRecord, type Subject } from "../lib/api";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { Input } from "../components/ui/Input";

export function Professor() {
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissionCounts, setSubmissionCounts] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectDescription, setSubjectDescription] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [busy, setBusy] = useState(false);
  const load = async () => {
    setLoading(true); setError("");
    try {
      const [classRows, subjectRows, assignmentRows] = await Promise.all([api.classes.list(), api.subjects.list(), api.assignments.list()]);
      setClasses(classRows); setSubjects(subjectRows); setAssignments(assignmentRows);
      const rows = await Promise.all(assignmentRows.map(async (assignment) => [assignment.id, (await api.assignments.submissions(assignment.id).catch(() => [])).length] as const));
      setSubmissionCounts(Object.fromEntries(rows));
      if (!subjectId && subjectRows[0]) setSubjectId(String(subjectRows[0].id));
    } catch (cause) { setError(cause instanceof ApiError ? cause.message : "Could not load professor data."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  const createSubject = async () => { setBusy(true); setError(""); try { await api.subjects.create({ name: subjectName.trim(), description: subjectDescription.trim() }); setSubjectName(""); setSubjectDescription(""); await load(); } catch (cause) { setError(cause instanceof ApiError ? cause.message : "Could not create subject."); } finally { setBusy(false); } };
  const createClass = async () => { setBusy(true); setError(""); try { await api.classes.create({ name: className.trim(), section: section.trim(), subjectId: Number(subjectId) }); setClassName(""); setSection(""); await load(); } catch (cause) { setError(cause instanceof ApiError ? cause.message : "Could not create class."); } finally { setBusy(false); } };
  const professorStats: any[] = [
    { title: "Active Classes", value: classes.length, detail: "classes assigned to you", bg: "bg-primary/10", icon: Users, color: "text-primary" },
    { title: "Pending Reviews", value: assignments.reduce((n, a) => n + (submissionCounts[a.id] ?? 0), 0), detail: "submissions across assignments", bg: "bg-yellow-100", icon: MessageSquareWarning, color: "text-yellow-600" },
    { title: "Avg AI Confidence", value: "—", detail: "AI evaluation not connected", bg: "bg-emerald-100", icon: CheckCircle2, color: "text-emerald-600" },
    { title: "Assignments", value: assignments.length, detail: "created assignments", bg: "bg-blue-100", icon: Sparkles, color: "text-blue-600" },
  ];
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Professor Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Manage classes, AI grading, review queues, and result publishing.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/grade">
            <Button className="w-full bg-gradient-ai text-white border-0 shadow-glow hover:opacity-90 sm:w-auto">
              <Sparkles className="mr-2 h-5 w-5" />
              Create Assignment
            </Button>
          </Link>
          <a href="#class-management"><Button variant="outline" className="w-full bg-card sm:w-auto">
            <Plus className="mr-2 h-5 w-5" />
            New Class
          </Button></a>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {error && <p role="alert" className="col-span-full rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        {loading ? <Card className="col-span-full"><CardContent className="p-6 text-sm text-muted-foreground">Loading your classes and assignments…</CardContent></Card> : professorStats.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">No statistics available yet.</p>
            </CardContent>
          </Card>
        ) : (
          professorStats.map((stat) => (
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
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Grading Queue</CardTitle>
              <CardDescription>Assignments moving through AI evaluation</CardDescription>
            </div>
            <Link to="/upload">
              <Button variant="outline" size="sm" className="bg-card">
                <FileEdit className="mr-2 h-4 w-4" />
                Upload Papers
              </Button>
            </Link>
          </CardHeader>
            <CardContent>
            {assignments.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">No items in grading queue.</div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead className="text-center">Graded</TableHead>
                  <TableHead className="text-center">AI Confidence</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{classes.find((c) => c.id === item.classId)?.name ?? `Class ${item.classId}`}</TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {submissionCounts[item.id] ?? 0}
                    </TableCell>
                    <TableCell className="text-center font-medium">—</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "GRADED"
                            ? "success"
                            : item.status === "ACTIVE"
                              ? "warning"
                              : item.status === "DRAFT"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {item.status}
                      </Badge>
                      <Link className="ml-2 text-primary underline" to={`/results?assignmentId=${item.id}`}>Review</Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Review Focus</CardTitle>
            <CardDescription>Questions that may need professor judgment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 text-sm text-muted-foreground">No AI review focus items.</div>
          </CardContent>
        </Card>
      </div>

      <Card id="class-management">
        <CardHeader><CardTitle>Subjects and Classes</CardTitle><CardDescription>Create subjects and classes that you own.</CardDescription></CardHeader>
        <CardContent className="grid gap-8 md:grid-cols-2">
          <div className="space-y-3"><h3 className="font-medium">Create Subject</h3><Input aria-label="Subject name" placeholder="Subject name" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} /><Input aria-label="Subject description" placeholder="Description (optional)" value={subjectDescription} onChange={(e) => setSubjectDescription(e.target.value)} /><Button disabled={busy || !subjectName.trim()} onClick={() => void createSubject()}><Plus className="mr-1 h-4 w-4" />Create Subject</Button><div className="space-y-2">{subjects.map((subject) => <p key={subject.id} className="rounded-lg border p-3 text-sm">{subject.name}</p>)}{subjects.length === 0 && <p className="text-sm text-muted-foreground">No subjects yet.</p>}</div></div>
          <div className="space-y-3"><h3 className="font-medium">Create Class</h3><Input aria-label="Class name" placeholder="Class name" value={className} onChange={(e) => setClassName(e.target.value)} /><Input aria-label="Section" placeholder="Section (optional)" value={section} onChange={(e) => setSection(e.target.value)} /><select aria-label="Subject" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}><option value="">Select subject</option>{subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}</select><Button disabled={busy || !className.trim() || !subjectId} onClick={() => void createClass()}><Plus className="mr-1 h-4 w-4" />Create Class</Button><div className="space-y-2">{classes.map((item) => <p key={item.id} className="rounded-lg border p-3 text-sm">{item.name}{item.section ? ` · ${item.section}` : ""}</p>)}{classes.length === 0 && <p className="text-sm text-muted-foreground">No classes yet.</p>}</div></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Class Progress</CardTitle>
          <CardDescription>Submission and grading coverage by active class</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="p-4 text-sm text-muted-foreground">No class progress data.</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Analytics are ready for this week</h3>
              <p className="text-sm text-muted-foreground">Compare class performance and identify weak concepts.</p>
            </div>
          </div>
          <Link to="/analytics">
            <Button variant="outline" className="w-full bg-card md:w-auto">Open Analytics</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
