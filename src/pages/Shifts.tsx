import { useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Download,
  Filter,
  User,
  MapPin,
  PhoneCall,
  PhoneOff,
  BellRing,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { mockDb } from "@/data/mockDb";
import { toast } from "sonner";

type AttendanceStatus = "on-time" | "late" | "no-show";
type CallState = "done" | "due" | "overdue" | "upcoming" | "na";
type OverallCallState = "compliant" | "attention" | "critical";

interface PrecheckCall {
  dueBy: string;
  completedAt?: string;
}
interface BookOnCall {
  windowStart: string;
  windowEnd: string;
  completedAt?: string;
}
interface CheckCallWindow {
  windowStart: string;
  windowEnd: string;
  completedAt?: string;
}

interface ShiftRow {
  id: string;
  officer: string;
  officerId: string;
  site: string;
  siteId: string;
  date: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart: string;
  actualEnd: string;
  status: AttendanceStatus;
  approved: boolean;
  precheck?: PrecheckCall;
  bookOn?: BookOnCall;
  checkCalls?: CheckCallWindow[];
}

const mockShifts: ShiftRow[] = mockDb.shiftMonitorShifts as unknown as ShiftRow[];
const OFFICER_PORTAL_BASE_URL =
  (import.meta.env.VITE_OFFICER_PORTAL_URL as string | undefined)?.replace(/\/$/, "") ??
  "http://localhost:8081";

const statusConfig: Record<AttendanceStatus, { label: string; className: string }> = {
  "on-time": { label: "On-time", className: "status-active" },
  late: { label: "Late", className: "status-pending" },
  "no-show": { label: "No-show", className: "status-inactive" },
};

const SITE_OPTIONS = [
  "All sites",
  "Westfield Shopping Centre",
  "HSBC Tower",
  "Royal Hospital",
  "Tech Park Building A",
  "Metro Station Central",
];

const OFFICER_OPTIONS = ["All officers", "James Wilson", "Sarah Connor", "Michael Brown", "Robert Taylor", "Lucy Martinez"];

export default function Shifts() {
  const getOfficerPortalShiftUrl = (shiftId: string) =>
    `${OFFICER_PORTAL_BASE_URL}/portal/shifts?focusShift=${encodeURIComponent(shiftId)}`;

  const { user } = useAuth();
  // Fixed reference timestamp to keep demo behavior stable.
  const now = useMemo(() => new Date("2026-02-05T08:30:00"), []);
  const [shifts, setShifts] = useState<ShiftRow[]>(mockShifts);
  const [siteFilter, setSiteFilter] = useState("All sites");
  const [officerFilter, setOfficerFilter] = useState("All officers");
  const [dateFrom, setDateFrom] = useState("2026-02-01");
  const [dateTo, setDateTo] = useState("2026-02-07");
  const [callFilter, setCallFilter] = useState<"all" | CallState>("all");

  const canEditStatus =
    user?.role === "ADMIN" || user?.role === "OPS" || user?.role === "SCHEDULER";

  const updateShiftStatus = (id: string, status: AttendanceStatus) => {
    setShifts((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const setShiftApproved = (id: string, approved: boolean) => {
    setShifts((prev) => prev.map((s) => (s.id === id ? { ...s, approved } : s)));
  };

  const handleRefresh = () => {
    // Demo-mode refresh reloads local dataset until API wiring is complete.
    setShifts(mockDb.shiftMonitorShifts as unknown as ShiftRow[]);
    toast.success("Shift Monitor refreshed");
  };

  const handleExport = () => {
    toast.info("Export will be enabled after backend report API is connected.");
  };

  const handleLogCall = (shift: ShiftRow) => {
    toast.info(`Call logging for ${shift.officer} will be enabled via API integration.`);
  };

  const evalPrecheckState = (shift: ShiftRow): CallState => {
    if (!shift.precheck) return "na";
    if (shift.precheck.completedAt) return "done";
    const dueBy = new Date(shift.precheck.dueBy).getTime();
    if (now.getTime() > dueBy) return "overdue";
    const dueSoonMs = 45 * 60 * 1000;
    if (dueBy - now.getTime() <= dueSoonMs) return "due";
    return "upcoming";
  };

  const evalBookOnState = (shift: ShiftRow): CallState => {
    if (!shift.bookOn) return "na";
    if (shift.bookOn.completedAt) return "done";
    const start = new Date(shift.bookOn.windowStart).getTime();
    const end = new Date(shift.bookOn.windowEnd).getTime();
    const t = now.getTime();
    if (t > end) return "overdue";
    if (t >= start && t <= end) return "due";
    return "upcoming";
  };

  const evalCheckCallState = (shift: ShiftRow): CallState => {
    if (!shift.checkCalls || shift.checkCalls.length === 0) return "na";
    const windows = shift.checkCalls;
    const done = windows.filter((w) => !!w.completedAt).length;
    if (done === windows.length) return "done";
    const hasOverdue = windows.some(
      (w) => !w.completedAt && now.getTime() > new Date(w.windowEnd).getTime()
    );
    if (hasOverdue) return "overdue";
    const hasDue = windows.some((w) => {
      if (w.completedAt) return false;
      const start = new Date(w.windowStart).getTime();
      const end = new Date(w.windowEnd).getTime();
      const t = now.getTime();
      return t >= start && t <= end;
    });
    if (hasDue) return "due";
    return "upcoming";
  };

  const evalOverallState = (shift: ShiftRow): OverallCallState => {
    const states = [evalPrecheckState(shift), evalBookOnState(shift), evalCheckCallState(shift)];
    if (states.includes("overdue")) return "critical";
    if (states.includes("due")) return "attention";
    return "compliant";
  };

  const callStateMeta: Record<CallState, { label: string; className: string }> = {
    done: { label: "Done", className: "bg-green-500/15 text-green-700 border-green-200" },
    due: { label: "Due", className: "bg-amber-500/15 text-amber-700 border-amber-200" },
    overdue: { label: "Overdue", className: "bg-red-500/15 text-red-700 border-red-200" },
    upcoming: { label: "Upcoming", className: "bg-slate-500/15 text-slate-700 border-slate-200" },
    na: { label: "N/A", className: "bg-muted text-muted-foreground border-border" },
  };

  const overallMeta: Record<OverallCallState, { label: string; className: string }> = {
    compliant: { label: "Compliant", className: "bg-green-500/15 text-green-700 border-green-200" },
    attention: { label: "Attention", className: "bg-amber-500/15 text-amber-700 border-amber-200" },
    critical: { label: "Critical", className: "bg-red-500/15 text-red-700 border-red-200" },
  };

  const filteredShifts = shifts.filter((s) => {
    if (siteFilter !== "All sites" && s.site !== siteFilter) return false;
    if (officerFilter !== "All officers" && s.officer !== officerFilter) return false;
    if (s.date < dateFrom || s.date > dateTo) return false;
    if (callFilter !== "all") {
      const pre = evalPrecheckState(s);
      const book = evalBookOnState(s);
      const check = evalCheckCallState(s);
      if (![pre, book, check].includes(callFilter)) return false;
    }
    return true;
  });

  const dueNow = filteredShifts.filter(
    (s) =>
      evalPrecheckState(s) === "due" ||
      evalBookOnState(s) === "due" ||
      evalCheckCallState(s) === "due"
  ).length;
  const overdueNow = filteredShifts.filter(
    (s) =>
      evalPrecheckState(s) === "overdue" ||
      evalBookOnState(s) === "overdue" ||
      evalCheckCallState(s) === "overdue"
  ).length;
  const completedNow = filteredShifts.filter((s) => evalOverallState(s) === "compliant").length;
  const exceptionsNow = filteredShifts.filter((s) => evalOverallState(s) !== "compliant").length;

  const renderCallBadge = (state: CallState) => (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        callStateMeta[state].className
      )}
    >
      {callStateMeta[state].label}
    </span>
  );

  const fmtDateTime = (value?: string) => {
    if (!value) return "—";
    const d = new Date(value);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <MainLayout title="Shift Monitor" subtitle="Real-time call tracking: precheck, book-on, and check calls">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <BellRing className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{dueNow}</p>
                  <p className="text-sm text-muted-foreground">Calls due now</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{overdueNow}</p>
                  <p className="text-sm text-muted-foreground">Overdue calls</p>
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
                  <p className="text-2xl font-bold">{completedNow}</p>
                  <p className="text-sm text-muted-foreground">Compliant shifts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <PhoneOff className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{exceptionsNow}</p>
                  <p className="text-sm text-muted-foreground">Exceptions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Officer</label>
                <Select value={officerFilter} onValueChange={setOfficerFilter}>
                  <SelectTrigger className="w-44">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OFFICER_OPTIONS.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Site</label>
                <Select value={siteFilter} onValueChange={setSiteFilter}>
                  <SelectTrigger className="w-52">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SITE_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Call status</label>
                <Select value={callFilter} onValueChange={(v) => setCallFilter(v as "all" | CallState)}>
                  <SelectTrigger className="w-40">
                    <PhoneCall className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="due">Due</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">From</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-40"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">To</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-40"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="glass-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Officer</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead title="Due 90 min before start">Precheck</TableHead>
                <TableHead title="15 min before – 30 min after start">Book-on</TableHead>
                <TableHead title="Check calls during shift">Check calls</TableHead>
                <TableHead>Overall call status</TableHead>
                <TableHead>Approved</TableHead>
                {canEditStatus && <TableHead className="w-32">Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShifts.map((shift) => {
                const status = statusConfig[shift.status];
                const preState = evalPrecheckState(shift);
                const bookState = evalBookOnState(shift);
                const checkState = evalCheckCallState(shift);
                const overall = evalOverallState(shift);
                const checkDone = shift.checkCalls?.filter((c) => c.completedAt).length ?? 0;
                const checkTotal = shift.checkCalls?.length ?? 0;
                return (
                  <TableRow key={shift.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{shift.officer}</span>
                        <a
                          href={getOfficerPortalShiftUrl(shift.id)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          Open officer view
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>{shift.site}</TableCell>
                    <TableCell>
                      {new Date(shift.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{shift.plannedStart} – {shift.plannedEnd}</TableCell>
                    <TableCell className="text-sm">
                      <div className="space-y-1">
                        {renderCallBadge(preState)}
                        <div className="text-xs text-muted-foreground">
                          Due: {fmtDateTime(shift.precheck?.dueBy)}
                        </div>
                        {shift.precheck?.completedAt && (
                          <div className="text-xs text-muted-foreground">Done: {fmtDateTime(shift.precheck?.completedAt)}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="space-y-1">
                        {renderCallBadge(bookState)}
                        <div className="text-xs text-muted-foreground">
                          Window: {fmtDateTime(shift.bookOn?.windowStart)} - {fmtDateTime(shift.bookOn?.windowEnd)}
                        </div>
                        {shift.bookOn?.completedAt && (
                          <div className="text-xs text-muted-foreground">Done: {fmtDateTime(shift.bookOn?.completedAt)}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="space-y-1">
                        {renderCallBadge(checkState)}
                        <div className="text-xs text-muted-foreground">{checkDone}/{checkTotal} completed</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                          overallMeta[overall].className
                        )}
                      >
                        {overallMeta[overall].label}
                      </span>
                    </TableCell>
                    <TableCell>
                      {shift.approved ? (
                        <CheckCircle className="h-4 w-4 text-success" title="Approved" />
                      ) : (
                        <span className="text-muted-foreground text-sm">Pending</span>
                      )}
                    </TableCell>
                    {canEditStatus && (
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-1">
                          <Select
                            value={shift.status}
                            onValueChange={(v) => updateShiftStatus(shift.id, v as AttendanceStatus)}
                          >
                            <SelectTrigger className="h-8 w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="on-time">On-time</SelectItem>
                              <SelectItem value="late">Late</SelectItem>
                              <SelectItem value="no-show">No-show</SelectItem>
                            </SelectContent>
                          </Select>
                          {!shift.approved && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setShiftApproved(shift.id, true)}
                            >
                              Approve
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => handleLogCall(shift)}>
                            Log call
                          </Button>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-1">
                          Shift: <span className={cn("status-badge", status.className)}>{status.label}</span>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>

        {filteredShifts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No shifts match the current filters.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
