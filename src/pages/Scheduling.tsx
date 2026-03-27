 import { useState, useMemo, useEffect } from "react";
 import { useNavigate } from "react-router-dom";
 import { MainLayout } from "@/components/layout/MainLayout";
 import { Button } from "@/components/ui/button";
 import { Calendar } from "@/components/ui/calendar";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Badge } from "@/components/ui/badge";
 import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
 import {
   Plus,
   ChevronLeft,
   ChevronRight,
   MapPin,
   User,
   Calendar as CalendarIcon,
   MoreHorizontal,
   Pencil,
   UserPlus,
   XCircle,
   Search,
   Eye,
   Table as TableIcon,
   CalendarDays,
   SlidersHorizontal,
 } from "lucide-react";
 import { Label } from "@/components/ui/label";
 import { Checkbox } from "@/components/ui/checkbox";
 import {
   Popover,
   PopoverContent,
   PopoverTrigger,
 } from "@/components/ui/popover";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetFooter,
 } from "@/components/ui/sheet";
 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
 } from "@/components/ui/dialog";
 import { cn } from "@/lib/utils";
 import { useAuth } from "@/context/AuthContext";
 import { hasTenantFullAccess } from "@/lib/tenantPermissions";
 import { useSites } from "@/context/SitesContext";
 import { useDutyTypes } from "@/context/DutyTypesContext";
import { clientsList } from "@/data/clientsMock";
import { getClientById, mockDb } from "@/data/mockDb";
 import { CreateShiftModal, type CreateShiftFormData } from "@/components/scheduling/CreateShiftModal";
 import { fetchRatesForShift } from "@/api/ratesApi";
 import { toast } from "sonner";

 interface Shift {
   id: string;
   clientName: string;
   managerName: string;
   site: string;
   shiftDate: string;
   startTime: string;
   endTime: string;
   guardId: string;
   guardName: string;
   branch: string;
   hours: number;
   status: "confirmed" | "pending" | "unassigned";
   createdBy: string;
   /** Create-shift fields (optional for backward compatibility) */
   dutyTypeName?: string;
   breakMinutes?: number | string;
   chargeRate?: number | string;
   payRate?: number | string;
   currency?: string;
   precheckDue?: string;
   bookOnWindow?: string;
   checkCallSummary?: string;
 }

const sitesList = mockDb.sitesList;
const officersList = mockDb.officersList;

