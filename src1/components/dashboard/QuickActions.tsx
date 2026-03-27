 import { Plus, Calendar, FileText, UserPlus, Send } from "lucide-react";
 import { Button } from "@/components/ui/button";
 
 interface QuickAction {
   icon: React.ElementType;
   label: string;
   description: string;
   onClick?: () => void;
 }
 
 const actions: QuickAction[] = [
   {
     icon: UserPlus,
     label: "Add Officer",
     description: "Register new officer",
   },
   {
     icon: Calendar,
     label: "Create Shift",
     description: "Schedule a new shift",
   },
   {
     icon: FileText,
     label: "Generate Invoice",
     description: "Create new invoice",
   },
   {
     icon: Send,
     label: "Broadcast",
     description: "Send notification",
   },
 ];
 
 export function QuickActions() {
   return (
     <div className="glass-card rounded-xl p-6">
       <div className="mb-4">
         <h3 className="font-semibold text-foreground">Quick Actions</h3>
         <p className="text-sm text-muted-foreground">Common tasks</p>
       </div>
       <div className="grid grid-cols-2 gap-3">
         {actions.map((action) => {
           const Icon = action.icon;
           return (
             <Button
               key={action.label}
               variant="outline"
               className="h-auto flex-col items-start p-4 gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all"
             >
               <div className="p-2 rounded-lg bg-primary/10">
                 <Icon className="h-4 w-4 text-primary" />
               </div>
               <div className="text-left">
                 <p className="font-medium text-sm">{action.label}</p>
                 <p className="text-xs text-muted-foreground">
                   {action.description}
                 </p>
               </div>
             </Button>
           );
         })}
       </div>
     </div>
   );
 }