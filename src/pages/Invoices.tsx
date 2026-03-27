 import { useState } from "react";
 import { Navigate } from "react-router-dom";
 import { MainLayout } from "@/components/layout/MainLayout";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table";
 import {
   Plus,
   Search,
   Download,
   Send,
   Eye,
   MoreHorizontal,
   FileText,
   CheckCircle,
   Clock,
   XCircle,
   Receipt,
 } from "lucide-react";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 import { cn } from "@/lib/utils";
 import { useAuth } from "@/context/AuthContext";
 import { CreateInvoiceModal } from "@/components/invoices/CreateInvoiceModal";
import { toast } from "sonner";
 
 interface Invoice {
   id: string;
   number: string;
   client: string;
   amount: number;
   status: "draft" | "issued" | "paid" | "cancelled";
   date: string;
   dueDate: string;
 }
 
 const invoices: Invoice[] = [
   {
     id: "1",
     number: "INV-2026-001",
     client: "HSBC Holdings",
     amount: 24500,
     status: "paid",
     date: "2026-01-31",
     dueDate: "2026-02-28",
   },
   {
     id: "2",
     number: "INV-2026-002",
     client: "Westfield Corporation",
     amount: 18200,
     status: "issued",
     date: "2026-02-01",
     dueDate: "2026-03-01",
   },
   {
     id: "3",
     number: "INV-2026-003",
     client: "NHS Trust",
     amount: 15800,
     status: "issued",
     date: "2026-02-01",
     dueDate: "2026-03-01",
   },
   {
     id: "4",
     number: "INV-2026-004",
     client: "TechCorp Ltd",
     amount: 8500,
     status: "draft",
     date: "2026-02-05",
     dueDate: "2026-03-05",
   },
   {
     id: "5",
     number: "INV-2025-089",
     client: "Property Holdings",
     amount: 3200,
     status: "cancelled",
     date: "2025-12-15",
     dueDate: "2026-01-15",
   },
 ];
 
 const statusConfig = {
   draft: { label: "Draft", className: "status-info", icon: FileText },
   issued: { label: "Issued", className: "status-pending", icon: Clock },
   paid: { label: "Paid", className: "status-active", icon: CheckCircle },
   cancelled: { label: "Cancelled", className: "status-inactive", icon: XCircle },
 };
 
 const INVOICES_ROLES = ["FINANCE", "ADMIN", "OPS"];

 export default function Invoices() {
   const { user } = useAuth();
   const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

   if (!user || !INVOICES_ROLES.includes(user.role)) {
     return <Navigate to="/" replace />;
   }

   const canCreateAndAct =
     user?.role === "FINANCE" || user?.role === "ADMIN";

   const totalPaid = invoices
     .filter((i) => i.status === "paid")
     .reduce((sum, i) => sum + i.amount, 0);
   const totalOutstanding = invoices
     .filter((i) => i.status === "issued")
     .reduce((sum, i) => sum + i.amount, 0);
   const totalDraft = invoices
     .filter((i) => i.status === "draft")
     .reduce((sum, i) => sum + i.amount, 0);

  const handleInvoiceAction = (action: string, invoiceNumber: string) => {
    toast.info(`${action} for ${invoiceNumber} will be enabled once invoice APIs are connected.`);
  };

   return (
     <MainLayout title="Invoices" subtitle="Invoice management and billing">
       <div className="space-y-6">
         {/* Stats */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           <Card className="glass-card">
             <CardContent className="pt-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Total Paid</p>
                   <p className="text-2xl font-bold text-success">
                     £{totalPaid.toLocaleString()}
                   </p>
                 </div>
                 <div className="p-3 rounded-full bg-success/10">
                   <CheckCircle className="h-6 w-6 text-success" />
                 </div>
               </div>
             </CardContent>
           </Card>
           <Card className="glass-card">
             <CardContent className="pt-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Outstanding</p>
                   <p className="text-2xl font-bold text-warning">
                     £{totalOutstanding.toLocaleString()}
                   </p>
                 </div>
                 <div className="p-3 rounded-full bg-warning/10">
                   <Clock className="h-6 w-6 text-warning" />
                 </div>
               </div>
             </CardContent>
           </Card>
           <Card className="glass-card">
             <CardContent className="pt-6">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-muted-foreground">Draft</p>
                   <p className="text-2xl font-bold text-muted-foreground">
                     £{totalDraft.toLocaleString()}
                   </p>
                 </div>
                 <div className="p-3 rounded-full bg-muted">
                   <FileText className="h-6 w-6 text-muted-foreground" />
                 </div>
               </div>
             </CardContent>
           </Card>
         </div>
 
         {/* Actions */}
         <div className="flex flex-col sm:flex-row gap-4 justify-between">
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input placeholder="Search invoices..." className="pl-9" />
           </div>
           {canCreateAndAct && (
             <Button
               className="gradient-primary"
               onClick={() => setInvoiceModalOpen(true)}
             >
               <Plus className="h-4 w-4 mr-2" />
               Create Invoice
             </Button>
           )}
         </div>

         <CreateInvoiceModal
           open={invoiceModalOpen}
           onOpenChange={setInvoiceModalOpen}
           onSuccess={() => setInvoiceModalOpen(false)}
         />
 
         {/* Table */}
         <Card className="glass-card overflow-hidden">
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Invoice</TableHead>
                 <TableHead>Client</TableHead>
                 <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                {canCreateAndAct && (
                  <TableHead className="w-[50px]"></TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => {
                const status = statusConfig[invoice.status];
                return (
                  <TableRow key={invoice.id} className="group">
                    <TableCell className="font-mono font-medium">
                      {invoice.number}
                    </TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell className="font-semibold">
                      £{invoice.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.date).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.dueDate).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("status-badge", status.className)}
                      >
                        <status.icon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    {canCreateAndAct && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleInvoiceAction("View", invoice.number)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleInvoiceAction("Download PDF", invoice.number)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleInvoiceAction("Send Email", invoice.number)}>
                              <Send className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleInvoiceAction("Create Credit Note", invoice.number)}>
                              <Receipt className="h-4 w-4 mr-2" />
                              Create Credit Note
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
             </TableBody>
           </Table>
         </Card>
       </div>
     </MainLayout>
   );
 }