 import { useState, useEffect } from "react";
 import { useSearchParams, useNavigate } from "react-router-dom";
 import { MainLayout } from "@/components/layout/MainLayout";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table";
 import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
   Plus,
   Search,
   Filter,
   MoreHorizontal,
   Eye,
   Edit,
   Trash2,
   Download,
   CheckCircle,
   Clock,
   XCircle,
   CreditCard,
   Ban,
   Columns3,
   MapPin,
   Calendar,
   Building2,
 } from "lucide-react";
 import { cn } from "@/lib/utils";
 import { useAuth } from "@/context/AuthContext";
 import { hasTenantFullAccess } from "@/lib/tenantPermissions";
import { AddOfficerModal, type AddOfficerFormData } from "@/components/officers/AddOfficerModal";
import { OfficerDetailSheet } from "@/components/officers/OfficerDetailSheet";
import { toast } from "sonner";
import { officersList, type Officer } from "@/data/officersMock";
import { getSubcontractorById } from "@/data/mockDb";
import { useOfficerTypes } from "@/context/OfficerTypesContext";

const officers = officersList;

const COLUMN_KEYS = [
  { id: "officer", label: "Officer", defaultVisible: true },
  { id: "officerId", label: "Officer ID", defaultVisible: true },
  { id: "phone", label: "Phone", defaultVisible: false },
  { id: "officerType", label: "Officer type", defaultVisible: true },
  { id: "subcontractor", label: "Subcontractor", defaultVisible: true },
  { id: "position", label: "Position", defaultVisible: true },
  { id: "siaLicense", label: "SIA licence", defaultVisible: true },
  { id: "siaExpiry", label: "SIA expiry", defaultVisible: true },
  { id: "status", label: "Status", defaultVisible: true },
  { id: "complianceStatus", label: "BS7858 status", defaultVisible: true },
] as const;

type ColumnId = (typeof COLUMN_KEYS)[number]["id"];

