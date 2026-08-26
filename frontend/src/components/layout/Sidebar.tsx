import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  GraduationCap,
  FileEdit, 
  Upload, 
  BookOpen, 
  Users, 
  Award, 
  BarChart3, 
  FileText, 
  Settings, 
  HelpCircle, 
  LogOut,
  BrainCircuit,
  ChevronLeft
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Student", href: "/student", icon: GraduationCap },
  { name: "Professor", href: "/professor", icon: Users },
  { name: "Grade Assignment", href: "/grade", icon: FileEdit },
  { name: "Upload Answer Sheets", href: "/upload", icon: Upload },
  { name: "Assignments", href: "/assignments", icon: BookOpen },
  { name: "Students", href: "/students", icon: Users },
  { name: "Results", href: "/results", icon: Award },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

const bottomNavItems = [
  { name: "Help & Support", href: "/support", icon: HelpCircle },
];

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const SidebarContent = () => (
    <>
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-primary/15 px-4">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-ai text-primary-foreground shadow-glow">
            <BrainCircuit className="h-5 w-5" />
          </div>
          {!collapsed && (
            <span className="text-xl font-semibold text-white">
              SmartGrade
            </span>
          )}
        </div>
        {!collapsed && (
          <button 
            onClick={() => setCollapsed(true)} 
            className="hidden md:flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center rounded-full px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-slate-200 hover:bg-primary/10 hover:text-primary",
                  collapsed ? "justify-center" : "justify-start"
                )}
                title={collapsed ? item.name : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", !collapsed && "mr-3", isActive ? "text-primary-foreground" : "text-primary group-hover:text-primary")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-8 border-t border-primary/15 pt-4">
          <nav className="space-y-1">
            {bottomNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center rounded-full px-3 py-2 text-sm font-medium transition-colors text-slate-200 hover:bg-primary/10 hover:text-primary",
                  collapsed ? "justify-center" : "justify-start"
                )}
                title={collapsed ? item.name : undefined}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", !collapsed && "mr-3", "text-primary")} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            ))}
            <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className={cn(
                  "group flex items-center rounded-full px-3 py-2 text-sm font-medium transition-colors text-slate-200 hover:bg-primary/10 hover:text-primary w-full",
                  collapsed ? "justify-center" : "justify-start"
                )}
                title={collapsed ? "Logout" : undefined}
              >
                <LogOut className={cn("h-5 w-5 shrink-0", !collapsed && "mr-3", "text-primary")} />
                {!collapsed && <span>Logout</span>}
            </button>
          </nav>
        </div>
        
        {!collapsed && user && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-primary/20 bg-[#1f2937] p-3 shadow-sm">
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden ring-2 ring-primary/30">
              <span aria-hidden className="text-sm">{user.name ? user.name.charAt(0) : "U"}</span>
            </div>
            <div className="flex flex-col">
              <span className="sr-only">{user.name}</span>
              <span className="text-xs text-muted-foreground mt-1">{user.role}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div 
        className={cn(
          "z-20 hidden h-screen flex-col border-r border-primary/20 bg-[#1f2937] transition-all duration-300 md:flex",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-200 md:hidden",
        mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setMobileOpen(false)}>
        <div 
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 border-r border-primary/20 bg-[#1f2937] shadow-lg transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          onClick={e => e.stopPropagation()}
        >
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
