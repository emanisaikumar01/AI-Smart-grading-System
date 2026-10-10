import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BrainCircuit, Code2, Globe, Loader2, Mail, Users } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError, type Role } from "../lib/api";

interface LoginProps {
  role?: "Student" | "Professor" | "Teacher";
}

export function Login({ role = "Student" }: LoginProps) {
  const { login, register, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    api.health().then(() => { if (active) setBackendConnected(true); }).catch(() => { if (active) setBackendConnected(false); });
    return () => { active = false; };
  }, []);

  const selectedRole: Role = role === "Professor" ? "PROFESSOR" : "STUDENT";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (isRegistering) await register(name.trim(), email.trim(), password, selectedRole);
      else await login(email.trim(), password);
      navigate(selectedRole === "PROFESSOR" ? "/professor" : "/student", { replace: true });
    } catch (cause) {
      setError(cause instanceof ApiError ? (cause.status === 401 ? "Invalid email or password." : cause.message) : "Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#2563eb] text-white">
      <header className="fixed left-0 top-0 z-50 flex h-[52px] w-full items-center justify-between bg-[#1f2937] px-[5%] shadow-sm lg:px-[10%]">
        <Link to="/landing" className="text-lg font-semibold text-white">
          SmartGrade
        </Link>
        <nav className="hidden flex-wrap items-center justify-end gap-6 text-xs font-medium md:flex">
          <Link to="/student-login" className={role === "Student" ? "text-primary" : "text-white transition-colors hover:text-primary"}>Student</Link>
          <Link to="/professor-login" className={role === "Professor" ? "text-primary" : "text-white transition-colors hover:text-primary"}>Professor</Link>
        </nav>
      </header>

      <main className="relative grid min-h-screen items-center gap-10 px-[8%] pb-10 pt-18 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-[10%]">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,#1d4ed8_0%,#2563eb_46%,#93c5fd_100%)]" />

        <section className="relative z-10 max-w-3xl">
          <h3 className="text-xl font-bold md:text-2xl">Hello, We Are</h3>
          <h1 className="mt-1 text-4xl font-bold leading-tight tracking-wide md:text-5xl">
            SMARTGRADE {role.toUpperCase()}
          </h1>
          <h3 className="mt-2 text-xl font-bold md:text-2xl">
            And We Are <span className="text-[#312e81]">{role === "Student" ? "AI Learning Partners" : "AI Teaching Partners"}</span>
          </h3>
          <p className="mt-5 max-w-xl text-sm leading-6 text-white/90 md:text-base">
            {role === "Student"
              ? "Access your assignments, score history, course progress, and helpful AI feedback from one clean student dashboard."
              : "Manage classes, upload answer sheets, review AI grading, and publish student results from one powerful professor dashboard."}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { icon: Mail, label: "Email" },
              { icon: Users, label: "Community" },
              { icon: Code2, label: "Code" },
              { icon: Globe, label: "Website" },
            ].map((item) => (
              <a
                key={item.label}
                href="#login-form"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-100/75 text-blue-100 transition-all hover:bg-white hover:text-[#1f2937]"
                aria-label={item.label}
              >
                <item.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </section>

        <section id="login-form" className="relative z-10 rounded-2xl border border-blue-200/30 bg-[#1f2937] p-5 shadow-[0_0_18px_rgba(37,99,235,0.55)] md:p-6">
          <div className="mb-5 text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-primary text-primary shadow-[0_0_12px_rgba(0,238,255,0.7)]">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold">{isRegistering ? `${role} Registration` : `${role} Login`}</h2>
            <p className="mt-1 text-xs text-slate-300">{isRegistering ? "Create your account to continue." : "Enter your credentials to continue."}</p>
            {backendConnected !== null && <p role="status" className="mt-2 text-[11px] text-slate-400">{backendConnected ? "Backend connected" : "Backend unavailable"}</p>}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                {isRegistering && <Label htmlFor="name" className="text-[11px]">Full name</Label>}
                {isRegistering && <Input
                  id="name"
                  placeholder="First Last"
                  type="text"
                  required={isRegistering}
                  className="h-8 border-0 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading || authLoading}
                />
                }
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-[11px]">Email</Label>
                <Input 
                  id="email" 
                  placeholder="name@school.edu" 
                  type="email" 
                  required 
                  className="h-8 border-0 bg-white px-3 text-xs text-slate-800 placeholder:text-slate-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || authLoading}
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[11px]">Password</Label>
                  {!isRegistering && <span className="text-[10px] text-slate-400">Forgot password?</span>}
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="h-8 border border-primary/60 bg-[#111827] px-3 text-xs"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || authLoading}
                />
              </div>
            </div>
            
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="h-9 w-full bg-primary text-sm text-[#1f2937] shadow-[0_0_14px_rgba(37,99,235,0.8)] hover:bg-[#93c5fd]"
              disabled={isLoading || authLoading}
            >
              {isLoading || authLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isRegistering ? "Creating account..." : "Signing in..."}
                </span>
              ) : (
                isRegistering ? `Create ${role} Account` : `Sign In as ${role}`
              )}
            </Button>
          
            {!isRegistering && <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#1f2937] px-2 text-xs text-slate-300">Or continue with</span>
              </div>
            </div>}
            
            {!isRegistering && <Button type="button" variant="outline" className="h-9 w-full border-primary/50 text-sm font-medium">
              <Globe className="mr-2 h-4 w-4" />
              Google
            </Button>}
            
            <p className="mt-5 text-center text-xs text-slate-300">
              {isRegistering ? "Already registered?" : "Need an account?"}{" "}
              <button type="button" className="font-semibold text-primary hover:underline" onClick={() => { setError(""); setIsRegistering(!isRegistering); }}>
                {isRegistering ? "Sign in" : "Register"}
              </button>
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
