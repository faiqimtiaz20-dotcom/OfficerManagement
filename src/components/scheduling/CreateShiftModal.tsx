import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
import { ChevronRight, ChevronLeft, ChevronDown, MapPin, Clock, ListOrdered, Plus, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSites } from "@/context/SitesContext";
import { useDutyTypes } from "@/context/DutyTypesContext";
import { getClientById, mockDb } from "@/data/mockDb";
import { fetchRatesForShift } from "@/api/ratesApi";
import { computeShiftCalls, type PrecheckCall, type BookOnCall, type CheckCallWindow } from "@/types/shiftCalls";

const MAX_SHIFTS = 100;
const officersList = mockDb.officersList;

function toDateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getThisWeekDates(): string[] {
  const today = new Date();
  const day = today.getDay();
  const toMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(monday.getDate() + toMonday);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return toDateString(d);
  });
}

function getNextWeekDates(): string[] {
  const today = new Date();
  const day = today.getDay();
  const toMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(today);
  monday.setDate(monday.getDate() + toMonday + 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return toDateString(d);
  });
}

function getThisMonthDates(): string[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const out: string[] = [];
  for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
    out.push(toDateString(new Date(d)));
  }
  return out;
}

function getNextMonthDates(): string[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 2, 0);
  const out: string[] = [];
  for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
    out.push(toDateString(new Date(d)));
  }
  return out;
}

/** Keep only Mon–Fri (working days). */
function workingDaysOnly(dates: string[]): string[] {
  return dates.filter((dateStr) => {
    const d = new Date(dateStr + "T12:00:00");
    const day = d.getDay();
    return day >= 1 && day <= 5;
  });
}

export interface ShiftRow {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  breakMinutes: string;
  officerId: string;
  chargeRate: string;
  payRate: string;
  /** Set on submit: precheck call (due 90 min before start). */
  precheck?: PrecheckCall;
  /** Set on submit: book-on window (15 min before – 30 min after start). */
  bookOn?: BookOnCall;
  /** Set on submit: check call windows during shift (if site has check call enabled). */
  checkCalls?: CheckCallWindow[];
}

export interface CreateShiftFormData {
  siteId: string;
  siteName: string;
  dutyTypeId: string;
  dutyTypeName: string;
  defaultChargeRate: number;
  defaultPayRate: number;
  currency: string;
  shifts: ShiftRow[];
}

const defaultShiftRow = (
  id: string,
  date: string,
  startTime: string,
  endTime: string,
  chargeRate: number,
  payRate: number,
  breakMinutes: string = "0"
): ShiftRow => ({
  id,
  date,
  startTime,
  endTime,
  breakMinutes,
  officerId: "",
  chargeRate: String(chargeRate),
  payRate: String(payRate),
});

const STEPS = [
  { id: 1, label: "Site & duty", icon: MapPin },
  { id: 2, label: "Shift rows", icon: ListOrdered },
  { id: 3, label: "Review", icon: Clock },
];

interface CreateShiftModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (data: CreateShiftFormData) => void;
}