/** Build demo shifts from sites, clients, and officers mock data (same as used in Sites, Clients, Officers) */
 function buildDemoShifts(): Shift[] {
   const shifts: Shift[] = [];
   const baseDate = "07-12-2025";
   let id = 1;
   // Westfield Shopping Centre (site 1) – client Westfield Corporation
   const site1 = sitesList[0];
   const client1 = getClientById(site1.clientId);
   shifts.push(
     {
       id: String(id++),
       clientName: client1?.name ?? "—",
       managerName: site1.contact?.name ?? "—",
       site: site1.name,
       shiftDate: baseDate,
       startTime: "07:00",
       endTime: "19:00",
       guardId: "1",
       guardName: mockDb.officersList.find((o) => o.id === "1")?.name ?? "James Wilson",
       branch: "LON",
       hours: 12,
       status: "confirmed",
       createdBy: "saad.saif",
       dutyTypeName: "Static Guard",
       breakMinutes: 30,
       chargeRate: 14.5,
       payRate: 12.0,
       currency: "GBP",
       precheckDue: "90 min before start (05:30)",
       bookOnWindow: "15 min before – 30 min after start",
       checkCallSummary: "Every 60 min during shift",
     },
     {
       id: String(id++),
       clientName: client1?.name ?? "—",
       managerName: site1.contact?.name ?? "—",
       site: site1.name,
       shiftDate: baseDate,
       startTime: "19:00",
       endTime: "07:00",
       guardId: "5",
       guardName: mockDb.officersList.find((o) => o.id === "5")?.name ?? "Robert Taylor",
       branch: "LON",
       hours: 12,
       status: "confirmed",
       createdBy: "saad.saif",
       dutyTypeName: "Static Guard",
       breakMinutes: 0,
       chargeRate: 16.0,
       payRate: 12.0,
       currency: "GBP",
     }
   );
   // HSBC Tower (site 2) – client HSBC Holdings
   const site2 = sitesList[1];
   const client2 = getClientById(site2.clientId);
   shifts.push(
     {
       id: String(id++),
       clientName: client2?.name ?? "—",
       managerName: site2.contact?.name ?? "—",
       site: site2.name,
       shiftDate: baseDate,
       startTime: "08:00",
       endTime: "16:00",
       guardId: "2",
       guardName: mockDb.officersList.find((o) => o.id === "2")?.name ?? "Sarah Connor",
       branch: "LON",
       hours: 8,
       status: "confirmed",
       createdBy: "saad.saif",
       dutyTypeName: "Corporate Security",
       chargeRate: 15.0,
       payRate: 12.0,
       currency: "GBP",
     },
     {
       id: String(id++),
       clientName: client2?.name ?? "—",
       managerName: site2.contact?.name ?? "—",
       site: site2.name,
       shiftDate: baseDate,
       startTime: "06:00",
       endTime: "14:00",
       guardId: "3",
       guardName: mockDb.officersList.find((o) => o.id === "3")?.name ?? "Michael Brown",
       branch: "LON",
       hours: 8,
       status: "confirmed",
       createdBy: "saad.saif",
     },
     {
       id: String(id++),
       clientName: client2?.name ?? "—",
       managerName: site2.contact?.name ?? "—",
       site: site2.name,
       shiftDate: baseDate,
       startTime: "00:00",
       endTime: "08:00",
       guardId: "",
       guardName: "",
       branch: "LON",
       hours: 8,
       status: "unassigned",
       createdBy: "saad.saif",
     }
   );
   // Royal Hospital (site 3) – client NHS Trust
   const site3 = sitesList[2];
   const client3 = getClientById(site3.clientId);
   shifts.push({
     id: String(id++),
     clientName: client3?.name ?? "—",
     managerName: site3.contact?.name ?? "—",
     site: site3.name,
     shiftDate: baseDate,
     startTime: "07:00",
     endTime: "19:00",
     guardId: "1",
     guardName: mockDb.officersList.find((o) => o.id === "1")?.name ?? "James Wilson",
     branch: "LON",
     hours: 12,
     status: "pending",
     createdBy: "saad.saif",
     dutyTypeName: "Healthcare Security",
     chargeRate: 13.75,
     payRate: 11.5,
     currency: "GBP",
   });
   // Tech Park Building A (site 4) – client TechCorp Ltd
   const site4 = sitesList[3];
   const client4 = getClientById(site4.clientId);
   shifts.push({
     id: String(id++),
     clientName: client4?.name ?? "—",
     managerName: site4.contact?.name ?? "—",
     site: site4.name,
     shiftDate: baseDate,
     startTime: "09:00",
     endTime: "17:00",
     guardId: "5",
     guardName: mockDb.officersList.find((o) => o.id === "5")?.name ?? "Robert Taylor",
     branch: "MAN",
     hours: 8,
     status: "confirmed",
     createdBy: "saad.saif",
   });
   // Metro Station Central (site 5) – client Transport for London
   const site5 = sitesList[4];
   const client5 = getClientById(site5.clientId);
   shifts.push({
     id: String(id++),
     clientName: client5?.name ?? "—",
     managerName: site5.contact?.name ?? "—",
     site: site5.name,
     shiftDate: baseDate,
     startTime: "06:00",
     endTime: "14:00",
     guardId: "2",
     guardName: mockDb.officersList.find((o) => o.id === "2")?.name ?? "Sarah Connor",
     branch: "LON",
     hours: 8,
     status: "confirmed",
     createdBy: "saad.saif",
   });
   return shifts;
 }

 const todayShifts = buildDemoShifts();

 const statusConfig = {
   confirmed: { label: "Confirm", className: "bg-green-500 text-white border-0" },
   pending: { label: "Pending", className: "bg-amber-500 text-white border-0" },
   unassigned: { label: "Unassigned", className: "bg-destructive text-destructive-foreground border-0" },
 };

 const allSites = Array.from(new Set(todayShifts.map((s) => s.site)));
 const allBranches = Array.from(new Set(todayShifts.map((s) => s.branch)));
 
 export default function Scheduling() {
   const { user } = useAuth();
   const navigate = useNavigate();
   const { sites, getSiteById } = useSites();
   const { dutyTypes } = useDutyTypes();
   const [shifts, setShifts] = useState<Shift[]>(todayShifts);
   const [date, setDate] = useState<Date | undefined>(new Date());
   const [createModalOpen, setCreateModalOpen] = useState(false);
   const [viewSheetOpen, setViewSheetOpen] = useState(false);
   const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
   const [editModalOpen, setEditModalOpen] = useState(false);
   const [shiftToEdit, setShiftToEdit] = useState<Shift | null>(null);
   const [editForm, setEditForm] = useState<Shift | null>(null);
   const [editRatesLoading, setEditRatesLoading] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [filterStatus, setFilterStatus] = useState<string>("confirmed");
   const [filterSite, setFilterSite] = useState<string>("all");
   const [filterBranch, setFilterBranch] = useState<string>("all");
   const [filterDatePreset, setFilterDatePreset] = useState<string>("all");
   const [advancedOpen, setAdvancedOpen] = useState(false);
   const [filterDateFrom, setFilterDateFrom] = useState("");
   const [filterDateTo, setFilterDateTo] = useState("");
   const [filterStatuses, setFilterStatuses] = useState<("confirmed" | "pending" | "unassigned")[]>([]);
   const [filterClient, setFilterClient] = useState("");
   const [filterManager, setFilterManager] = useState("");
   const [filterSiteText, setFilterSiteText] = useState("");
   const [filterGuard, setFilterGuard] = useState("");

   const parseShiftDate = (s: string) => {
     const [d, m, y] = s.split("-").map(Number);
     return new Date(y, m - 1, d);
   };

   const toDDMMYYYY = (date: Date) => {
     const d = date.getDate();
     const m = date.getMonth() + 1;
     const y = date.getFullYear();
     return `${String(d).padStart(2, "0")}-${String(m).padStart(2, "0")}-${y}`;
   };

   const displayedShifts = useMemo(() => {
     let list = shifts;
     if (searchQuery.trim()) {
       const q = searchQuery.toLowerCase();
       list = list.filter(
         (s) =>
           s.clientName.toLowerCase().includes(q) ||
           s.managerName.toLowerCase().includes(q) ||
           s.site.toLowerCase().includes(q) ||
           s.guardName.toLowerCase().includes(q) ||
           s.guardId.toLowerCase().includes(q)
       );
     }
     if (filterStatuses.length > 0) {
       list = list.filter((s) => filterStatuses.includes(s.status));
     } else if (filterStatus !== "all") {
       list = list.filter((s) => s.status === filterStatus);
     }
     if (filterSite !== "all") {
       list = list.filter((s) => s.site === filterSite);
     }
     if (filterBranch !== "all") {
       list = list.filter((s) => s.branch === filterBranch);
     }
     if (filterClient.trim()) {
       const q = filterClient.toLowerCase();
       list = list.filter((s) => s.clientName.toLowerCase().includes(q));
     }
     if (filterManager.trim()) {
       const q = filterManager.toLowerCase();
       list = list.filter((s) => s.managerName.toLowerCase().includes(q));
     }
     if (filterGuard.trim()) {
       const q = filterGuard.toLowerCase();
       list = list.filter(
         (s) =>
           s.guardId.toLowerCase().includes(q) || s.guardName.toLowerCase().includes(q)
       );
     }
     if (filterSiteText.trim()) {
       const q = filterSiteText.toLowerCase();
       list = list.filter((s) => s.site.toLowerCase().includes(q));
     }
     if (filterDateFrom) {
       const from = new Date(filterDateFrom);
       from.setHours(0, 0, 0, 0);
       list = list.filter((s) => parseShiftDate(s.shiftDate).getTime() >= from.getTime());
     }
     if (filterDateTo) {
       const to = new Date(filterDateTo);
       to.setHours(23, 59, 59, 999);
       list = list.filter((s) => parseShiftDate(s.shiftDate).getTime() <= to.getTime());
     }
     if (filterDatePreset !== "all") {
       const now = new Date();
       const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
       const todayStr = toDDMMYYYY(today);
       const yesterday = new Date(today);
       yesterday.setDate(yesterday.getDate() - 1);
       const yesterdayStr = toDDMMYYYY(yesterday);
       const tomorrow = new Date(today);
       tomorrow.setDate(tomorrow.getDate() + 1);
       const tomorrowStr = toDDMMYYYY(tomorrow);

       if (filterDatePreset === "today") {
         list = list.filter((s) => s.shiftDate === todayStr);
       } else if (filterDatePreset === "yesterday") {
         list = list.filter((s) => s.shiftDate === yesterdayStr);
       } else if (filterDatePreset === "tomorrow") {
         list = list.filter((s) => s.shiftDate === tomorrowStr);
       } else if (filterDatePreset === "this_week") {
         const dayOfWeek = now.getDay();
         const startOfWeek = new Date(today);
         startOfWeek.setDate(today.getDate() - dayOfWeek);
         const endOfWeek = new Date(startOfWeek);
         endOfWeek.setDate(startOfWeek.getDate() + 6);
         endOfWeek.setHours(23, 59, 59, 999);
         const startT = startOfWeek.getTime();
         const endT = endOfWeek.getTime();
         list = list.filter((s) => {
           const t = parseShiftDate(s.shiftDate).getTime();
           return t >= startT && t <= endT;
         });
       } else if (filterDatePreset === "last_week") {
         const dayOfWeek = now.getDay();
         const startOfThisWeek = new Date(today);
         startOfThisWeek.setDate(today.getDate() - dayOfWeek);
         const startOfLastWeek = new Date(startOfThisWeek);
         startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
         const endOfLastWeek = new Date(startOfLastWeek);
         endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
         endOfLastWeek.setHours(23, 59, 59, 999);
         const startT = startOfLastWeek.getTime();
         const endT = endOfLastWeek.getTime();
         list = list.filter((s) => {
           const t = parseShiftDate(s.shiftDate).getTime();
           return t >= startT && t <= endT;
         });
       } else if (filterDatePreset === "next_week") {
         const dayOfWeek = now.getDay();
         const startOfThisWeek = new Date(today);
         startOfThisWeek.setDate(today.getDate() - dayOfWeek);
         const startOfNextWeek = new Date(startOfThisWeek);
         startOfNextWeek.setDate(startOfThisWeek.getDate() + 7);
         const endOfNextWeek = new Date(startOfNextWeek);
         endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
         endOfNextWeek.setHours(23, 59, 59, 999);
         const startT = startOfNextWeek.getTime();
         const endT = endOfNextWeek.getTime();
         list = list.filter((s) => {
           const t = parseShiftDate(s.shiftDate).getTime();
           return t >= startT && t <= endT;
         });
       } else if (filterDatePreset === "this_month") {
         const month = now.getMonth();
         const year = now.getFullYear();
         list = list.filter((s) => {
           const d = parseShiftDate(s.shiftDate);
           return d.getMonth() === month && d.getFullYear() === year;
         });
       } else if (filterDatePreset === "last_month") {
         const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
         const month = lastMonth.getMonth();
         const year = lastMonth.getFullYear();
         list = list.filter((s) => {
           const d = parseShiftDate(s.shiftDate);
           return d.getMonth() === month && d.getFullYear() === year;
         });
       } else if (filterDatePreset === "next_month") {
         const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
         const month = nextMonth.getMonth();
         const year = nextMonth.getFullYear();
         list = list.filter((s) => {
           const d = parseShiftDate(s.shiftDate);
           return d.getMonth() === month && d.getFullYear() === year;
         });
       } else if (filterDatePreset === "this_year") {
         const year = now.getFullYear();
         list = list.filter((s) => parseShiftDate(s.shiftDate).getFullYear() === year);
       } else if (filterDatePreset === "last_year") {
         const year = now.getFullYear() - 1;
         list = list.filter((s) => parseShiftDate(s.shiftDate).getFullYear() === year);
       }
     }
     return list;
   }, [
     shifts,
     searchQuery,
     filterStatus,
     filterSite,
     filterBranch,
     filterDatePreset,
     filterDateFrom,
     filterDateTo,
     filterStatuses,
     filterClient,
     filterManager,
     filterSiteText,
     filterGuard,
   ]);

   const hasActiveAdvancedFilters =
     filterDateFrom ||
     filterDateTo ||
     filterStatuses.length > 0 ||
     filterClient.trim() ||
     filterManager.trim() ||
     filterSiteText.trim() ||
     filterGuard.trim();

   const clearAdvancedFilters = () => {
     setFilterDateFrom("");
     setFilterDateTo("");
     setFilterStatuses([]);
     setFilterClient("");
     setFilterManager("");
     setFilterSiteText("");
     setFilterGuard("");
   };

   const toggleStatusFilter = (status: "confirmed" | "pending" | "unassigned") => {
     setFilterStatuses((prev) =>
       prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
     );
   };

   const canCreateEditShifts =
     hasTenantFullAccess(user?.role) || user?.role === "OPS" || user?.role === "SCHEDULER";

   const openViewDetails = (shift: Shift) => {
     setSelectedShift(shift);
     setViewSheetOpen(true);
   };

   const openEditShift = (shift: Shift) => {
     setShiftToEdit(shift);
     setEditForm(shift ? { ...shift } : null);
     setEditModalOpen(true);
     setViewSheetOpen(false);
   };

   const updateEditForm = <K extends keyof Shift>(field: K, value: Shift[K]) => {
     setEditForm((prev) => (prev ? { ...prev, [field]: value } : null));
   };

   useEffect(() => {
     if (!editModalOpen || !editForm?.site || !editForm?.dutyTypeName) return;
     const site = sites.find((s) => s.name === editForm.site);
     const dutyTypeId = dutyTypes.find((d) => d.name === editForm.dutyTypeName)?.id;
     if (!site || !dutyTypeId) return;
     setEditRatesLoading(true);
     fetchRatesForShift(site, dutyTypeId)
       .then((r) => {
         setEditForm((prev) =>
           prev
             ? { ...prev, chargeRate: r.chargeRate, payRate: r.payRate, currency: r.currency }
             : null
         );
       })
       .finally(() => setEditRatesLoading(false));
   }, [editModalOpen, editForm?.site, editForm?.dutyTypeName, sites, dutyTypes]);

   const handleUpdateShift = () => {
     if (!editForm) return;
     setShifts((prev) => prev.map((s) => (s.id === editForm.id ? editForm : s)));
     setEditModalOpen(false);
     setShiftToEdit(null);
     setEditForm(null);
     setViewSheetOpen(false);
     toast.success("Shift updated successfully.");
   };

   const handleCreateShiftSuccess = (data: CreateShiftFormData) => {
     const count = data.shifts?.length ?? 0;
     toast.success(
       count > 0
         ? `${count} shift(s) created at ${data.siteName}. In production these would appear in the list.`
         : `Shift data saved at ${data.siteName}. Add at least one shift row.`
     );
     setCreateModalOpen(false);
   };

   const handlePrevDay = () => {
     if (!date) return;
     const d = new Date(date);
     d.setDate(d.getDate() - 1);
     setDate(d);
   };

   const handleNextDay = () => {
     if (!date) return;
     const d = new Date(date);
     d.setDate(d.getDate() + 1);
     setDate(d);
   };

  const calendarDayShifts = useMemo(() => {
    if (!date) return shifts;
    const selected = toDDMMYYYY(date);
    return shifts.filter((s) => s.shiftDate === selected);
  }, [date, shifts]);

  const calendarConfirmed = calendarDayShifts.filter((s) => s.status === "confirmed").length;
  const calendarPending = calendarDayShifts.filter((s) => s.status === "pending").length;
  const calendarUnassigned = calendarDayShifts.filter((s) => s.status === "unassigned").length;

   return (
     <MainLayout
       title="Scheduling"
       subtitle="Manage shifts and officer assignments"
     >
       <Tabs defaultValue="table" className="space-y-4">
         {/* Top bar: Table | Calendar tabs + Create Shift */}
         <div className="flex flex-wrap items-center justify-between gap-4">
           <TabsList className="grid w-full max-w-[240px] grid-cols-2 bg-muted/50">
             <TabsTrigger value="table" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
               <TableIcon className="h-4 w-4" />
               Table
             </TabsTrigger>
             <TabsTrigger value="calendar" className="gap-2">
               <CalendarDays className="h-4 w-4" />
               Calendar
             </TabsTrigger>
           </TabsList>
           {canCreateEditShifts && (
             <>
               <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setCreateModalOpen(true)}>
                 <Plus className="h-4 w-4 mr-2" />
                 Create Shift
               </Button>
               <CreateShiftModal
                 open={createModalOpen}
                 onOpenChange={setCreateModalOpen}
                 onSuccess={handleCreateShiftSuccess}
               />
             </>
           )}
         </div>

         {/* Table view (default) */}
         <TabsContent value="table" className="mt-0 space-y-4">
           {/* Filter row: Search + Status, Sites, Branches */}
           <div className="flex flex-wrap items-center gap-3">
             <div className="relative flex-1 min-w-[200px] max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                 placeholder="Search by client, guard, site..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-9 h-9 bg-muted/30 border-muted-foreground/20"
               />
             </div>
             <Select value={filterDatePreset} onValueChange={setFilterDatePreset}>
               <SelectTrigger className="w-[140px] h-9 bg-muted/30 border-muted-foreground/20">
                 <SelectValue placeholder="Date" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All dates</SelectItem>
                 <SelectItem value="today">Today</SelectItem>
                 <SelectItem value="yesterday">Yesterday</SelectItem>
                 <SelectItem value="tomorrow">Tomorrow</SelectItem>
                 <SelectItem value="this_week">This week</SelectItem>
                 <SelectItem value="last_week">Last week</SelectItem>
                 <SelectItem value="next_week">Next week</SelectItem>
                 <SelectItem value="this_month">This month</SelectItem>
                 <SelectItem value="last_month">Last month</SelectItem>
                 <SelectItem value="next_month">Next month</SelectItem>
                 <SelectItem value="this_year">This year</SelectItem>
                 <SelectItem value="last_year">Last year</SelectItem>
               </SelectContent>
             </Select>
             <Select value={filterStatus} onValueChange={setFilterStatus}>
               <SelectTrigger className="w-[140px] h-9 bg-muted/30 border-muted-foreground/20">
                 <SelectValue placeholder="All Status" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Status</SelectItem>
                 <SelectItem value="confirmed">Confirm</SelectItem>
                 <SelectItem value="pending">Pending</SelectItem>
                 <SelectItem value="unassigned">Unassigned</SelectItem>
               </SelectContent>
             </Select>
             <Select value={filterSite} onValueChange={setFilterSite}>
               <SelectTrigger className="w-[180px] h-9 bg-muted/30 border-muted-foreground/20">
                 <SelectValue placeholder="All Sites" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Sites</SelectItem>
                 {allSites.map((site) => (
                   <SelectItem key={site} value={site}>
                     {site.length > 35 ? site.slice(0, 35) + "..." : site}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
             <Select value={filterBranch} onValueChange={setFilterBranch}>
               <SelectTrigger className="w-[140px] h-9 bg-muted/30 border-muted-foreground/20">
                 <SelectValue placeholder="All Branches" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Branches</SelectItem>
                 {allBranches.map((branch) => (
                   <SelectItem key={branch} value={branch}>
                     {branch}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
             <Popover open={advancedOpen} onOpenChange={setAdvancedOpen}>
               <PopoverTrigger asChild>
                 <Button
                   variant={hasActiveAdvancedFilters ? "secondary" : "outline"}
                   size="sm"
                   className="h-9 gap-2"
                 >
                   <SlidersHorizontal className="h-4 w-4" />
                   Advanced filter
                   {hasActiveAdvancedFilters && (
                     <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                       On
                     </Badge>
                   )}
                 </Button>
               </PopoverTrigger>
               <PopoverContent className="w-80 p-0 max-h-[85vh] flex flex-col" align="end">
                 <div className="p-3 border-b bg-muted/30 shrink-0">
                   <h4 className="font-medium text-sm">Filter shifts</h4>
                   <p className="text-xs text-muted-foreground mt-0.5">
                     Add more criteria below
                   </p>
                 </div>
                 <div className="p-3 space-y-3 overflow-y-auto overscroll-contain min-h-0 max-h-[60vh]">
                   <div className="space-y-1.5">
                     <Label className="text-xs">Date range</Label>
                     <div className="grid grid-cols-2 gap-2">
                       <div>
                         <Label className="text-[10px] text-muted-foreground">From</Label>
                         <Input
                           type="date"
                           value={filterDateFrom}
                           onChange={(e) => setFilterDateFrom(e.target.value)}
                           className="h-8 text-xs"
                         />
                       </div>
                       <div>
                         <Label className="text-[10px] text-muted-foreground">To</Label>
                         <Input
                           type="date"
                           value={filterDateTo}
                           onChange={(e) => setFilterDateTo(e.target.value)}
                           className="h-8 text-xs"
                         />
                       </div>
                     </div>
                   </div>
                   <div className="space-y-1.5">
                     <Label className="text-xs">Status</Label>
                     <div className="flex flex-wrap gap-3">
                       {(["confirmed", "pending", "unassigned"] as const).map((status) => (
                         <label
                           key={status}
                           className="flex items-center gap-2 cursor-pointer text-xs"
                         >
                           <Checkbox
                             checked={filterStatuses.includes(status)}
                             onCheckedChange={() => toggleStatusFilter(status)}
                           />
                           {statusConfig[status].label}
                         </label>
                       ))}
                     </div>
                   </div>
                   <div className="space-y-1.5">
                     <Label className="text-xs">Client name</Label>
                     <Input
                       placeholder="Search client..."
                       value={filterClient}
                       onChange={(e) => setFilterClient(e.target.value)}
                       className="h-8 text-xs"
                     />
                   </div>
                   <div className="space-y-1.5">
                     <Label className="text-xs">Manager name</Label>
                     <Input
                       placeholder="Search manager..."
                       value={filterManager}
                       onChange={(e) => setFilterManager(e.target.value)}
                       className="h-8 text-xs"
                     />
                   </div>
                   <div className="space-y-1.5">
                     <Label className="text-xs">Site</Label>
                     <Input
                       placeholder="Search site..."
                       value={filterSiteText}
                       onChange={(e) => setFilterSiteText(e.target.value)}
                       className="h-8 text-xs"
                     />
                   </div>
                   <div className="space-y-1.5">
                     <Label className="text-xs">Guard detail</Label>
                     <Input
                       placeholder="ID or name..."
                       value={filterGuard}
                       onChange={(e) => setFilterGuard(e.target.value)}
                       className="h-8 text-xs"
                     />
                   </div>
                 </div>
                 <div className="p-3 border-t flex justify-between gap-2 shrink-0 bg-background">
                   <Button
                     variant="ghost"
                     size="sm"
                     className="text-xs"
                     onClick={clearAdvancedFilters}
                   >
                     Clear all
                   </Button>
                   <Button size="sm" className="text-xs" onClick={() => setAdvancedOpen(false)}>
                     Done
                   </Button>
                 </div>
               </PopoverContent>
             </Popover>
           </div>

           {/* Table */}
           <Card className="border rounded-lg overflow-hidden">
             <div className="overflow-x-auto">
               <Table>
                 <TableHeader>
                   <TableRow className="bg-muted/30 hover:bg-muted/30 border-b">
                     <TableHead className="font-medium text-muted-foreground">S.No</TableHead>
                     <TableHead className="font-medium text-muted-foreground">Client Name</TableHead>
                     <TableHead className="font-medium text-muted-foreground">Manager Name</TableHead>
                     <TableHead className="font-medium text-muted-foreground min-w-[160px]">Site</TableHead>
                     <TableHead className="font-medium text-muted-foreground whitespace-nowrap">Shift Date</TableHead>
                     <TableHead className="font-medium text-muted-foreground whitespace-nowrap">Time In-Out</TableHead>
                     <TableHead className="font-medium text-muted-foreground">Guard Detail</TableHead>
                     <TableHead className="font-medium text-muted-foreground">Branch</TableHead>
                     <TableHead className="font-medium text-muted-foreground">Hours</TableHead>
                     <TableHead className="font-medium text-muted-foreground">Status</TableHead>
                     <TableHead className="font-medium text-muted-foreground">Created by</TableHead>
                     <TableHead className="font-medium text-muted-foreground w-16">Action</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {displayedShifts.map((shift, index) => {
                     const status = statusConfig[shift.status];
                     const guardDetail =
                       shift.guardId && shift.guardName
                         ? `${shift.guardId}- ${shift.guardName.toUpperCase()}`
                         : "";
                     return (
                       <TableRow
                         key={shift.id}
                         className={cn(
                           "border-b",
                           index % 2 === 1 && "bg-muted/20"
                         )}
                       >
                         <TableCell className="font-medium">{index + 1}</TableCell>
                         <TableCell className="text-sm">
                           {(() => {
                             const clientId = clientsList.find((c) => c.name === shift.clientName)?.id;
                             if (clientId) {
                               return (
                                 <button
                                   type="button"
                                   className="font-medium text-left hover:opacity-80"
                                   onClick={() => navigate(`/clients/${clientId}`)}
                                 >
                                   {shift.clientName}
                                 </button>
                               );
                             }
                             return <span>{shift.clientName}</span>;
                           })()}
                         </TableCell>
                         <TableCell className="text-sm">{shift.managerName}</TableCell>
                         <TableCell className="text-sm max-w-[200px] truncate" title={shift.site}>
                           {(() => {
                             const siteId = sites.find((s) => s.name === shift.site)?.id;
                             if (siteId) {
                               return (
                                 <button
                                   type="button"
                                   className="font-medium text-left truncate block max-w-full hover:opacity-80"
                                   onClick={() => navigate(`/sites/${siteId}`)}
                                 >
                                   {shift.site}
                                 </button>
                               );
                             }
                             return <span>{shift.site}</span>;
                           })()}
                         </TableCell>
                         <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                           {shift.shiftDate}
                         </TableCell>
                         <TableCell className="text-sm whitespace-nowrap">
                           {shift.startTime} - {shift.endTime}
                         </TableCell>
                         <TableCell>
                           {guardDetail && shift.guardId ? (
                             <button
                               type="button"
                               className="text-sm font-medium hover:opacity-80"
                               onClick={() => navigate(`/officers/${shift.guardId}`)}
                             >
                               {guardDetail}
                             </button>
                           ) : guardDetail ? (
                             <span className="text-sm font-medium">{guardDetail}</span>
                           ) : (
                             <span className="text-muted-foreground italic text-sm">No guard assigned</span>
                           )}
                         </TableCell>
                         <TableCell className="text-sm">{shift.branch}</TableCell>
                         <TableCell className="text-sm">{shift.hours}</TableCell>
                         <TableCell>
                           <Badge className={cn("text-xs font-medium", status.className)}>
                             {status.label}
                           </Badge>
                         </TableCell>
                         <TableCell className="text-sm text-muted-foreground">{shift.createdBy}</TableCell>
                         <TableCell>
                           <div className="flex items-center gap-1">
                             <Button
                               variant="ghost"
                               size="icon"
                               className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                               aria-label="View"
                               onClick={() => openViewDetails(shift)}
                             >
                               <Eye className="h-4 w-4" />
                             </Button>
                             {canCreateEditShifts && (
                               <Button
                                 variant="ghost"
                                 size="icon"
                                 className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                 aria-label="Edit"
                                 onClick={() => openEditShift(shift)}
                               >
                                 <Pencil className="h-4 w-4" />
                               </Button>
                             )}
                           </div>
                         </TableCell>
                       </TableRow>
                     );
                   })}
                 </TableBody>
               </Table>
             </div>
           </Card>
         </TabsContent>

         {/* Calendar view */}
         <TabsContent value="calendar" className="mt-0">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <Card className="glass-card">
               <CardHeader className="pb-2">
                 <CardTitle className="text-lg">Calendar</CardTitle>
               </CardHeader>
               <CardContent>
                 <Calendar
                   mode="single"
                   selected={date}
                   onSelect={setDate}
                   className="rounded-md w-full"
                 />
                 <div className="mt-4 space-y-2">
                   <div className="flex items-center gap-2 text-sm">
                     <div className="w-3 h-3 rounded-full bg-success" />
                     <span className="text-muted-foreground">All shifts filled</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm">
                     <div className="w-3 h-3 rounded-full bg-warning" />
                     <span className="text-muted-foreground">Pending confirmations</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm">
                     <div className="w-3 h-3 rounded-full bg-destructive" />
                     <span className="text-muted-foreground">Unassigned shifts</span>
                   </div>
                 </div>
               </CardContent>
             </Card>

             <div className="lg:col-span-2 space-y-4">
               <div className="flex items-center gap-4">
                 <Button variant="outline" size="icon" onClick={handlePrevDay}>
                   <ChevronLeft className="h-4 w-4" />
                 </Button>
                 <div className="flex items-center gap-2">
                   <CalendarIcon className="h-5 w-5 text-primary" />
                   <span className="font-semibold text-lg">
                     {date?.toLocaleDateString("en-GB", {
                       weekday: "long",
                       day: "numeric",
                       month: "long",
                       year: "numeric",
                     })}
                   </span>
                 </div>
                 <Button variant="outline" size="icon" onClick={handleNextDay}>
                   <ChevronRight className="h-4 w-4" />
                 </Button>
               </div>

               <div className="space-y-3">
                {calendarDayShifts.map((shift) => {
                   const status = statusConfig[shift.status];
                   return (
                     <Card
                       key={shift.id}
                       className={cn(
                         "glass-card hover-lift",
                         shift.status === "unassigned" && "border-destructive/30"
                       )}
                     >
                       <CardContent className="p-4">
                         <div className="flex items-center justify-between">
                           <div className="flex items-center gap-4">
                             <div className="flex flex-col items-center px-3 py-2 bg-muted/50 rounded-lg min-w-[80px]">
                               <span className="text-lg font-bold text-foreground">{shift.startTime}</span>
                               <span className="text-xs text-muted-foreground">to</span>
                               <span className="text-lg font-bold text-foreground">{shift.endTime}</span>
                             </div>
                             <div>
                               <div className="flex items-center gap-2 mb-1">
                                 <MapPin className="h-4 w-4 text-primary" />
                                 <span className="font-medium text-foreground">{shift.site}</span>
                               </div>
                               <div className="flex items-center gap-2">
                                 <User className="h-4 w-4 text-muted-foreground" />
                                 <span className="text-sm text-muted-foreground">
                                   {shift.guardName ? `${shift.guardId}- ${shift.guardName}` : "No officer assigned"}
                                 </span>
                               </div>
                             </div>
                           </div>
                           <div className="flex items-center gap-2">
                             <Badge variant="outline" className={cn("border", status.className)}>
                               {status.label}
                             </Badge>
                             {canCreateEditShifts && (
                               <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                   <Button variant="ghost" size="icon" className="h-8 w-8">
                                     <MoreHorizontal className="h-4 w-4" />
                                   </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end">
                                   <DropdownMenuItem>
                                     <Pencil className="h-4 w-4 mr-2" />
                                     Edit
                                   </DropdownMenuItem>
                                   <DropdownMenuItem>
                                     <UserPlus className="h-4 w-4 mr-2" />
                                     Assign
                                   </DropdownMenuItem>
                                   <DropdownMenuItem className="text-destructive">
                                     <XCircle className="h-4 w-4 mr-2" />
                                     Cancel
                                   </DropdownMenuItem>
                                 </DropdownMenuContent>
                               </DropdownMenu>
                             )}
                           </div>
                         </div>
                       </CardContent>
                     </Card>
                   );
                 })}
               </div>

               <div className="grid grid-cols-3 gap-4 pt-4">
                <Card className="glass-card">
                   <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-success">{calendarConfirmed}</p>
                     <p className="text-sm text-muted-foreground">Confirmed</p>
                   </CardContent>
                 </Card>
                 <Card className="glass-card">
                   <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-warning">{calendarPending}</p>
                     <p className="text-sm text-muted-foreground">Pending</p>
                   </CardContent>
                 </Card>
                 <Card className="glass-card">
                   <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-destructive">{calendarUnassigned}</p>
                     <p className="text-sm text-muted-foreground">Unassigned</p>
                   </CardContent>
                 </Card>
               </div>
             </div>
           </div>
         </TabsContent>
       </Tabs>

       {/* View shift details sheet */}
       <Sheet open={viewSheetOpen} onOpenChange={setViewSheetOpen}>
         <SheetContent className="sm:max-w-md overflow-y-auto">
           <SheetHeader>
             <SheetTitle>Shift details</SheetTitle>
           </SheetHeader>
           {selectedShift && (
             <div className="mt-4 space-y-4">
               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b pb-1">Site & duty</p>
               <div>
                 <Label className="text-muted-foreground text-xs">Site</Label>
                 <p className="font-medium">{selectedShift.site}</p>
               </div>
               <div>
                 <Label className="text-muted-foreground text-xs">Duty type</Label>
                 <p className="font-medium">{selectedShift.dutyTypeName ?? "—"}</p>
               </div>
               <div>
                 <Label className="text-muted-foreground text-xs">Client name</Label>
                 <p className="font-medium">{selectedShift.clientName}</p>
               </div>
               <div>
                 <Label className="text-muted-foreground text-xs">Manager name</Label>
                 <p className="font-medium">{selectedShift.managerName}</p>
               </div>

               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b pb-1 pt-2">Shift times</p>
               <div>
                 <Label className="text-muted-foreground text-xs">Shift date</Label>
                 <p className="font-medium">{selectedShift.shiftDate}</p>
               </div>
               <div>
                 <Label className="text-muted-foreground text-xs">Start time – End time</Label>
                 <p className="font-medium">{selectedShift.startTime} – {selectedShift.endTime}</p>
               </div>
               <div>
                 <Label className="text-muted-foreground text-xs">Break (minutes)</Label>
                 <p className="font-medium">{selectedShift.breakMinutes != null ? String(selectedShift.breakMinutes) : "—"}</p>
               </div>
               <div>
                 <Label className="text-muted-foreground text-xs">Hours</Label>
                 <p className="font-medium">{selectedShift.hours}</p>
               </div>

               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b pb-1 pt-2">Officer / Guard</p>
               <div>
                 <Label className="text-muted-foreground text-xs">Guard detail</Label>
                 <p className="font-medium">
                   {selectedShift.guardId && selectedShift.guardName
                     ? `${selectedShift.guardId} – ${selectedShift.guardName}`
                     : "No guard assigned"}
                 </p>
               </div>

               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b pb-1 pt-2">Rates</p>
               <div>
                 <Label className="text-muted-foreground text-xs">Currency</Label>
                 <p className="font-medium">{selectedShift.currency ?? "—"}</p>
               </div>
               <div>
                 <Label className="text-muted-foreground text-xs">Charge rate (per hour)</Label>
                 <p className="font-medium">
                   {selectedShift.chargeRate != null ? `${selectedShift.currency ?? "GBP"} ${Number(selectedShift.chargeRate).toFixed(2)}` : "—"}
                 </p>
               </div>
               <div>
                 <Label className="text-muted-foreground text-xs">Pay rate (per hour)</Label>
                 <p className="font-medium">
                   {selectedShift.payRate != null ? `${selectedShift.currency ?? "GBP"} ${Number(selectedShift.payRate).toFixed(2)}` : "—"}
                 </p>
               </div>

               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b pb-1 pt-2">Calls</p>
               <div>
                 <Label className="text-muted-foreground text-xs">Precheck call</Label>
                 <p className="font-medium text-sm">{selectedShift.precheckDue ?? "—"}</p>
               </div>
               <div>
                 <Label className="text-muted-foreground text-xs">Book-on window</Label>
                 <p className="font-medium text-sm">{selectedShift.bookOnWindow ?? "—"}</p>
               </div>
               <div>
                 <Label className="text-muted-foreground text-xs">Check calls</Label>
                 <p className="font-medium text-sm">{selectedShift.checkCallSummary ?? "—"}</p>
               </div>

               <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b pb-1 pt-2">Other</p>
               <div>
                 <Label className="text-muted-foreground text-xs">Branch</Label>
                 <p className="font-medium">{selectedShift.branch}</p>
               </div>
               <div>
                 <Label className="text-muted-foreground text-xs">Status</Label>
                 <p>
                   <Badge className={cn("text-xs font-medium", statusConfig[selectedShift.status].className)}>
                     {statusConfig[selectedShift.status].label}
                   </Badge>
                 </p>
               </div>
               <div>
                 <Label className="text-muted-foreground text-xs">Created by</Label>
                 <p className="font-medium">{selectedShift.createdBy}</p>
               </div>
             </div>
           )}
           <SheetFooter className="mt-6">
             {canCreateEditShifts && selectedShift && (
               <Button onClick={() => openEditShift(selectedShift)}>
                 <Pencil className="h-4 w-4 mr-2" />
                 Edit shift
               </Button>
             )}
           </SheetFooter>
         </SheetContent>
       </Sheet>

       {/* Edit shift modal – aligned with Create shift */}
       <Dialog open={editModalOpen} onOpenChange={(open) => { if (!open) { setEditModalOpen(false); setShiftToEdit(null); setEditForm(null); } }}>
         <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
           <DialogHeader>
             <DialogTitle>Update shift</DialogTitle>
           </DialogHeader>
           {editForm && (
             <div className="flex-1 min-h-0 overflow-y-auto space-y-5 py-2">
               <div className="space-y-4">
                 <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Site & duty</p>
                 <div className="grid gap-2">
                   <Label>Site</Label>
                   <Select
                     value={sites.find((s) => s.name === editForm.site)?.id ?? ""}
                     onValueChange={(v) => {
                       const site = getSiteById(v);
                       if (site) {
                         updateEditForm("site", site.name);
                         const clientName = getClientById(site.clientId)?.name ?? "";
                         if (clientName) updateEditForm("clientName", clientName);
                       }
                     }}
                   >
                     <SelectTrigger>
                       <SelectValue placeholder="Select site" />
                     </SelectTrigger>
                     <SelectContent>
                       {sites.map((s) => {
                         const clientName = getClientById(s.clientId)?.name ?? "";
                         return (
                           <SelectItem key={s.id} value={s.id}>
                             {s.name}
                             {clientName ? ` (${clientName})` : ""}
                           </SelectItem>
                         );
                       })}
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="grid gap-2">
                   <Label>Duty type</Label>
                   <Select
                     value={dutyTypes.find((d) => d.name === editForm.dutyTypeName)?.id ?? ""}
                     onValueChange={(v) => {
                       const duty = dutyTypes.find((d) => d.id === v);
                       if (duty) updateEditForm("dutyTypeName", duty.name);
                     }}
                   >
                     <SelectTrigger>
                       <SelectValue placeholder="Select duty type" />
                     </SelectTrigger>
                     <SelectContent>
                       {dutyTypes.map((d) => (
                         <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                   <div className="grid gap-2">
                     <Label>Client name</Label>
                     <Select
                       value={editForm.clientName}
                       onValueChange={(v) => updateEditForm("clientName", v)}
                     >
                       <SelectTrigger>
                         <SelectValue placeholder="Select client" />
                       </SelectTrigger>
                       <SelectContent>
                         {clientsList.map((c) => (
                           <SelectItem key={c.id} value={c.name}>
                             {c.name}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="grid gap-2">
                     <Label>Manager name</Label>
                     <Input
                       value={editForm.managerName}
                       onChange={(e) => updateEditForm("managerName", e.target.value)}
                     />
                   </div>
                 </div>
               </div>

               <div className="space-y-4">
                 <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Shift times</p>
                 <div className="grid gap-2">
                   <Label>Shift date</Label>
                   <Input
                     type="date"
                     value={editForm.shiftDate.includes("-") ? editForm.shiftDate.split("-").reverse().join("-") : editForm.shiftDate}
                     onChange={(e) => {
                       const [y, m, d] = e.target.value.split("-");
                       updateEditForm("shiftDate", `${d}-${m}-${y}`);
                     }}
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                   <div className="grid gap-2">
                     <Label>Start time</Label>
                     <Input
                       type="time"
                       value={editForm.startTime}
                       onChange={(e) => updateEditForm("startTime", e.target.value)}
                       className="h-9"
                     />
                   </div>
                   <div className="grid gap-2">
                     <Label>End time</Label>
                     <Input
                       type="time"
                       value={editForm.endTime}
                       onChange={(e) => updateEditForm("endTime", e.target.value)}
                       className="h-9"
                     />
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                   <div className="grid gap-2">
                     <Label>Break (min)</Label>
                     <Input
                       type="number"
                       min={0}
                       step={5}
                       value={editForm.breakMinutes != null ? String(editForm.breakMinutes) : ""}
                       onChange={(e) => updateEditForm("breakMinutes", e.target.value ? Number(e.target.value) : 0)}
                       placeholder="0"
                       className="h-9"
                     />
                   </div>
                   <div className="grid gap-2">
                     <Label>Hours</Label>
                     <Input
                       type="number"
                       step={0.01}
                       min={0}
                       value={editForm.hours}
                       onChange={(e) => updateEditForm("hours", parseFloat(e.target.value) || 0)}
                       className="h-9"
                     />
                   </div>
                 </div>
               </div>

               <div className="space-y-4">
                 <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Officer / Guard</p>
                 <div className="grid gap-2">
                   <Label>Officer</Label>
                   <Select
                     value={editForm.guardId || "_none"}
                     onValueChange={(v) => {
                       if (v === "_none") {
                         updateEditForm("guardId", "");
                         updateEditForm("guardName", "");
                       } else {
                         const officer = officersList.find((o) => o.id === v);
                         if (officer) {
                           updateEditForm("guardId", officer.id);
                           updateEditForm("guardName", officer.name);
                         }
                       }
                     }}
                   >
                     <SelectTrigger className="h-9">
                       <SelectValue placeholder="Select officer" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="_none">Unassigned</SelectItem>
                       {officersList
                         .filter((o) => o.status === "active")
                         .map((o) => (
                           <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                         ))}
                     </SelectContent>
                   </Select>
                 </div>
               </div>

               <div className="space-y-4">
                 <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Rates</p>
                 {editRatesLoading && (
                   <p className="text-sm text-muted-foreground">Loading rates…</p>
                 )}
                 <div className="grid grid-cols-3 gap-2">
                   <div className="grid gap-2">
                     <Label>Currency</Label>
                     <Input
                       value={editForm.currency ?? "GBP"}
                       onChange={(e) => updateEditForm("currency", e.target.value)}
                       placeholder="GBP"
                       className="h-9"
                     />
                   </div>
                   <div className="grid gap-2">
                     <Label>Charge (£)</Label>
                     <Input
                       type="number"
                       step={0.01}
                       min={0}
                       value={editForm.chargeRate != null ? String(editForm.chargeRate) : ""}
                       onChange={(e) => updateEditForm("chargeRate", e.target.value ? Number(e.target.value) : 0)}
                       placeholder="0"
                       className="h-9"
                     />
                   </div>
                   <div className="grid gap-2">
                     <Label>Pay (£)</Label>
                     <Input
                       type="number"
                       step={0.01}
                       min={0}
                       value={editForm.payRate != null ? String(editForm.payRate) : ""}
                       onChange={(e) => updateEditForm("payRate", e.target.value ? Number(e.target.value) : 0)}
                       placeholder="0"
                       className="h-9"
                     />
                   </div>
                 </div>
               </div>

               <div className="space-y-4">
                 <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Other</p>
                 <div className="grid grid-cols-2 gap-2">
                   <div className="grid gap-2">
                     <Label>Branch</Label>
                     <Select
                       value={editForm.branch}
                       onValueChange={(v) => updateEditForm("branch", v)}
                     >
                       <SelectTrigger className="h-9">
                         <SelectValue placeholder="Select branch" />
                       </SelectTrigger>
                       <SelectContent>
                         {allBranches.map((branch) => (
                           <SelectItem key={branch} value={branch}>
                             {branch}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="grid gap-2">
                     <Label>Status</Label>
                     <Select
                       value={editForm.status}
                       onValueChange={(v: "confirmed" | "pending" | "unassigned") => updateEditForm("status", v)}
                     >
                       <SelectTrigger className="h-9">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="confirmed">Confirm</SelectItem>
                         <SelectItem value="pending">Pending</SelectItem>
                         <SelectItem value="unassigned">Unassigned</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 </div>
                 <div className="grid gap-2">
                   <Label className="text-muted-foreground text-xs">Created by (read-only)</Label>
                   <Input value={editForm.createdBy} disabled className="h-9 bg-muted" />
                 </div>
               </div>
             </div>
           )}
           <DialogFooter className="shrink-0 gap-2">
             <Button variant="outline" onClick={() => { setEditModalOpen(false); setShiftToEdit(null); setEditForm(null); }}>
               Cancel
             </Button>
             <Button onClick={handleUpdateShift} disabled={!editForm}>
               Save changes
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     </MainLayout>
   );
 }