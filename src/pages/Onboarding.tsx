 import { MainLayout } from "@/components/layout/MainLayout";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Progress } from "@/components/ui/progress";
 import { Badge } from "@/components/ui/badge";
 import {
   UserPlus,
   FileCheck,
   CreditCard,
   Shield,
   CheckCircle,
   Clock,
   ArrowRight,
 } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface OnboardingCandidate {
   id: string;
   name: string;
   email: string;
   stage: number;
   progress: number;
   startDate: string;
 }
 
 const candidates: OnboardingCandidate[] = [
   {
     id: "1",
     name: "Alex Thompson",
     email: "alex.t@email.com",
     stage: 3,
     progress: 60,
     startDate: "2026-01-20",
   },
   {
     id: "2",
     name: "Jessica Miller",
     email: "j.miller@email.com",
     stage: 2,
     progress: 40,
     startDate: "2026-01-28",
   },
   {
     id: "3",
     name: "Chris Anderson",
     email: "c.anderson@email.com",
     stage: 4,
     progress: 80,
     startDate: "2026-01-15",
   },
   {
     id: "4",
     name: "Rachel Green",
     email: "r.green@email.com",
     stage: 1,
     progress: 20,
     startDate: "2026-02-01",
   },
 ];
 
 const stages = [
   { id: 1, name: "Registration", icon: UserPlus },
   { id: 2, name: "Documents", icon: FileCheck },
   { id: 3, name: "SIA Verification", icon: CreditCard },
   { id: 4, name: "BS7858 Screening", icon: Shield },
   { id: 5, name: "Activation", icon: CheckCircle },
 ];
 
 export default function Onboarding() {
   return (
     <MainLayout
       title="Officer Onboarding"
       subtitle="Registration and vetting workflow"
     >
       <div className="space-y-6">
         {/* Pipeline Stats */}
         <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
           {stages.map((stage, idx) => (
             <Card
               key={stage.id}
               className={cn(
                 "glass-card",
                 idx === 0 && "border-primary/30"
               )}
             >
               <CardContent className="pt-4 text-center">
                 <div
                   className={cn(
                     "mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2",
                     "bg-primary/10"
                   )}
                 >
                   <stage.icon className="h-5 w-5 text-primary" />
                 </div>
                 <p className="text-xl font-bold">
                   {candidates.filter((c) => c.stage === stage.id).length}
                 </p>
                 <p className="text-xs text-muted-foreground">{stage.name}</p>
               </CardContent>
             </Card>
           ))}
         </div>
 
         {/* Onboarding Pipeline */}
         <Card className="glass-card">
           <CardHeader>
             <div className="flex items-center justify-between">
               <CardTitle>Active Onboarding</CardTitle>
               <Button className="gradient-primary">
                 <UserPlus className="h-4 w-4 mr-2" />
                 New Candidate
               </Button>
             </div>
           </CardHeader>
           <CardContent>
             <div className="space-y-4">
               {candidates.map((candidate) => {
                 const currentStage = stages[candidate.stage - 1];
                 return (
                   <div
                     key={candidate.id}
                     className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                   >
                     <div className="flex-1">
                       <div className="flex items-center gap-3 mb-2">
                         <p className="font-medium">{candidate.name}</p>
                         <Badge variant="outline" className="status-info">
                           <currentStage.icon className="h-3 w-3 mr-1" />
                           {currentStage.name}
                         </Badge>
                       </div>
                       <p className="text-sm text-muted-foreground mb-3">
                         {candidate.email}
                       </p>
                       <div className="flex items-center gap-4">
                         <Progress value={candidate.progress} className="flex-1 h-2" />
                         <span className="text-sm font-medium text-muted-foreground">
                           {candidate.progress}%
                         </span>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="text-sm text-muted-foreground mb-2">
                         Started {new Date(candidate.startDate).toLocaleDateString("en-GB")}
                       </p>
                       <Button size="sm" variant="outline">
                         Continue
                         <ArrowRight className="h-4 w-4 ml-1" />
                       </Button>
                     </div>
                   </div>
                 );
               })}
             </div>
           </CardContent>
         </Card>
       </div>
     </MainLayout>
   );
 }