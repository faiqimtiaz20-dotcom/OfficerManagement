 import { MainLayout } from "@/components/layout/MainLayout";
 import { Button } from "@/components/ui/button";
 import { Progress } from "@/components/ui/progress";
 import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
 } from "@/components/ui/card";
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import {
   Shield,
   FileCheck,
   CreditCard,
   AlertTriangle,
   CheckCircle,
   Clock,
   Users,
   Download,
   RefreshCw,
 } from "lucide-react";
 import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
 import { cn } from "@/lib/utils";

 const complianceStats = [
   {
     title: "BS7858 Compliant",
     value: 128,
     total: 156,
     percentage: 82,
     icon: Shield,
     color: "text-success",
     bg: "bg-success/10",
   },
   {
     title: "Valid SIA License",
     value: 142,
     total: 156,
     percentage: 91,
     icon: CreditCard,
     color: "text-primary",
     bg: "bg-primary/10",
   },
   {
     title: "DBS Verified",
     value: 135,
     total: 156,
     percentage: 87,
     icon: FileCheck,
     color: "text-info",
     bg: "bg-info/10",
   },
   {
     title: "Training Complete",
     value: 148,
     total: 156,
     percentage: 95,
     icon: Users,
     color: "text-warning",
     bg: "bg-warning/10",
   },
 ];
 
 const pendingItems = [
   {
     officer: "Michael Brown",
     officerId: "3",
     item: "SIA License Renewal",
     dueDate: "2026-02-28",
     priority: "high",
   },
   {
     officer: "Lucy Martinez",
     officerId: "6",
     item: "BS7858 Reference Check",
     dueDate: "2026-02-15",
     priority: "medium",
   },
   {
     officer: "David Wilson",
     officerId: "1",
     item: "DBS Update",
     dueDate: "2026-03-01",
     priority: "low",
   },
   {
     officer: "Sophie Taylor",
     officerId: "2",
     item: "Training Certification",
     dueDate: "2026-02-20",
     priority: "medium",
   },
 ];
 
 const priorityConfig = {
   high: { label: "High", className: "status-inactive" },
   medium: { label: "Medium", className: "status-pending" },
   low: { label: "Low", className: "status-info" },
 };
 
 export default function Compliance() {
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const filterExpiring = searchParams.get("filter") === "expiring";
   const [activeTab, setActiveTab] = useState<"pending" | "expiring" | "compliant">("pending");

   useEffect(() => {
     if (filterExpiring) setActiveTab("expiring");
   }, [filterExpiring]);

   const handleReview = (officerId: string) => {
     navigate(`/officers/${officerId}`);
   };

   return (
     <MainLayout
       title="Compliance Management"
       subtitle="BS7858 & SIA compliance tracking"
     >
       <div className="space-y-6">
         {/* Stats Cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           {complianceStats.map((stat) => (
             <Card key={stat.title} className="glass-card">
               <CardHeader className="pb-2">
                 <div className="flex items-center justify-between">
                   <div className={cn("p-2 rounded-lg", stat.bg)}>
                     <stat.icon className={cn("h-5 w-5", stat.color)} />
                   </div>
                   <span className={cn("text-2xl font-bold", stat.color)}>
                     {stat.percentage}%
                   </span>
                 </div>
               </CardHeader>
               <CardContent>
                 <p className="font-medium text-foreground">{stat.title}</p>
                 <p className="text-sm text-muted-foreground mb-3">
                   {stat.value} of {stat.total} officers
                 </p>
                 <Progress value={stat.percentage} className="h-2" />
               </CardContent>
             </Card>
           ))}
         </div>
 
         {/* Tabs */}
         <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "pending" | "expiring" | "compliant")} className="space-y-4">
           <div className="flex items-center justify-between">
             <TabsList>
               <TabsTrigger value="pending" className="gap-2">
                 <Clock className="h-4 w-4" />
                 Pending Actions
               </TabsTrigger>
               <TabsTrigger value="expiring" className="gap-2">
                 <AlertTriangle className="h-4 w-4" />
                 Expiring Soon
               </TabsTrigger>
               <TabsTrigger value="compliant" className="gap-2">
                 <CheckCircle className="h-4 w-4" />
                 Fully Compliant
               </TabsTrigger>
             </TabsList>
             <div className="flex gap-2">
               <Button variant="outline" size="sm">
                 <RefreshCw className="h-4 w-4 mr-2" />
                 Refresh
               </Button>
               <Button variant="outline" size="sm">
                 <Download className="h-4 w-4 mr-2" />
                 Export Report
               </Button>
             </div>
           </div>
 
           <TabsContent value="pending">
             <Card className="glass-card">
               <CardHeader>
                 <CardTitle>Pending Compliance Actions</CardTitle>
                 <CardDescription>
                   Items requiring immediate attention
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Officer</TableHead>
                       <TableHead>Item</TableHead>
                       <TableHead>Due Date</TableHead>
                       <TableHead>Priority</TableHead>
                       <TableHead>Action</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {pendingItems.map((item, i) => {
                       const priority = priorityConfig[item.priority];
                       return (
                         <TableRow key={i}>
                           <TableCell className="font-medium">
                             {item.officer}
                           </TableCell>
                           <TableCell>{item.item}</TableCell>
                           <TableCell>
                             {new Date(item.dueDate).toLocaleDateString("en-GB")}
                           </TableCell>
                           <TableCell>
                             <span
                               className={cn(
                                 "status-badge",
                                 priority.className
                               )}
                             >
                               {priority.label}
                             </span>
                           </TableCell>
                           <TableCell>
                             <Button
                               size="sm"
                               variant="outline"
                               onClick={() => handleReview(item.officerId)}
                             >
                               Review
                             </Button>
                           </TableCell>
                         </TableRow>
                       );
                     })}
                   </TableBody>
                 </Table>
               </CardContent>
             </Card>
           </TabsContent>
 
           <TabsContent value="expiring">
             <Card className="glass-card">
               <CardHeader>
                 <CardTitle>Expiring Certifications</CardTitle>
                 <CardDescription>
                   Documents expiring in the next 30 days
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="text-center py-12 text-muted-foreground">
                   <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                   <p>12 items expiring soon</p>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>
 
           <TabsContent value="compliant">
             <Card className="glass-card">
               <CardHeader>
                 <CardTitle>Fully Compliant Officers</CardTitle>
                 <CardDescription>
                   Officers meeting all BS7858 requirements
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="text-center py-12 text-muted-foreground">
                   <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success opacity-50" />
                   <p>128 officers fully compliant</p>
                 </div>
               </CardContent>
             </Card>
           </TabsContent>
         </Tabs>
       </div>
     </MainLayout>
   );
 }