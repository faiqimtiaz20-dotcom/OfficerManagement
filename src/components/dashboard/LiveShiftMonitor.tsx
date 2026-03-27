 import { Clock, MapPin, User, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface Shift {
   id: string;
   officer: string;
   site: string;
   status: "active" | "late" | "no-show";
   checkIn?: string;
   checkOut?: string;
 }
 
 const liveShifts: Shift[] = [
   {
     id: "1",
     officer: "James Wilson",
     site: "Westfield Shopping Centre",
     status: "active",
     checkIn: "08:00",
   },
   {
     id: "2",
     officer: "Sarah Connor",
     site: "HSBC Tower",
     status: "active",
     checkIn: "07:55",
   },
   {
     id: "3",
     officer: "Michael Brown",
     site: "Royal Hospital",
     status: "late",
     checkIn: "08:15",
   },
   {
     id: "4",
     officer: "Emma Davis",
     site: "Tech Park Building A",
     status: "no-show",
   },
   {
     id: "5",
     officer: "Robert Taylor",
     site: "Metro Station Central",
     status: "active",
     checkIn: "06:00",
   },
 ];
 
 const statusConfig = {
   active: {
     icon: CheckCircle,
     label: "On Site",
     className: "status-active",
   },
   late: {
     icon: AlertTriangle,
     label: "Late",
     className: "status-pending",
   },
   "no-show": {
     icon: XCircle,
     label: "No Show",
     className: "status-inactive",
   },
 };
 
 export function LiveShiftMonitor() {
   return (
     <div className="glass-card rounded-xl p-6">
       <div className="flex items-center justify-between mb-6">
         <div className="flex items-center gap-3">
           <div className="relative">
             <div className="w-3 h-3 bg-success rounded-full" />
             <div className="absolute inset-0 w-3 h-3 bg-success rounded-full animate-ping" />
           </div>
           <div>
             <h3 className="font-semibold text-foreground">Live Shift Monitor</h3>
             <p className="text-sm text-muted-foreground">Real-time status</p>
           </div>
         </div>
         <button className="text-sm text-primary hover:underline font-medium">
           View All
         </button>
       </div>
 
       <div className="space-y-3">
         {liveShifts.map((shift) => {
           const config = statusConfig[shift.status];
           const StatusIcon = config.icon;
 
           return (
             <div
               key={shift.id}
               className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
             >
               <div
                 className={cn(
                   "w-10 h-10 rounded-full flex items-center justify-center",
                   shift.status === "active"
                     ? "bg-success/10"
                     : shift.status === "late"
                     ? "bg-warning/10"
                     : "bg-destructive/10"
                 )}
               >
                 <User className="h-5 w-5 text-muted-foreground" />
               </div>
 
               <div className="flex-1 min-w-0">
                 <p className="font-medium text-foreground truncate">
                   {shift.officer}
                 </p>
                 <div className="flex items-center gap-1 text-sm text-muted-foreground">
                   <MapPin className="h-3 w-3" />
                   <span className="truncate">{shift.site}</span>
                 </div>
               </div>
 
               <div className="flex items-center gap-3">
                 {shift.checkIn && (
                   <div className="flex items-center gap-1 text-sm text-muted-foreground">
                     <Clock className="h-3.5 w-3.5" />
                     {shift.checkIn}
                   </div>
                 )}
                 <span className={cn("status-badge", config.className)}>
                   <StatusIcon className="h-3 w-3 mr-1" />
                   {config.label}
                 </span>
               </div>
             </div>
           );
         })}
       </div>
     </div>
   );
 }