export function CreateShiftModal({ open, onOpenChange, onSuccess }: CreateShiftModalProps) {
  const { sites, getSiteById } = useSites();
  const { dutyTypes } = useDutyTypes();
  const [step, setStep] = useState(1);
  const [siteId, setSiteId] = useState("");
  const [dutyTypeId, setDutyTypeId] = useState("");
  const [ratesLoading, setRatesLoading] = useState(false);
  const [defaultChargeRate, setDefaultChargeRate] = useState(0);
  const [defaultPayRate, setDefaultPayRate] = useState(0);
  const [currency, setCurrency] = useState("GBP");
  const [shifts, setShifts] = useState<ShiftRow[]>([]);
  const [defaultDate, setDefaultDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [defaultStartTime, setDefaultStartTime] = useState("08:00");
  const [defaultEndTime, setDefaultEndTime] = useState("16:00");

  const site = siteId ? getSiteById(siteId) : undefined;
  const siteName = site?.name ?? "";
  const dutyTypeName = dutyTypes.find((d) => d.id === dutyTypeId)?.name ?? "";

  useEffect(() => {
    if (!open) {
      setStep(1);
      setSiteId("");
      setDutyTypeId("");
      setShifts([]);
      setDefaultChargeRate(0);
      setDefaultPayRate(0);
      setDefaultDate(new Date().toISOString().slice(0, 10));
      setDefaultStartTime("08:00");
      setDefaultEndTime("16:00");
    }
  }, [open]);

  useEffect(() => {
    if (!siteId || !dutyTypeId || !site) return;
    setRatesLoading(true);
    fetchRatesForShift(site, dutyTypeId)
      .then((r) => {
        setDefaultChargeRate(r.chargeRate);
        setDefaultPayRate(r.payRate);
        setCurrency(r.currency);
      })
      .finally(() => setRatesLoading(false));
  }, [siteId, dutyTypeId, site?.id]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const addRow = () => addRows(1);

  const addRows = (count: number) => {
    const toAdd = Math.min(count, MAX_SHIFTS - shifts.length);
    if (toAdd <= 0) return;
    const newRows = Array.from({ length: toAdd }, (_, i) =>
      defaultShiftRow(
        `row-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 9)}`,
        defaultDate,
        defaultStartTime,
        defaultEndTime,
        defaultChargeRate,
        defaultPayRate,
        "0"
      )
    );
    setShifts((prev) => [...prev, ...newRows]);
  };

  const addRowsForDateRange = (dates: string[]) => {
    const remaining = MAX_SHIFTS - shifts.length;
    const toAdd = dates.slice(0, remaining);
    if (toAdd.length === 0) return;
    const newRows = toAdd.map((date, i) =>
      defaultShiftRow(
        `row-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 9)}`,
        date,
        defaultStartTime,
        defaultEndTime,
        defaultChargeRate,
        defaultPayRate,
        "0"
      )
    );
    setShifts((prev) => [...prev, ...newRows]);
  };

  const removeRow = (id: string) => {
    setShifts((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRow = (id: string, patch: Partial<ShiftRow>) => {
    setShifts((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  };

  const fillDefaultsForNewRows = () => {
    setShifts((prev) =>
      prev.map((r) => ({
        ...r,
        chargeRate: r.chargeRate === "" || parseFloat(r.chargeRate) === 0 ? String(defaultChargeRate) : r.chargeRate,
        payRate: r.payRate === "" || parseFloat(r.payRate) === 0 ? String(defaultPayRate) : r.payRate,
      }))
    );
  };

  const handleStep2Enter = () => {
    if (shifts.length === 0) {
      addRow();
    } else {
      fillDefaultsForNewRows();
    }
  };

  const handleSubmit = () => {
    const validShifts = shifts.filter((r) => r.date && r.startTime && r.endTime);
    const checkCallEnabled = site?.checkCallEnabled ?? false;
    const checkCallIntervalMinutes = site?.checkCallIntervalMinutes ?? 60;

    const shiftsWithCalls = validShifts.map((row) => {
      const { precheck, bookOn, checkCalls } = computeShiftCalls(
        row.date,
        row.startTime,
        row.endTime,
        checkCallEnabled,
        checkCallIntervalMinutes
      );
      return {
        ...row,
        precheck,
        bookOn,
        checkCalls,
      };
    });

    const data: CreateShiftFormData = {
      siteId,
      siteName,
      dutyTypeId,
      dutyTypeName,
      defaultChargeRate,
      defaultPayRate,
      currency,
      shifts: shiftsWithCalls,
    };
    onSuccess?.(data);
    handleClose();
  };

  // When entering step 2 with no rows, add one default row
  useEffect(() => {
    if (step === 2 && shifts.length === 0 && (defaultChargeRate > 0 || defaultPayRate >= 0)) {
      setShifts([
        defaultShiftRow(
          `row-${Date.now()}`,
          defaultDate,
          defaultStartTime,
          defaultEndTime,
          defaultChargeRate,
          defaultPayRate,
          "0"
        ),
      ]);
    }
  }, [step]);

  // Ctrl+Enter on step 2 adds one row
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (step !== 2 || shifts.length >= MAX_SHIFTS) return;
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        addRow();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, shifts.length]);

  const canNextStep1 = siteId && dutyTypeId && !ratesLoading;
  const canNextStep2 = shifts.length > 0 && shifts.every((s) => s.date && s.startTime && s.endTime);
  const validShifts = shifts.filter((s) => s.date && s.startTime && s.endTime);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create shifts</DialogTitle>
          <div className="flex gap-2 pt-2">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium",
                  step === s.id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                <s.icon className="h-3.5 w-3.5" />
                {s.label}
              </div>
            ))}
          </div>
          <Progress value={(step / 3) * 100} className="h-1.5 mt-2" />
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto py-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Site</Label>
                <Select value={siteId} onValueChange={setSiteId}>
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
              <div className="space-y-2">
                <Label>Duty type</Label>
                <Select value={dutyTypeId} onValueChange={setDutyTypeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duty type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dutyTypes.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {ratesLoading && (
                <p className="text-sm text-muted-foreground">Loading rates from backend…</p>
              )}
              {!ratesLoading && siteId && dutyTypeId && (
                <p className="text-sm text-muted-foreground">
                  Default rates: {currency} {defaultChargeRate.toFixed(2)} charge / {defaultPayRate.toFixed(2)} pay per hour. You can override per shift in the next step.
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Label>Shift rows (max {MAX_SHIFTS})</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRow}
                    disabled={shifts.length >= MAX_SHIFTS}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add row
                  </Button>
                  {shifts.length < MAX_SHIFTS && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button type="button" variant="outline" size="sm">
                          Add more…
                          <ChevronDown className="h-4 w-4 ml-1 opacity-60" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => addRows(5)}>Add 5 rows</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addRows(10)}>Add 10 rows</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addRows(25)}>Add 25 rows</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => addRowsForDateRange(getThisWeekDates())}>
                          This week (7)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addRowsForDateRange(workingDaysOnly(getThisWeekDates()))}>
                          This week (working days)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addRowsForDateRange(getNextWeekDates())}>
                          Next week (7)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addRowsForDateRange(workingDaysOnly(getNextWeekDates()))}>
                          Next week (working days)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addRowsForDateRange(getThisMonthDates())}>
                          This month
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addRowsForDateRange(workingDaysOnly(getThisMonthDates()))}>
                          This month (working days)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addRowsForDateRange(getNextMonthDates())}>
                          Next month
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => addRowsForDateRange(workingDaysOnly(getNextMonthDates()))}>
                          Next month (working days)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 gap-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-muted-foreground text-sm shrink-0">Start</Label>
                  <Input
                    type="time"
                    value={defaultStartTime}
                    onChange={(e) => setDefaultStartTime(e.target.value)}
                    className="h-8 w-[110px]"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-muted-foreground text-sm shrink-0">End</Label>
                  <Input
                    type="time"
                    value={defaultEndTime}
                    onChange={(e) => setDefaultEndTime(e.target.value)}
                    className="h-8 w-[110px]"
                  />
                </div>
                <span className="text-xs text-muted-foreground">Used for new rows. Edit per row in the table below.</span>
              </div>
              <div className="border rounded-lg overflow-x-auto max-h-[320px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[110px]">Date</TableHead>
                      <TableHead className="w-[90px]">Start</TableHead>
                      <TableHead className="w-[90px]">End</TableHead>
                      <TableHead className="w-[80px]">Break (min)</TableHead>
                      <TableHead className="min-w-[160px]">Officer</TableHead>
                      <TableHead className="w-[100px]">Charge (£)</TableHead>
                      <TableHead className="w-[90px]">Pay (£)</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shifts.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <Input
                            type="date"
                            value={row.date}
                            onChange={(e) => updateRow(row.id, { date: e.target.value })}
                            className="h-8 text-xs"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="time"
                            value={row.startTime}
                            onChange={(e) => updateRow(row.id, { startTime: e.target.value })}
                            className="h-8 text-xs"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="time"
                            value={row.endTime}
                            onChange={(e) => updateRow(row.id, { endTime: e.target.value })}
                            className="h-8 text-xs"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="5"
                            value={row.breakMinutes}
                            onChange={(e) => updateRow(row.id, { breakMinutes: e.target.value })}
                            className="h-8 text-xs w-16"
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={row.officerId || "_none"}
                            onValueChange={(v) => updateRow(row.id, { officerId: v === "_none" ? "" : v })}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Unassigned" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="_none">Unassigned</SelectItem>
                              {officersList
                                .filter((o) => o.status === "active")
                                .map((o) => (
                                  <SelectItem key={o.id} value={o.id}>
                                    {o.name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={row.chargeRate}
                            onChange={(e) => updateRow(row.id, { chargeRate: e.target.value })}
                            className="h-8 text-xs"
                            placeholder={String(defaultChargeRate)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={row.payRate}
                            onChange={(e) => updateRow(row.id, { payRate: e.target.value })}
                            className="h-8 text-xs"
                            placeholder={String(defaultPayRate)}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeRow(row.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  className="gradient-primary shrink-0"
                  onClick={addRow}
                  disabled={shifts.length >= MAX_SHIFTS}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add row
                </Button>
                {shifts.length < MAX_SHIFTS && (
                  <span className="text-xs text-muted-foreground">
                    Use <strong>Add more…</strong> for bulk or by period (this week, next week, month).{" "}
                    <kbd className="px-1 py-0.5 rounded bg-muted text-xs">Ctrl+Enter</kbd> adds one row.
                  </span>
                )}
              </div>
              {shifts.length === 0 && (
                <p className="text-sm text-muted-foreground">Click &quot;Add row&quot; above or below to add at least one shift.</p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Creating {validShifts.length} shift(s) at {siteName} ({dutyTypeName}).
              </p>
              <div className="border rounded-lg overflow-x-auto max-h-[280px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Break</TableHead>
                      <TableHead>Officer</TableHead>
                      <TableHead>Charge (£)</TableHead>
                      <TableHead>Pay (£)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validShifts.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.startTime} – {row.endTime}</TableCell>
                        <TableCell>{row.breakMinutes ? `${row.breakMinutes} min` : "0 min"}</TableCell>
                        <TableCell>
                          {row.officerId ? officersList.find((o) => o.id === row.officerId)?.name ?? "—" : "Unassigned"}
                        </TableCell>
                        <TableCell>{row.chargeRate || defaultChargeRate}</TableCell>
                        <TableCell>{row.payRate || defaultPayRate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 shrink-0">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}
          <div className="flex-1" />
          {step < 3 ? (
            <Button
              type="button"
              className="gradient-primary"
              disabled={step === 1 ? !canNextStep1 : !canNextStep2}
              onClick={() => {
                if (step === 1) setStep(2);
                else if (step === 2) {
                  handleStep2Enter();
                  setStep(3);
                }
              }}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              className="gradient-primary"
              disabled={validShifts.length === 0}
              onClick={handleSubmit}
            >
              Create {validShifts.length} shift(s)
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
