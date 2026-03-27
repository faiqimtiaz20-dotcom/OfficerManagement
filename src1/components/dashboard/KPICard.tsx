 import { Link } from "react-router-dom";
 import { LucideIcon } from "lucide-react";
 import { cn } from "@/lib/utils";
 import { TrendingUp, TrendingDown } from "lucide-react";

 interface KPICardProps {
   title: string;
   value: string | number;
   icon: LucideIcon;
   trend?: {
     value: number;
     isPositive: boolean;
   };
   variant?: "default" | "success" | "warning" | "danger" | "info";
   subtitle?: string;
   to?: string;
 }
 
 const variantStyles = {
   default: "from-primary/10 to-primary/5 border-primary/20",
   success: "from-success/10 to-success/5 border-success/20",
   warning: "from-warning/10 to-warning/5 border-warning/20",
   danger: "from-destructive/10 to-destructive/5 border-destructive/20",
   info: "from-info/10 to-info/5 border-info/20",
 };
 
 const iconVariantStyles = {
   default: "bg-primary/10 text-primary",
   success: "bg-success/10 text-success",
   warning: "bg-warning/10 text-warning",
   danger: "bg-destructive/10 text-destructive",
   info: "bg-info/10 text-info",
 };
 
 export function KPICard({
   title,
   value,
   icon: Icon,
   trend,
   variant = "default",
   subtitle,
   to,
 }: KPICardProps) {
   const content = (
     <>
       <div className="flex items-start justify-between mb-4">
         <div
           className={cn(
             "p-2.5 rounded-lg",
             iconVariantStyles[variant]
           )}
         >
           <Icon className="h-5 w-5" />
         </div>
         {trend && (
           <div
             className={cn(
               "flex items-center gap-1 text-sm font-medium",
               trend.isPositive ? "text-success" : "text-destructive"
             )}
           >
             {trend.isPositive ? (
               <TrendingUp className="h-4 w-4" />
             ) : (
               <TrendingDown className="h-4 w-4" />
             )}
             {Math.abs(trend.value)}%
           </div>
         )}
       </div>
       <div className="kpi-value text-foreground">{value}</div>
       <div className="kpi-label mt-1">{title}</div>
       {subtitle && (
         <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
       )}
     </>
   );

   const className = cn(
     "kpi-card bg-gradient-to-br border",
     variantStyles[variant],
     to && "cursor-pointer hover:opacity-90 transition-opacity block"
   );

   if (to) {
     return (
       <Link to={to} className={className}>
         {content}
       </Link>
     );
   }

   return (
     <div className={className}>
     {content}
     </div>
   );
 }