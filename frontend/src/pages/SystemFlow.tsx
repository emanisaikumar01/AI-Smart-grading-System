import { ArrowRight, BrainCircuit, ClipboardCheck, Layers3, ShieldCheck, Sparkles, Users } from "lucide-react";

const roleCards = [
  { label: "Professor", accent: "border-blue-300 bg-blue-50 text-slate-800" },
  { label: "Student", accent: "border-blue-300 bg-blue-50 text-slate-800" },
];

const appModules = [
  { label: "Student workspace\n[Student UI]", accent: "bg-white border-slate-300" },
  { label: "Professor workspace\n[Professor UI]", accent: "bg-white border-slate-300" },
  { label: "Grade assignment\n[Professor UI]", accent: "bg-white border-slate-300" },
  { label: "Session context\n[Auth + Session]", accent: "bg-white border-slate-300" },
  { label: "Analytics\n[Dashboard UI]", accent: "bg-white border-slate-300" },
  { label: "Evaluation results\n[Results UI]", accent: "bg-white border-slate-300" },
];

const workflowBlocks = [
  { label: "Submission endpoints", accent: "bg-amber-50 border-amber-200" },
  { label: "Class management\n[ClassService.java]", accent: "bg-amber-50 border-amber-200" },
  { label: "Question management\n[QuestionService.java]", accent: "bg-amber-50 border-amber-200" },
];

const gradingBlocks = [
  { label: "Grade and feedback\n[GradeService.java]", accent: "bg-emerald-50 border-emerald-200" },
  { label: "AI grading client\n[AI Client]", accent: "bg-emerald-50 border-emerald-200" },
  { label: "Evaluation workflow\n[Workflow UI]", accent: "bg-emerald-50 border-emerald-200" },
];

const aiBlocks = [
  { label: "OCR grading app\n[OCR app]", accent: "bg-sky-50 border-sky-200" },
  { label: "AI server app\n[AI app]", accent: "bg-sky-50 border-sky-200" },
  { label: "Handwriting OCR\n[Recognition + OCR]", accent: "bg-sky-50 border-sky-200" },
  { label: "Text cleaning\n[Cleaning]", accent: "bg-sky-50 border-sky-200" },
  { label: "Marking scheme\n[rubric matching]", accent: "bg-sky-50 border-sky-200" },
  { label: "Answer matching\n[compare answers]", accent: "bg-sky-50 border-sky-200" },
  { label: "Auto-grading\n[auto scores]", accent: "bg-sky-50 border-sky-200" },
  { label: "Prompt tuning\n[teacher feedback]", accent: "bg-sky-50 border-sky-200" },
];

const securityBlocks = [
  { label: "Identity and access\n[Auth service]", accent: "bg-rose-50 border-rose-200" },
  { label: "Recognizes text\n[OCR pipeline]", accent: "bg-sky-50 border-sky-200" },
  { label: "Cleans text\n[Normalization]", accent: "bg-sky-50 border-sky-200" },
  { label: "Calculates marks\n[Scoring]", accent: "bg-sky-50 border-sky-200" },
  { label: "Generates feedback\n[AI feedback]", accent: "bg-sky-50 border-sky-200" },
];

function PipelineBox({ label, accent }: { label: string; accent: string }) {
  return (
    <div className={`flex min-h-[76px] items-center justify-center rounded-xl border px-3 py-2 text-center text-[11px] font-medium leading-relaxed shadow-sm ${accent}`}>
      {label.split("\n").map((line, index) => (
        <span key={line + index} className="block">
          {line}
        </span>
      ))}
    </div>
  );
}

export function SystemFlow() {
  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Frontend System Flow</h1>
          <p className="mt-1 text-muted-foreground">A front-end representation of the role-based grading architecture.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-primary">
          <Layers3 className="h-4 w-4" />
          Architecture view
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-[#f8fafc] p-5 shadow-sm">
        <div className="flex items-center justify-center gap-8">
          {roleCards.map((card) => (
            <div key={card.label} className={`flex h-20 w-28 items-center justify-center rounded-full border-2 text-sm font-medium shadow-sm ${card.accent}`}>
              {card.label}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <div className="text-center text-[11px] text-muted-foreground">Web application</div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-inner">
          <div className="mb-3 flex justify-center text-[11px] font-medium text-slate-500">Role-based app</div>
          <div className="grid gap-3 md:grid-cols-6">
            {appModules.map((module) => (
              <PipelineBox key={module.label} label={module.label} accent={module.accent} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <div className="mb-4 text-center text-sm font-semibold text-amber-800">Classroom workflow</div>
          <div className="grid gap-3 md:grid-cols-3">
            {workflowBlocks.map((block, index) => (
              <div key={block.label + index} className="flex items-center justify-center">
                <PipelineBox label={block.label} accent={block.accent} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <div className="mb-4 text-center text-sm font-semibold text-emerald-800">Evaluation and grading</div>
          <div className="grid gap-3 md:grid-cols-3">
            {gradingBlocks.map((block, index) => (
              <div key={block.label + index} className="flex items-center justify-center">
                <PipelineBox label={block.label} accent={block.accent} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
          <ShieldCheck className="h-4 w-4 text-rose-500" />
          Identity and access
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {securityBlocks.map((block, index) => (
            <PipelineBox key={block.label + index} label={block.label} accent={block.accent} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold text-sky-800">
          <BrainCircuit className="h-4 w-4" />
          AI processing
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {aiBlocks.map((block, index) => (
            <PipelineBox key={block.label + index} label={block.label} accent={block.accent} />
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
            <Users className="h-4 w-4" />
            Student-side flow
          </div>
          <p className="text-sm text-slate-600">Student logs in, uploads work, checks progress, and sees AI-powered feedback.</p>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
            <ClipboardCheck className="h-4 w-4" />
            Professor-side flow
          </div>
          <p className="text-sm text-slate-600">Professor reviews workloads, grades, validates AI scores, and publishes results.</p>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            Outcome layer
          </div>
          <p className="text-sm text-slate-600">Feedback, analytics, and evaluation reports are produced in a loop for future improvements.</p>
        </div>
      </div>

      <div className="flex items-center justify-center text-sm text-muted-foreground">
        <ArrowRight className="mr-2 h-4 w-4 text-primary" />
        This frontend view mirrors the architecture flow without introducing backend logic.
      </div>
    </div>
  );
}