const defaultColumnVisibility: Record<ColumnId, boolean> = Object.fromEntries(
  COLUMN_KEYS.map((c) => [c.id, c.defaultVisible])
) as Record<ColumnId, boolean>;

 const statusConfig = {
   active: { label: "Active", className: "status-active", icon: CheckCircle },
   pending: { label: "Pending", className: "status-pending", icon: Clock },
   suspended: { label: "Suspended", className: "status-inactive", icon: XCircle },
 };
 
 const complianceConfig = {
   compliant: { label: "Compliant", className: "status-active" },
   pending: { label: "Pending", className: "status-pending" },
   expired: { label: "Expired", className: "status-inactive" },
 };
 
 export default function Officers() {
   const { user } = useAuth();
   const navigate = useNavigate();
   const { getById: getOfficerTypeById } = useOfficerTypes();
   const [searchQuery, setSearchQuery] = useState("");
   const [statusFilter, setStatusFilter] = useState("all");
   const [addModalOpen, setAddModalOpen] = useState(false);
   const [detailSheetOpen, setDetailSheetOpen] = useState(false);
   const [detailOfficer, setDetailOfficer] = useState<Officer | null>(null);
   const [preferredSideOfficer, setPreferredSideOfficer] = useState<Officer | null>(null);
   const [searchParams, setSearchParams] = useSearchParams();
   const [columnVisibility, setColumnVisibility] = useState<Record<ColumnId, boolean>>(defaultColumnVisibility);

   const setColumnVisible = (id: ColumnId, visible: boolean) => {
     setColumnVisibility((prev) => ({ ...prev, [id]: visible }));
   };
   const showAllColumns = () => {
     setColumnVisibility(Object.fromEntries(COLUMN_KEYS.map((c) => [c.id, true])) as Record<ColumnId, boolean>);
   };
   const showNoColumns = () => {
     setColumnVisibility(Object.fromEntries(COLUMN_KEYS.map((c) => [c.id, false])) as Record<ColumnId, boolean>);
   };

   const canAddOfficer = hasTenantFullAccess(user?.role) || user?.role === "HR";
   const canDeleteOfficer = hasTenantFullAccess(user?.role);
   const canEditOfficer = hasTenantFullAccess(user?.role) || user?.role === "HR";

   useEffect(() => {
     const viewId = searchParams.get("view");
     if (viewId && officersList.some((o) => o.id === viewId)) {
       navigate(`/officers/${viewId}`, { replace: true });
       setSearchParams({}, { replace: true });
     }
   }, [searchParams, setSearchParams, navigate]);

   const openDetailSheet = (officer: Officer) => {
     setDetailOfficer(officer);
     setDetailSheetOpen(true);
   };

   const openFullDetailPage = (officer: Officer) => {
     navigate(`/officers/${officer.id}`);
   };

   const handleAddOfficerSuccess = (data: AddOfficerFormData) => {
     toast.success("Officer added. In production this would open their profile.");
     setAddModalOpen(false);
     // Optional: open detail for a "new" officer - we don't have an id yet, so just close
   };

   const filteredOfficers = officers.filter((officer) => {
     const matchesSearch =
       officer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       officer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
       officer.siaLicense.includes(searchQuery);
     const matchesStatus =
       statusFilter === "all" || officer.status === statusFilter;
     return matchesSearch && matchesStatus;
   });
 
   return (
     <MainLayout title="Officers" subtitle="Manage your security workforce · BS7858 vetting status">
       <div className="space-y-6">
         {/* Header Actions */}
         <div className="flex flex-col sm:flex-row gap-4 justify-between">
           <div className="flex flex-1 gap-3">
             <div className="relative flex-1 max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                 placeholder="Search officers..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-9"
               />
             </div>
             <Select value={statusFilter} onValueChange={setStatusFilter}>
               <SelectTrigger className="w-40">
                 <Filter className="h-4 w-4 mr-2" />
                 <SelectValue placeholder="Status" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Status</SelectItem>
                 <SelectItem value="active">Active</SelectItem>
                 <SelectItem value="pending">Pending</SelectItem>
                 <SelectItem value="suspended">Suspended</SelectItem>
               </SelectContent>
             </Select>
           </div>
           <div className="flex gap-3">
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button variant="outline">
                   <Columns3 className="h-4 w-4 mr-2" />
                   Columns
                 </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-56 p-2">
                 <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                   {COLUMN_KEYS.map((col) => (
                     <label
                       key={col.id}
                       className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-accent"
                     >
                       <Checkbox
                         checked={columnVisibility[col.id]}
                         onCheckedChange={(checked) => setColumnVisible(col.id, checked === true)}
                       />
                       {col.label}
                     </label>
                   ))}
                 </div>
                 <div className="flex gap-2 pt-2 mt-2 border-t border-border">
                   <button
                     type="button"
                     className="text-xs text-primary hover:underline"
                     onClick={showAllColumns}
                   >
                     Show all
                   </button>
                   <button
                     type="button"
                     className="text-xs text-muted-foreground hover:underline"
                     onClick={showNoColumns}
                   >
                     Show none
                   </button>
                 </div>
               </DropdownMenuContent>
             </DropdownMenu>
             <Button variant="outline">
               <Download className="h-4 w-4 mr-2" />
               Export
             </Button>
             {canAddOfficer && (
               <Button className="gradient-primary" onClick={() => setAddModalOpen(true)}>
                 <Plus className="h-4 w-4 mr-2" />
                 Add Officer
               </Button>
             )}
           </div>
         </div>

         <AddOfficerModal
           open={addModalOpen}
           onOpenChange={setAddModalOpen}
           onSuccess={handleAddOfficerSuccess}
         />

         <OfficerDetailSheet
           officer={detailOfficer}
           open={detailSheetOpen}
           onOpenChange={setDetailSheetOpen}
         />

         <Sheet open={!!preferredSideOfficer} onOpenChange={(open) => !open && setPreferredSideOfficer(null)}>
           <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0">
             {preferredSideOfficer && (
               <>
                 <SheetHeader className="p-6 pb-4 border-b">
                   <div className="flex items-center gap-3">
                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                       <MapPin className="h-5 w-5 text-primary" />
                     </div>
                     <div className="min-w-0 flex-1">
                       <SheetTitle className="text-xl truncate">Preferred side</SheetTitle>
                       <p className="text-sm text-muted-foreground mt-0.5 truncate">
                         {preferredSideOfficer.name}
                       </p>
                     </div>
                   </div>
                 </SheetHeader>
                 <ScrollArea className="flex-1">
                   <div className="p-6 pt-2">
                     <p className="text-sm text-muted-foreground mb-3">
                       Previous sides this officer has worked:
                     </p>
                     {preferredSideOfficer.previousSides?.length ? (
                       <ul className="space-y-2">
                         {preferredSideOfficer.previousSides.map((side, i) => (
                           <li
                             key={i}
                             className="rounded-lg border bg-muted/30 px-4 py-3"
                           >
                             <div className="flex items-center gap-2 font-medium text-sm">
                               <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                               {side.sideName}
                             </div>
                             {side.clientName && (
                               <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                                 <Building2 className="h-3.5 w-3.5" />
                                 {side.clientName}
                               </div>
                             )}
                             <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                               <span className="flex items-center gap-1.5">
                                 <Clock className="h-3.5 w-3.5" />
                                 {side.totalHours} hrs total
                               </span>
                               <span className="flex items-center gap-1.5">
                                 <Calendar className="h-3.5 w-3.5" />
                                 Last shift:{" "}
                                 {new Date(side.lastShiftDate).toLocaleDateString("en-GB", {
                                   day: "2-digit",
                                   month: "short",
                                   year: "numeric",
                                 })}
                               </span>
                             </div>
                           </li>
                         ))}
                       </ul>
                     ) : (
                       <p className="text-sm text-muted-foreground rounded-lg border border-dashed bg-muted/20 px-4 py-6 text-center">
                         No previous sides recorded.
                       </p>
                     )}
                   </div>
                 </ScrollArea>
               </>
             )}
           </SheetContent>
         </Sheet>

         {/* Officers Table */}
         <div className="glass-card rounded-xl overflow-hidden">
           <div className="overflow-x-auto">
             <Table>
<TableHeader>
              <TableRow className="hover:bg-transparent">
                {columnVisibility.officer && (
                  <TableHead className="w-[300px]">Officer</TableHead>
                )}
                {columnVisibility.officerId && <TableHead>Officer ID</TableHead>}
                {columnVisibility.phone && <TableHead>Phone</TableHead>}
                {columnVisibility.officerType && <TableHead>Officer type</TableHead>}
                {columnVisibility.subcontractor && <TableHead>Subcontractor</TableHead>}
                {columnVisibility.position && <TableHead>Position</TableHead>}
                {columnVisibility.siaLicense && <TableHead>SIA licence</TableHead>}
                {columnVisibility.siaExpiry && <TableHead>SIA expiry</TableHead>}
                {columnVisibility.status && <TableHead>Status</TableHead>}
                {columnVisibility.complianceStatus && <TableHead>BS7858 status</TableHead>}
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
             </TableHeader>
             <TableBody>
               {filteredOfficers.map((officer) => {
                 const status = statusConfig[officer.status];
                 const compliance = complianceConfig[officer.complianceStatus];
                 const subcontractor = officer.subcontractorId
                   ? getSubcontractorById(officer.subcontractorId)
                   : null;
                 const officerTypeName = officer.officerTypeId
                   ? getOfficerTypeById(officer.officerTypeId)?.name
                   : null;

                 return (
                   <TableRow
                     key={officer.id}
                     className="group cursor-pointer"
                     onClick={() => openDetailSheet(officer)}
                   >
                     {columnVisibility.officer && (
                       <TableCell className="whitespace-nowrap">
                         <div className="flex items-center gap-3">
                           <Avatar className="h-10 w-10">
                             <AvatarImage src={officer.avatar} />
                             <AvatarFallback className="bg-primary/10 text-primary">
                               {officer.name
                                 .split(" ")
                                 .map((n) => n[0])
                                 .join("")}
                             </AvatarFallback>
                           </Avatar>
                           <div>
<p className="font-medium text-foreground">
                             {officer.name}
                           </p>
                           <p className="text-sm text-muted-foreground">
                             {officer.email}
                           </p>
                           </div>
                         </div>
                       </TableCell>
                     )}
                     {columnVisibility.officerId && (
                       <TableCell className="text-sm font-mono whitespace-nowrap">
                         {officer.id}
                       </TableCell>
                     )}
                     {columnVisibility.phone && (
                       <TableCell className="text-sm font-mono whitespace-nowrap">
                         {officer.phone || "—"}
                       </TableCell>
                     )}
                     {columnVisibility.officerType && (
                       <TableCell className="text-sm">
                         {officerTypeName ?? "—"}
                       </TableCell>
                     )}
                     {columnVisibility.subcontractor && (
                       <TableCell className="text-sm">
                         {subcontractor?.companyName ?? "—"}
                       </TableCell>
                     )}
                     {columnVisibility.position && (
                       <TableCell className="text-sm whitespace-nowrap">
                         {officer.position ?? "—"}
                       </TableCell>
                     )}
                     {columnVisibility.siaLicense && (
                       <TableCell className="whitespace-nowrap">
                         <div className="flex items-center gap-2">
                           <CreditCard className="h-4 w-4 shrink-0 text-muted-foreground" />
                           <span className="font-mono text-sm">
                             {officer.siaLicense.replace(/(.{4})/g, "$1 ").trim()}
                           </span>
                         </div>
                       </TableCell>
                     )}
                     {columnVisibility.siaExpiry && (
                       <TableCell className="whitespace-nowrap">
                         <span className="text-sm">
                           {new Date(officer.siaExpiry).toLocaleDateString("en-GB", {
                             day: "2-digit",
                             month: "short",
                             year: "numeric",
                           })}
                         </span>
                       </TableCell>
                     )}
                     {columnVisibility.status && (
                       <TableCell>
                         <span className={cn("status-badge", status.className)}>
                           <status.icon className="h-3 w-3 mr-1" />
                           {status.label}
                         </span>
                       </TableCell>
                     )}
                     {columnVisibility.complianceStatus && (
                       <TableCell>
                         <span
                           className={cn("status-badge", compliance.className)}
                         >
                           {compliance.label}
                         </span>
                       </TableCell>
                     )}
                     <TableCell onClick={(e) => e.stopPropagation()}>
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button
                             variant="ghost"
                             size="icon"
                             className="opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                             <MoreHorizontal className="h-4 w-4" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuItem onClick={() => openDetailSheet(officer)}>
                             <Eye className="h-4 w-4 mr-2" />
                             View details
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => setPreferredSideOfficer(officer)}>
                             <MapPin className="h-4 w-4 mr-2" />
                             Preferred side
                           </DropdownMenuItem>
                           {canEditOfficer && (
                             <DropdownMenuItem onClick={() => openFullDetailPage(officer)}>
                               <Edit className="h-4 w-4 mr-2" />
                               Edit
                             </DropdownMenuItem>
                           )}
                           {user?.role === "HR" && !canDeleteOfficer && (
                             <DropdownMenuItem>
                               <Ban className="h-4 w-4 mr-2" />
                               Suspend
                             </DropdownMenuItem>
                           )}
                           {canDeleteOfficer && (
                             <DropdownMenuItem className="text-destructive">
                               <Trash2 className="h-4 w-4 mr-2" />
                               Delete
                             </DropdownMenuItem>
                           )}
                         </DropdownMenuContent>
                       </DropdownMenu>
                     </TableCell>
                   </TableRow>
                 );
               })}
             </TableBody>
             </Table>
           </div>
         </div>
 
         {/* Pagination */}
         <div className="flex items-center justify-between">
           <p className="text-sm text-muted-foreground">
             Showing {filteredOfficers.length} of {officers.length} officers
           </p>
           <div className="flex gap-2">
             <Button variant="outline" size="sm" disabled>
               Previous
             </Button>
             <Button variant="outline" size="sm">
               Next
             </Button>
           </div>
         </div>
       </div>
     </MainLayout>
   );
 }