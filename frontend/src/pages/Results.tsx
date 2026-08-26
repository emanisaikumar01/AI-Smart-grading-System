import { useState } from "react";
import { ChevronDown, ChevronUp, Edit2, CheckCircle, BrainCircuit, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";

const mockQuestions: any[] = [
  {
    id: 1,
    question: "Explain Newton's second law and give an example.",
    studentAnswer: "Force equals mass times acceleration. For example, pushing a cart.",
    aiScore: 8,
    marks: 10,
    aiEvaluation: "Good explanation but missing units and a worked numeric example.",
    aiFeedback: "Add units and a short numeric example showing calculation.",
    confidence: "High",
  },
  {
    id: 2,
    question: "Define kinetic energy and show its formula.",
    studentAnswer: "Kinetic energy is energy of motion, KE = 1/2 mv^2.",
    aiScore: 9,
    marks: 10,
    aiEvaluation: "Accurate and concise. Good use of formula.",
    aiFeedback: "Consider adding a brief unit analysis for clarity.",
    confidence: "Medium",
  },
  {
    id: 3,
    question: "Describe the process of photosynthesis.",
    studentAnswer: "Plants convert CO2 and water into glucose using sunlight.",
    aiScore: 7,
    marks: 10,
    aiEvaluation: "Covers the basics but lacks mention of oxygen and chlorophyll.",
    aiFeedback: "Mention oxygen release and the role of chlorophyll next time.",
    confidence: "Low",
  },
];

export function Results() {
  const [expandedQ, setExpandedQ] = useState<number | null>(null);
  const [editingQ, setEditingQ] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedQ(expandedQ === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grading Results</h1>
          <p className="text-muted-foreground mt-1">Review AI evaluation and make manual adjustments.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Previous Student</Button>
          <Button>Next Student <ChevronDown className="w-4 h-4 ml-2 -rotate-90" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">No student selected.</p>
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
                  James demonstrates a strong grasp of theoretical concepts but struggles with numerical applications and unit conversions. Recommend focusing on practical problem-solving in the next session.
                </p>
              </div>
            </CardContent>
          </Card>

          <h3 className="font-semibold text-lg mt-6 mb-2">Question-by-Question Evaluation</h3>
          
          {mockQuestions.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">No grading results to review.</div>
          ) : (
            <>
              {mockQuestions.map((q) => (
                <Card key={q.id} className="overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md">
                  <div
                    className="p-4 border-b border-primary/10 flex items-center justify-between cursor-pointer bg-[#1f2937]/45 hover:bg-primary/10"
                    onClick={() => toggleExpand(q.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center font-bold text-sm">Q{q.id}</div>
                      <div>
                        <h4 className="font-medium line-clamp-1">{q.question}</h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="font-bold text-primary">{q.aiScore}</span>
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
                              <Button variant="ghost" size="sm" onClick={() => setEditingQ(q.id)}>
                                <Edit2 className="w-3 h-3 mr-2" /> Override
                              </Button>
                            ) : null}
                          </div>

                          {editingQ === q.id ? (
                            <div className="space-y-4 flex-1">
                              <div className="space-y-2">
                                <Label>Teacher Score</Label>
                                <div className="flex items-center gap-2">
                                  <Input type="number" defaultValue={q.aiScore} className="w-20" />
                                  <span className="text-muted-foreground">/ {q.marks}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Teacher Feedback</Label>
                                <textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={q.aiFeedback} />
                              </div>
                              <div className="flex justify-end gap-2 mt-auto">
                                <Button variant="outline" size="sm" onClick={() => setEditingQ(null)}>Cancel</Button>
                                <Button size="sm" onClick={() => setEditingQ(null)}>Save Changes</Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4 flex-1 flex flex-col justify-center items-center text-center">
                              <div>
                                <span className="text-5xl font-bold text-primary">{q.aiScore}</span>
                                <span className="text-xl text-muted-foreground">/{q.marks}</span>
                              </div>

                              {q.confidence === "Medium" && (
                                <Badge variant="warning" className="mt-2">
                                  <AlertTriangle className="w-3 h-3 mr-1" /> Medium Confidence
                                </Badge>
                              )}
                              <p className="text-xs text-muted-foreground mt-4">Score calculated automatically. Click override to change.</p>
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
