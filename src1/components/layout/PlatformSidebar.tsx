import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItemProps {
  to: string;
  end?: boolean;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
}

function PlatformNavItem({ to, end, icon: Icon, label, collapsed }: NavItemProps) {
  const content = (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 border-l-2",
          isActive
            ? "border-violet-500 bg-violet-500/15 text-violet-100 shadow-sm"
            : "border-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5"
        )
      }
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!collapsed && <span className="font-medium text-sm">{label}</span>}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

interface NavGroupProps {
  title: string;
  children: React.ReactNode;
  collapsed: boolean;
}

function NavGroup({ title, children, collapsed }: NavGroupProps) {
  return (
    <div className="mb-6">
      {!collapsed && (
        <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </h3>
      )}
      <nav className="space-y-1">{children}</nav>
    </div>
  );
}

export function PlatformSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen flex flex-col border-r border-white/10 bg-[#0c1222] text-slate-200 transition-all duration-300 sticky top-0",
        "shadow-[inset_-1px_0_0_rgba(139,92,246,0.08)]",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-900/40 ring-1 ring-violet-400/30">
          <Shield className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in min-w-0">
            <h1 className="font-bold text-white text-lg leading-tight tracking-tight">
              GuardForce
            </h1>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-300/90">
              Platform console
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <NavGroup title="Overview" collapsed={collapsed}>
          <PlatformNavItem
            to="/platform"
            end
            icon={LayoutDashboard}
            label="Dashboard"
            collapsed={collapsed}
          />
        </NavGroup>
        <NavGroup title="Operations" collapsed={collapsed}>
          <PlatformNavItem
            to="/platform/tenants"
            icon={Building2}
            label="Companies"
            collapsed={collapsed}
          />
          <PlatformNavItem
            to="/platform/subscription-plans"
            icon={Package}
            label="Plans & features"
            collapsed={collapsed}
          />
        </NavGroup>
      </div>

      <div className="p-3 border-t border-white/10">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
