import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, UploadCloud, BrainCircuit, Play, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";

const steps = [
  "Assignment Details",
  "Upload Questions",
  "Upload Answers",
  "AI Evaluation",
];

export function GradeAssignment({ step: initialStep = 0 }: { step?: number }) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const startProcessing = () => {
    setIsProcessing(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      setProcessingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setCurrentStep(4), 500);
      }
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Grading Workflow</h1>
        <p className="text-muted-foreground mt-1">Follow the steps to automatically evaluate student answers.</p>
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
                  <Input id="name" placeholder="Assignment name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Subject" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class/Section</Label>
                  <Input id="class" placeholder="Class/Section" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marks">Total Marks</Label>
                  <Input id="marks" type="number" placeholder="Total marks" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions">Teacher Instructions for AI</Label>
                <textarea 
                  id="instructions"
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="e.g. Be lenient with spelling mistakes but strict about formulas."
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
              <Button onClick={() => setCurrentStep(1)}>
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 1 && (
          <Card className="animate-in fade-in zoom-in-95 duration-300">
            <CardHeader>
              <CardTitle>Upload Question Paper & Key</CardTitle>
              <CardDescription>Upload the assignment questions and the marking scheme.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Drag & Drop Files Here</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">or click to browse files</p>
                <p className="text-xs text-muted-foreground">Supports PDF, DOCX (Max 10MB)</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Uploaded Files</h4>
                <div className="p-4 text-sm text-muted-foreground">No files uploaded yet.</div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={() => setCurrentStep(0)}>Back</Button>
              <Button onClick={() => setCurrentStep(2)}>
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 2 && (
          <Card className="animate-in fade-in zoom-in-95 duration-300">
            <CardHeader>
              <CardTitle>Upload Student Answers</CardTitle>
              <CardDescription>Upload the scanned answer sheets for AI evaluation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-10 flex flex-col items-center justify-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Drag & Drop Answer Sheets Here</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">or click to browse files</p>
                <p className="text-xs text-muted-foreground">Supports PDF, JPG, PNG (Max 50MB per file)</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Uploaded Sheets</h4>
                  <Button variant="ghost" size="sm" className="h-8 text-destructive">Clear All</Button>
                </div>
                <div className="p-4 text-sm text-muted-foreground">No answer sheets uploaded yet.</div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6 bg-slate-50 dark:bg-slate-900/50 rounded-b-xl">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>Back</Button>
              <Button onClick={() => setCurrentStep(3)} className="bg-gradient-ai border-0 text-white shadow-glow">
                Start AI Grading <Play className="w-4 h-4 ml-2 fill-current" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 3 && (
          <Card className="animate-in fade-in zoom-in-95 duration-300 border-none shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-ai opacity-10" />
            <CardContent className="pt-12 pb-16 px-10 text-center relative z-10">
              
              {!isProcessing ? (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center animate-pulse-slow">
                    <BrainCircuit className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Ready to analyze uploaded answer sheets</h2>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                      The AI will read handwriting, identify answers, compare with your marking scheme, and assign scores.
                    </p>
                  </div>
                  <Button size="lg" onClick={startProcessing} className="bg-gradient-ai border-0 text-white shadow-glow mt-4">
                    Begin Processing <Play className="w-4 h-4 ml-2 fill-current" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-8 flex flex-col items-center">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-muted flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">{processingProgress}%</span>
                    </div>
                    <svg className="absolute top-0 left-0 w-32 h-32 -rotate-90">
                      <circle 
                        cx="64" cy="64" r="60" 
                        fill="transparent" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                        strokeDasharray="377" 
                        strokeDashoffset={377 - (377 * processingProgress) / 100} 
                        className="text-primary transition-all duration-300 ease-in-out" 
                      />
                    </svg>
                  </div>
                  
                  <div className="space-y-2 w-full max-w-md">
                    <h3 className="text-xl font-semibold">AI is analyzing student answers...</h3>
                    <div className="space-y-3 mt-6 text-left">
                      <div className="flex items-center gap-3">
                        {processingProgress > 10 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <div className="w-5 h-5 rounded-full border-2 border-muted" />}
                        <span className={processingProgress > 10 ? "text-foreground font-medium" : "text-muted-foreground"}>Reading answer sheets</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {processingProgress > 30 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <div className="w-5 h-5 rounded-full border-2 border-muted" />}
                        <span className={processingProgress > 30 ? "text-foreground font-medium" : "text-muted-foreground"}>Identifying questions & mapping responses</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {processingProgress > 60 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <div className="w-5 h-5 rounded-full border-2 border-muted" />}
                        <span className={processingProgress > 60 ? "text-foreground font-medium" : "text-muted-foreground"}>Comparing with grading criteria</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {processingProgress > 90 ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <div className="w-5 h-5 rounded-full border-2 border-muted" />}
                        <span className={processingProgress > 90 ? "text-foreground font-medium" : "text-muted-foreground"}>Generating feedback & calculating marks</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full max-w-md flex justify-between text-sm mt-4">
                    <span className="text-muted-foreground">Progress: <span className="text-foreground font-bold">{processingProgress}%</span></span>
                    <span className="text-muted-foreground">Est. Time Remaining: <span className="text-foreground font-bold">~{Math.ceil((100-processingProgress)*0.2)}s</span></span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <div className="text-center py-20 animate-in fade-in zoom-in duration-500 space-y-6">
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <Check className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Grading Complete!</h2>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                AI has successfully evaluated the uploaded answer sheets. You can now review the results, make manual adjustments, or generate reports.
              </p>
            </div>
            <div className="flex justify-center gap-4 mt-8">
              <Button variant="outline" size="lg">Generate Report</Button>
              <Link to="/results">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Review Results <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
