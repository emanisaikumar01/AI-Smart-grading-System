import { Link } from "react-router-dom";
import { BarChart3, BrainCircuit, ChevronRight, Clock, Code2, Globe, Mail, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";

export function Landing() {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col font-sans">
      <header className="fixed left-0 top-0 z-50 flex h-[52px] w-full items-center justify-between gap-6 bg-[#1f2937] px-6 md:px-[10%]">
        <Link to="/landing" className="flex items-center gap-3 animate-slide-right">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-ai text-primary-foreground shadow-glow">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <span className="text-2xl font-semibold text-white">
            SmartGrade
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-base font-medium md:flex">
          <a href="#features" className="text-white transition-colors hover:text-primary">Features</a>
          <a href="#goals" className="text-white transition-colors hover:text-primary">Goals</a>
          <a href="#workflow" className="text-white transition-colors hover:text-primary">Workflow</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/student-login" className="hidden text-sm font-medium text-white transition-colors hover:text-primary sm:block">
            Student Login
          </Link>
          <Link to="/professor-login" className="hidden text-sm font-medium text-white transition-colors hover:text-primary sm:block">
            Professor Login
          </Link>
          <Link to="/">
            <Button>
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section id="home" className="relative flex min-h-screen items-center overflow-hidden px-6 pb-20 pt-20 md:px-[10%]">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,#1d4ed8_0%,#2563eb_46%,#93c5fd_100%)]" />
          <div className="w-full max-w-3xl">
            <h3 className="animate-slide-bottom text-2xl font-bold md:text-3xl">Hello, Welcome To</h3>
            <h1 className="mt-2 animate-slide-right text-5xl font-bold leading-tight md:text-7xl">
              SMARTGRADE AI
            </h1>
            <h3 className="mt-2 animate-slide-top text-2xl font-bold md:text-3xl">
              And We Are <span className="text-primary">AI Grading Innovators</span>
            </h3>
            <p className="mt-7 max-w-2xl animate-slide-left text-base leading-8 text-slate-200 md:text-xl">
              SmartGrade brings the TechYuga-style modern web experience to education: glowing, responsive,
              fast, and focused on helping professors grade faster while students receive clearer feedback.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {[
                { icon: Mail, label: "Email" },
                { icon: Globe, label: "Website" },
                { icon: Code2, label: "Code" },
                { icon: Sparkles, label: "AI" },
              ].map((item, index) => (
                <a
                  key={item.label}
                  href="#features"
                  className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary text-primary opacity-0 transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-glow"
                  style={{ animation: "slideLeft 1s ease forwards", animationDelay: `${1.2 + index * 0.15}s` }}
                  aria-label={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link to="/student-login">
              <Button size="lg" className="h-14 px-8 text-lg">
                Student Login <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/professor-login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                Professor Login
              </Button>
            </Link>
            </div>
          </div>
        </section>

        <section id="features" className="bg-white py-24 text-[#081b29]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold md:text-6xl">Everything <span className="text-primary">You Need</span></h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Reclaim your weekend. Let AI handle the heavy lifting while you focus on teaching.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="rounded-2xl bg-white p-8 shadow-[0_0_20px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(0,238,255,0.4)]">
                <div className="w-14 h-14 rounded-full border-2 border-primary text-primary flex items-center justify-center mb-6">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Save Hundreds of Hours</h3>
                <p className="text-slate-600 leading-relaxed">Automate written answers, essays, and problem-solving review with high accuracy.</p>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-[0_0_20px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(0,238,255,0.4)]">
                <div className="w-14 h-14 rounded-full border-2 border-primary text-primary flex items-center justify-center mb-6">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Meaningful AI Feedback</h3>
                <p className="text-slate-600 leading-relaxed">Give each learner personal, constructive feedback instead of only marks.</p>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-[0_0_20px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(0,238,255,0.4)]">
                <div className="w-14 h-14 rounded-full border-2 border-primary text-primary flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Deep Class Analytics</h3>
                <p className="text-slate-600 leading-relaxed">Identify weak concepts and adapt lessons using real-time performance data.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="goals" className="bg-[#1f2937] px-6 py-20 text-white md:px-[10%]">
          <div className="grid gap-6 md:grid-cols-3">
            {["Professor workflow", "Student progress", "AI confidence"].map((title) => (
              <div key={title} className="rounded-2xl border border-primary/20 bg-[#374151] p-7 transition-all hover:-translate-y-2 hover:border-primary hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                <h3 className="mb-3 text-xl font-semibold text-primary">{title}</h3>
                <p className="text-slate-300">A responsive, modern dashboard experience with clear data and fast actions.</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <footer id="workflow" className="border-t border-primary/20 bg-[#1f2937] py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BrainCircuit className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">SmartGrade</span>
            </div>
            <p className="text-slate-300 max-w-sm">
              Empowering educators with artificial intelligence to grade smarter, teach better, and inspire more.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
