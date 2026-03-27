 import { AlertCircle, Calendar, CreditCard, FileCheck } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface Expiration {
   id: string;
   officer: string;
   type: "sia" | "dbs" | "training";
   expiryDate: string;
   daysLeft: number;
 }
 
 const expirations: Expiration[] = [
   {
     id: "1",
     officer: "John Smith",
     type: "sia",
     expiryDate: "15 Feb 2026",
     daysLeft: 10,
   },
   {
     id: "2",
     officer: "Emily Johnson",
     type: "dbs",
     expiryDate: "20 Feb 2026",
     daysLeft: 15,
   },
   {
     id: "3",
     officer: "David Williams",
     type: "training",
     expiryDate: "28 Feb 2026",
     daysLeft: 23,
   },
   {
     id: "4",
     officer: "Sophie Brown",
     type: "sia",
     expiryDate: "05 Mar 2026",
     daysLeft: 28,
   },
 ];
 
 const typeConfig = {
   sia: {
     icon: CreditCard,
     label: "SIA License",
     color: "text-primary",
     bg: "bg-primary/10",
   },
   dbs: {
     icon: FileCheck,
     label: "DBS Check",
     color: "text-info",
     bg: "bg-info/10",
   },
   training: {
     icon: Calendar,
     label: "Training",
     color: "text-warning",
     bg: "bg-warning/10",
   },
 };
 
 export function UpcomingExpirations() {
   return (
     <div className="glass-card rounded-xl p-6">
       <div className="flex items-center justify-between mb-6">
         <div className="flex items-center gap-3">
           <AlertCircle className="h-5 w-5 text-warning" />
           <div>
             <h3 className="font-semibold text-foreground">Upcoming Expirations</h3>
             <p className="text-sm text-muted-foreground">Next 30 days</p>
           </div>
         </div>
         <button className="text-sm text-primary hover:underline font-medium">
           View All
         </button>
       </div>
 
       <div className="space-y-3">
         {expirations.map((item) => {
           const config = typeConfig[item.type];
           const TypeIcon = config.icon;
           const isUrgent = item.daysLeft <= 14;
 
           return (
             <div
               key={item.id}
               className={cn(
                 "flex items-center gap-4 p-3 rounded-lg transition-colors",
                 isUrgent
                   ? "bg-destructive/5 border border-destructive/20"
                   : "bg-muted/30 hover:bg-muted/50"
               )}
             >
               <div className={cn("p-2 rounded-lg", config.bg)}>
                 <TypeIcon className={cn("h-4 w-4", config.color)} />
               </div>
 
               <div className="flex-1 min-w-0">
                 <p className="font-medium text-foreground">{item.officer}</p>
                 <p className="text-sm text-muted-foreground">{config.label}</p>
               </div>
 
               <div className="text-right">
                 <p
                   className={cn(
                     "font-semibold",
                     isUrgent ? "text-destructive" : "text-warning"
                   )}
                 >
                   {item.daysLeft} days
                 </p>
                 <p className="text-xs text-muted-foreground">{item.expiryDate}</p>
               </div>
             </div>
           );
         })}
       </div>
     </div>
   );
 }