import { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { api, ApiError, type Assignment, type ClassRecord } from "../lib/api";

const steps = [
  "Assignment Details",
  "Add Questions",
  "Publish",
];

export function GradeAssignment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [classId, setClassId] = useState("");
  const [title, setTitle] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [instructions, setInstructions] = useState("");
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [questionText, setQuestionText] = useState("");
  const [expectedAnswer, setExpectedAnswer] = useState("");
  const [markingCriteria, setMarkingCriteria] = useState("");
  const [questionMarks, setQuestionMarks] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [published, setPublished] = useState(false);
  useEffect(() => { api.classes.list().then((items) => { setClasses(items); if (items[0]) setClassId(String(items[0].id)); }).catch((cause) => setError(cause instanceof ApiError ? cause.message : "Could not load classes.")); }, []);
  const createAssignment = async () => {
    setBusy(true); setError("");
    try { const saved = await api.assignments.create({ classId: Number(classId), title: title.trim(), totalMarks: Number(totalMarks), instructions }); setAssignment(saved); setCurrentStep(1); }
    catch (cause) { setError(cause instanceof ApiError ? cause.message : "Could not create assignment."); }
    finally { setBusy(false); }
  };
  const addQuestion = async () => {
    if (!assignment) return;
    setBusy(true); setError("");
    try { await api.assignments.addQuestion(assignment.id, { assignmentId: assignment.id, questionNumber: questionCount + 1, questionText: questionText.trim(), maxMarks: Number(questionMarks), expectedAnswer, markingCriteria }); setQuestionCount(questionCount + 1); setQuestionText(""); setExpectedAnswer(""); setMarkingCriteria(""); setQuestionMarks(""); }
    catch (cause) { setError(cause instanceof ApiError ? cause.message : "Could not add question."); }
    finally { setBusy(false); }
  };
  const publishAssignment = async () => {
    if (!assignment) return;
    setBusy(true); setError("");
    try { await api.assignments.publish(assignment.id); setPublished(true); setCurrentStep(3); }
    catch (cause) { setError(cause instanceof ApiError ? cause.message : "Could not publish assignment."); }
    finally { setBusy(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Grading Workflow</h1>
        <p className="text-muted-foreground mt-1">Create and publish an assignment. Professors can evaluate typed student answers from Results.</p>
      </div>

      {/* Step Indicator */}
      <div className="relative">
        <div className="absolute left-0 top-1/2 w-full h-1 bg-muted -translate-y-1/2" />
        <div 
          className="absolute left-0 top-1/2 h-1 bg-primary -translate-y-1/2 transition-all duration-500" 
          style={{ width: `${(Math.min(currentStep, steps.length - 1) / (steps.length - 1)) * 100}%` }} 
        />
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = currentStep > index;
            const isCurrent = currentStep === index;
            
            return (
              <div key={step} className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-background z-10 transition-colors ${
                    isCompleted ? 'border-primary bg-primary text-primary-foreground' : 
                    isCurrent ? 'border-primary text-primary' : 'border-muted-foreground text-muted-foreground'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : <span>{index + 1}</span>}
                </div>
                <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        {error && <p role="alert" className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        {currentStep === 0 && (
          <Card className="animate-in fade-in zoom-in-95 duration-300">
            <CardHeader>
              <CardTitle>Assignment Details</CardTitle>
              <CardDescription>Enter the basic information about this assignment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Assignment Name</Label>
                  <Input id="name" placeholder="Assignment name" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <select id="class" value={classId} onChange={(e) => setClassId(e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">Select a class</option>{classes.map((item) => <option key={item.id} value={item.id}>{item.name}{item.section ? ` · ${item.section}` : ""}</option>)}</select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marks">Total Marks</Label>
                  <Input id="marks" type="number" min="0.01" step="0.01" placeholder="Total marks" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions for students</Label>
                <textarea 
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="e.g. Be lenient with spelling mistakes but strict about formulas."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
              <Button disabled={busy || !title.trim() || !classId || !totalMarks} onClick={() => void createAssignment()}>
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 1 && (
          <Card className="animate-in fade-in zoom-in-95 duration-300">
            <CardHeader>
              <CardTitle>Add Question</CardTitle>
              <CardDescription>Add text, reference answer, criteria and max marks for each question.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label htmlFor="question-text">Question text</Label><textarea id="question-text" value={questionText} onChange={(e) => setQuestionText(e.target.value)} className="w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
              <div className="space-y-2"><Label htmlFor="expected-answer">Expected answer</Label><textarea id="expected-answer" value={expectedAnswer} onChange={(e) => setExpectedAnswer(e.target.value)} className="w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm" /></div>
              <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label htmlFor="criteria">Marking criteria</Label><textarea id="criteria" value={markingCriteria} onChange={(e) => setMarkingCriteria(e.target.value)} className="w-full min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm" /></div><div className="space-y-2"><Label htmlFor="question-marks">Max marks</Label><Input id="question-marks" type="number" min="0.01" step="0.01" value={questionMarks} onChange={(e) => setQuestionMarks(e.target.value)} /></div></div>
              <p className="text-sm text-muted-foreground">{questionCount} question{questionCount === 1 ? "" : "s"} saved</p>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => setCurrentStep(0)}>Back</Button>
              <div className="flex gap-2"><Button variant="outline" disabled={busy || !questionText.trim() || !questionMarks} onClick={() => void addQuestion()}>Add Question</Button><Button disabled={questionCount === 0} onClick={() => setCurrentStep(2)}>Continue <ArrowRight className="w-4 h-4 ml-2" /></Button></div>
            </CardFooter>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="animate-in fade-in zoom-in-95 duration-300">
            <CardHeader>
              <CardTitle>Publish Assignment</CardTitle>
              <CardDescription>Publish the assignment so enrolled students can submit through their dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4"><h3 className="font-medium">{assignment?.title}</h3><p className="mt-1 text-sm text-muted-foreground">{questionCount} questions · {assignment?.totalMarks} maximum marks</p></div>
              <p className="text-sm text-muted-foreground">After students submit typed answers, open Results to request AI evaluation and review the returned score.</p>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6 bg-slate-50 dark:bg-slate-900/50 rounded-b-xl">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
              <Button disabled={busy} onClick={() => void publishAssignment()} className="bg-gradient-ai border-0 text-white shadow-glow">
                Publish Assignment <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="animate-in fade-in zoom-in-95 duration-300">
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary"><Check className="h-10 w-10" /></div>
              <h2 className="text-2xl font-bold">Assignment Published</h2>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">{published ? `${assignment?.title} is now active for students.` : "The assignment was not published."} Evaluation is available after students submit typed answers.</p>
              <Link to="/results"><Button className="mt-6" variant="outline">View Results <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            </CardContent>
          </Card>
        )}      </div>
    </div>
  );
}
