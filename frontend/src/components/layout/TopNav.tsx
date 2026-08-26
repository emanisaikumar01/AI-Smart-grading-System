import { useState } from "react";
import { Menu, Search, Bell, HelpCircle } from "lucide-react";
import { Input } from "../ui/Input";
import { Avatar, AvatarFallback } from "../ui/Avatar";
import { Badge } from "../ui/Badge";

interface TopNavProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  setMobileOpen: (open: boolean) => void;
}

export function TopNav({ collapsed, setCollapsed, setMobileOpen }: TopNavProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-primary/15 bg-[#1f2937] px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-primary/10 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </button>
        
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="hidden h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-primary/10 md:flex"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        
        <div className="hidden sm:flex relative max-w-md w-full sm:w-64 lg:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search assignments, students..." 
            className="h-9 w-full border-primary/25 bg-[#374151] pl-9 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-primary/25 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-glow">
          <HelpCircle className="h-5 w-5" />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/25 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-glow relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-primary/25 bg-[#374151] p-4 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <Badge variant="secondary">2 New</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3 text-sm">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold text-xs">AI</span>
                  </div>
                  <div>
                    <p className="font-medium">Grading Complete</p>
                    <p className="text-muted-foreground text-xs">An evaluation is ready for review.</p>
                    <span className="text-xs text-muted-foreground mt-1 inline-block">2m ago</span>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-600">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">System Update</p>
                    <p className="text-muted-foreground text-xs">New AI model v4.2 deployed with 15% better accuracy for handwritten text.</p>
                    <span className="text-xs text-muted-foreground mt-1 inline-block">1h ago</span>
                  </div>
                </div>
              </div>
              <button className="w-full text-center text-sm text-primary font-medium mt-4 pt-2 border-t">
                Mark all as read
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 cursor-pointer rounded-full border border-primary/20 p-1 pr-3 transition-colors hover:bg-primary/10">
          <Avatar className="h-8 w-8 border border-primary/40">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <span className="sr-only">User menu</span>
        </div>
      </div>
    </header>
  );
}
