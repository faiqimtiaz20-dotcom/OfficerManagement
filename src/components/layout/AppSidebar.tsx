import { useState } from "react";
import { NavLink } from "react-router-dom";
 import {
   LayoutDashboard,
   Users,
   Briefcase,
   Calendar,
   Building2,
   FileText,
   CreditCard,
   Bell,
   BarChart3,
   Settings,
   Shield,
   ChevronLeft,
   ChevronRight,
   UserCheck,
   ClipboardCheck,
   MapPin,
   Clock,
   Receipt,
 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
 import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
 } from "@/components/ui/tooltip";
 
interface NavItemProps {
   to: string;
   icon: React.ElementType;
   label: string;
   collapsed: boolean;
   badge?: string | number;
  hidden?: boolean;
 }
 
const NavItem = ({
  to,
  icon: Icon,
  label,
  collapsed,
  badge,
  hidden,
}: NavItemProps) => {
  if (hidden) return null;
   const content = (
     <NavLink
       to={to}
       className={({ isActive }) =>
         cn(
           "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
           "hover:bg-sidebar-accent",
           isActive
             ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
             : "text-sidebar-foreground/70 hover:text-sidebar-foreground"
         )
       }
     >
       <Icon className="h-5 w-5 flex-shrink-0" />
       {!collapsed && (
         <>
           <span className="font-medium text-sm">{label}</span>
           {badge !== undefined && (
             <span className="ml-auto bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full font-semibold">
               {badge}
             </span>
           )}
         </>
       )}
     </NavLink>
   );
 
   if (collapsed) {
     return (
       <Tooltip delayDuration={0}>
         <TooltipTrigger asChild>{content}</TooltipTrigger>
         <TooltipContent side="right" className="flex items-center gap-2">
           {label}
           {badge !== undefined && (
             <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full font-semibold">
               {badge}
             </span>
           )}
         </TooltipContent>
       </Tooltip>
     );
   }
 
   return content;
 };
 
 interface NavGroupProps {
   title: string;
   children: React.ReactNode;
   collapsed: boolean;
 }
 
 const NavGroup = ({ title, children, collapsed }: NavGroupProps) => (
   <div className="mb-6">
     {!collapsed && (
       <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-sidebar-muted">
         {title}
       </h3>
     )}
     <nav className="space-y-1">{children}</nav>
   </div>
 );
 
 export function AppSidebar() {
   const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const role = user?.role;

  if (role === "SUPER_ADMIN") {
    return null;
  }

   return (
     <aside
       className={cn(
         "h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 sticky top-0",
         collapsed ? "w-[68px]" : "w-64"
       )}
     >
       {/* Logo Section */}
       <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
         <div className="flex items-center gap-3">
           <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
             <Shield className="h-5 w-5 text-primary-foreground" />
           </div>
           {!collapsed && (
             <div className="animate-fade-in">
               <h1 className="font-bold text-sidebar-foreground text-lg leading-none">
                 GuardForce
               </h1>
               <p className="text-xs text-sidebar-muted">Pro</p>
             </div>
           )}
         </div>
       </div>
 
       {/* Navigation */}
       <div className="flex-1 overflow-y-auto py-4 px-3">
         <NavGroup title="Overview" collapsed={collapsed}>
           <NavItem
             to="/"
             icon={LayoutDashboard}
             label="Dashboard"
             collapsed={collapsed}
           />
         </NavGroup>
 
         <NavGroup title="Workforce" collapsed={collapsed}>
          <NavItem
            to="/officers"
            icon={Users}
            label="Officers"
            collapsed={collapsed}
            badge={156}
            hidden={role === "OFFICER"}
          />
          <NavItem
            to="/subcontractors"
            icon={Briefcase}
            label="Subcontractors"
            collapsed={collapsed}
            hidden={role === "OFFICER"}
          />
          <NavItem
            to="/compliance"
            icon={ClipboardCheck}
            label="Compliance"
            collapsed={collapsed}
            badge={12}
            hidden={role === "OFFICER"}
          />
          {/* <NavItem
            to="/onboarding"
            icon={UserCheck}
            label="Onboarding"
            collapsed={collapsed}
            hidden={role === "OFFICER" || role === "FINANCE"}
          /> */}
         </NavGroup>
 
         <NavGroup title="Operations" collapsed={collapsed}>
           <NavItem
             to="/scheduling"
             icon={Calendar}
             label="Scheduling"
            collapsed={collapsed}
            hidden={role === "FINANCE" || role === "OFFICER"}
           />
           <NavItem
             to="/shifts"
             icon={Clock}
             label="Shift Monitor"
            collapsed={collapsed}
            badge={8}
           />
           <NavItem
             to="/sites"
             icon={MapPin}
             label="Sites"
            collapsed={collapsed}
           />
           <NavItem
             to="/clients"
             icon={Building2}
             label="Clients"
            collapsed={collapsed}
           />
         </NavGroup>
 
         <NavGroup title="Finance" collapsed={collapsed}>
          <NavItem
            to="/invoices"
            icon={Receipt}
            label="Invoices"
            collapsed={collapsed}
            hidden={role !== "FINANCE" && role !== "ADMIN" && role !== "OPS"}
          />
           <NavItem
             to="/payroll"
             icon={CreditCard}
             label="Payroll"
            collapsed={collapsed}
            hidden={role !== "FINANCE" && role !== "ADMIN"}
           />
           <NavItem
             to="/reports"
             icon={BarChart3}
             label="Reports"
            collapsed={collapsed}
           />
         </NavGroup>
 
         <NavGroup title="System" collapsed={collapsed}>
           <NavItem
             to="/notifications"
             icon={Bell}
             label="Notifications"
             collapsed={collapsed}
             badge={5}
           />
           <NavItem
             to="/settings"
             icon={Settings}
             label="Settings"
            collapsed={collapsed}
           />
         </NavGroup>
       </div>
 
       {/* Collapse Toggle */}
       <div className="p-3 border-t border-sidebar-border">
         <button
           onClick={() => setCollapsed(!collapsed)}
           className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
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