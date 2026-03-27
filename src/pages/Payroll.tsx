 import { useState } from "react";
 import { MainLayout } from "@/components/layout/MainLayout";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table";
 import {
   PoundSterling,
   Clock,
   CheckCircle,
   Download,
   Send,
   Calculator,
   User,
   Building2,
 } from "lucide-react";
 import { cn } from "@/lib/utils";
import { toast } from "sonner";

 interface PayrollEntry {
   id: string;
   officer: string;
   hours: number;
   rate: number;
   overtime: number;
   total: number;
   status: "pending" | "approved" | "paid";
 }

 interface PayrollByClientEntry {
   id: string;
   client: string;
   hours: number;
   officerCount: number;
   total: number;
 }

 const payrollData: PayrollEntry[] = [
   { id: "1", officer: "James Wilson", hours: 40, rate: 12.50, overtime: 4, total: 575, status: "approved" },
   { id: "2", officer: "Sarah Connor", hours: 45, rate: 13.00, overtime: 8, total: 741, status: "pending" },
   { id: "3", officer: "Michael Brown", hours: 38, rate: 12.50, overtime: 0, total: 475, status: "approved" },
   { id: "4", officer: "Robert Taylor", hours: 42, rate: 14.00, overtime: 6, total: 714, status: "paid" },
   { id: "5", officer: "Emma Davis", hours: 35, rate: 12.50, overtime: 0, total: 437.50, status: "pending" },
 ];

 const payrollByClientData: PayrollByClientEntry[] = [
   { id: "1", client: "HSBC Holdings", hours: 120, officerCount: 4, total: 2150 },
   { id: "2", client: "Westfield Corporation", hours: 85, officerCount: 3, total: 1420 },
   { id: "3", client: "NHS Trust", hours: 76, officerCount: 2, total: 950 },
   { id: "4", client: "TechCorp Ltd", hours: 44, officerCount: 2, total: 612 },
 ];

 const statusConfig = {
   pending: { label: "Pending", className: "status-pending" },
   approved: { label: "Approved", className: "status-info" },
   paid: { label: "Paid", className: "status-active" },
 };

 export default function Payroll() {
   const totalPayroll = payrollData.reduce((sum, p) => sum + p.total, 0);
   const totalHours = payrollData.reduce((sum, p) => sum + p.hours + p.overtime, 0);
   const totalByClient = payrollByClientData.reduce((sum, p) => sum + p.total, 0);
 
  const handleExport = () => {
    toast.info("Payroll export will be enabled after backend reporting API is connected.");
  };

  const handleProcessPayroll = () => {
    toast.info("Payroll processing will be enabled after approval workflow API is connected.");
  };

  const handleApprove = (officer: string) => {
    toast.success(`${officer} marked approved in demo view.`);
  };

   return (
     <MainLayout title="Payroll" subtitle="Timesheet approval and pay processing">
       <div className="space-y-6">
         {/* Stats */}
         <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
           <Card className="glass-card">
             <CardContent className="pt-6">
               <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-primary/10">
                   <PoundSterling className="h-5 w-5 text-primary" />
                 </div>
                 <div>
                   <p className="text-2xl font-bold">£{totalPayroll.toLocaleString()}</p>
                   <p className="text-sm text-muted-foreground">Total Payroll</p>
                 </div>
               </div>
             </CardContent>
           </Card>
           <Card className="glass-card">
             <CardContent className="pt-6">
               <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-info/10">
                   <Clock className="h-5 w-5 text-info" />
                 </div>
                 <div>
                   <p className="text-2xl font-bold">{totalHours}</p>
                   <p className="text-sm text-muted-foreground">Total Hours</p>
                 </div>
               </div>
             </CardContent>
           </Card>
           <Card className="glass-card">
             <CardContent className="pt-6">
               <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-warning/10">
                   <Calculator className="h-5 w-5 text-warning" />
                 </div>
                 <div>
                   <p className="text-2xl font-bold">2</p>
                   <p className="text-sm text-muted-foreground">Pending Approval</p>
                 </div>
               </div>
             </CardContent>
           </Card>
           <Card className="glass-card">
             <CardContent className="pt-6">
               <div className="flex items-center gap-3">
                 <div className="p-2 rounded-lg bg-success/10">
                   <CheckCircle className="h-5 w-5 text-success" />
                 </div>
                 <div>
                   <p className="text-2xl font-bold">3</p>
                   <p className="text-sm text-muted-foreground">Ready to Process</p>
                 </div>
               </div>
             </CardContent>
           </Card>
         </div>
 
         {/* Actions */}
         <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={handleExport}>
             <Download className="h-4 w-4 mr-2" />
             Export CSV
           </Button>
          <Button className="gradient-primary" onClick={handleProcessPayroll}>
             <Send className="h-4 w-4 mr-2" />
             Process Payroll
           </Button>
         </div>
 
         {/* Summary by officer / by client */}
         <Card className="glass-card overflow-hidden">
           <CardHeader>
             <CardTitle>Weekly Timesheet - Week 6</CardTitle>
           </CardHeader>
           <CardContent className="p-0">
             <Tabs defaultValue="officer" className="w-full">
               <div className="px-6 pt-2">
                 <TabsList className="grid w-full max-w-xs grid-cols-2">
                   <TabsTrigger value="officer" className="flex items-center gap-2">
                     <User className="h-4 w-4" />
                     By officer
                   </TabsTrigger>
                   <TabsTrigger value="client" className="flex items-center gap-2">
                     <Building2 className="h-4 w-4" />
                     By client
                   </TabsTrigger>
                 </TabsList>
               </div>
               <TabsContent value="officer" className="mt-0">
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Officer</TableHead>
                       <TableHead className="text-right">Regular Hours</TableHead>
                       <TableHead className="text-right">Overtime</TableHead>
                       <TableHead className="text-right">Rate (£/hr)</TableHead>
                       <TableHead className="text-right">Total</TableHead>
                       <TableHead>Status</TableHead>
                       <TableHead>Action</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {payrollData.map((entry) => {
                       const status = statusConfig[entry.status];
                       return (
                         <TableRow key={entry.id}>
                           <TableCell className="font-medium">{entry.officer}</TableCell>
                           <TableCell className="text-right">{entry.hours}</TableCell>
                           <TableCell className="text-right">
                             {entry.overtime > 0 && (
                               <span className="text-warning">+{entry.overtime}</span>
                             )}
                             {entry.overtime === 0 && "-"}
                           </TableCell>
                           <TableCell className="text-right">£{entry.rate.toFixed(2)}</TableCell>
                           <TableCell className="text-right font-semibold">
                             £{entry.total.toFixed(2)}
                           </TableCell>
                           <TableCell>
                             <Badge variant="outline" className={cn("status-badge", status.className)}>
                               {status.label}
                             </Badge>
                           </TableCell>
                           <TableCell>
                             {entry.status === "pending" && (
                              <Button size="sm" variant="outline" onClick={() => handleApprove(entry.officer)}>
                                 Approve
                               </Button>
                             )}
                           </TableCell>
                         </TableRow>
                       );
                     })}
                   </TableBody>
                 </Table>
               </TabsContent>
               <TabsContent value="client" className="mt-0">
                 <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Client</TableHead>
                       <TableHead className="text-right">Hours</TableHead>
                       <TableHead className="text-right">Officers</TableHead>
                       <TableHead className="text-right">Total cost</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {payrollByClientData.map((entry) => (
                       <TableRow key={entry.id}>
                         <TableCell className="font-medium">{entry.client}</TableCell>
                         <TableCell className="text-right">{entry.hours}</TableCell>
                         <TableCell className="text-right">{entry.officerCount}</TableCell>
                         <TableCell className="text-right font-semibold">
                           £{entry.total.toLocaleString()}
                         </TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
                 <p className="text-sm text-muted-foreground px-6 py-3 border-t">
                   Total (by client): £{totalByClient.toLocaleString()}
                 </p>
               </TabsContent>
             </Tabs>
           </CardContent>
         </Card>
       </div>
     </MainLayout>
   );
 }