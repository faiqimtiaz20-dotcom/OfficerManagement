import { useState, useMemo } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight, ChevronLeft, Building2, ListChecks, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockDb } from "@/data/mockDb";

const CLIENT_OPTIONS = mockDb.invoiceClientOptions;

const SITE_OPTIONS: Record<string, string[]> = mockDb.invoiceSiteOptions;

// Mock approved shifts (would come from API filtered by client, site, date range, approved)
interface ApprovedShiftRow {
  id: string;
  clientId: string;
  shiftDate: string;
  site: string;
  officer: string;
  hours: number;
  chargeRate: number;
  amount: number;
}

const MOCK_APPROVED_SHIFTS: ApprovedShiftRow[] = mockDb.invoiceApprovedShifts as unknown as ApprovedShiftRow[];

export interface CreateInvoiceFormData {
  clientId: string;
  clientName: string;
  siteFilter: string;
  dateFrom: string;
  dateTo: string;
  selectedShiftIds: string[];
}

const STEPS = [
  { id: 1, label: "Client & period", icon: Building2 },
  { id: 2, label: "Select shifts", icon: ListChecks },
  { id: 3, label: "Review", icon: FileCheck },
];

interface CreateInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (data: CreateInvoiceFormData & { total: number }) => void;
}

export function CreateInvoiceModal({ open, onOpenChange, onSuccess }: CreateInvoiceModalProps) {
  const [step, setStep] = useState(1);
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [siteFilter, setSiteFilter] = useState("All sites");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedShiftIds, setSelectedShiftIds] = useState<Set<string>>(new Set());

  const shifts = useMemo(() => {
    if (!clientId) return [];
    return MOCK_APPROVED_SHIFTS.filter((s) => {
      if (s.clientId !== clientId) return false;
      if (siteFilter !== "All sites" && s.site !== siteFilter) return false;
      const normalizedDate = (() => {
        const [d, m, y] = s.shiftDate.split("-");
        return `${y}-${m}-${d}`;
      })();
      if (dateFrom && normalizedDate < dateFrom) return false;
      if (dateTo && normalizedDate > dateTo) return false;
      return true;
    });
  }, [clientId, siteFilter, dateFrom, dateTo]);

  const handleClose = () => {
    setStep(1);
    setClientId("");
    setClientName("");
    setSiteFilter("All sites");
    setDateFrom("");
    setDateTo("");
    setSelectedShiftIds(new Set());
    onOpenChange(false);
  };

  const handleClientSelect = (id: string) => {
    setClientId(id);
    const client = CLIENT_OPTIONS.find((c) => c.id === id);
    setClientName(client?.name ?? "");
    setSiteFilter("All sites");
  };

  const toggleShift = (id: string) => {
    setSelectedShiftIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllShifts = () => {
    if (selectedShiftIds.size === shifts.length) {
      setSelectedShiftIds(new Set());
    } else {
      setSelectedShiftIds(new Set(shifts.map((s) => s.id)));
    }
  };

  const selectedShifts = shifts.filter((s) => selectedShiftIds.has(s.id));
  const total = selectedShifts.reduce((sum, s) => sum + s.amount, 0);

  const handleSaveDraft = () => {
    onSuccess?.({
      clientId,
      clientName,
      siteFilter,
      dateFrom,
      dateTo,
      selectedShiftIds: Array.from(selectedShiftIds),
      total,
    });
    handleClose();
  };

  const handleIssue = () => {
    onSuccess?.({
      clientId,
      clientName,
      siteFilter,
      dateFrom,
      dateTo,
      selectedShiftIds: Array.from(selectedShiftIds),
      total,
    });
    handleClose();
  };

  const canNextStep1 = clientId && dateFrom && dateTo;
  const canNextStep2 = selectedShiftIds.size > 0;

  const sitesForClient = clientId ? (SITE_OPTIONS[clientId] ?? []) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
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
                <Label>Client</Label>
                <Select value={clientId} onValueChange={handleClientSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLIENT_OPTIONS.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {sitesForClient.length > 0 && (
                <div className="space-y-2">
                  <Label>Site (optional)</Label>
                  <Select value={siteFilter} onValueChange={setSiteFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All sites">All sites</SelectItem>
                      {sitesForClient.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>From date</Label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>To date</Label>
                  <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Select approved shifts to include. ({shifts.length} shifts in range.)
                </p>
                <Button variant="outline" size="sm" onClick={selectAllShifts}>
                  {selectedShiftIds.size === shifts.length ? "Deselect all" : "Select all"}
                </Button>
              </div>
              <div className="border rounded-lg max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Officer</TableHead>
                      <TableHead className="text-right">Hours</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shifts.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedShiftIds.has(s.id)}
                            onCheckedChange={() => toggleShift(s.id)}
                          />
                        </TableCell>
                        <TableCell>{new Date(s.shiftDate.split("-").reverse().join("-")).toLocaleDateString("en-GB")}</TableCell>
                        <TableCell>{s.site}</TableCell>
                        <TableCell>{s.officer}</TableCell>
                        <TableCell className="text-right">{s.hours}</TableCell>
                        <TableCell className="text-right">£{s.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Invoice for <strong>{clientName}</strong> · {selectedShifts.length} shift(s)
              </p>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Officer</TableHead>
                      <TableHead className="text-right">Hours</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedShifts.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell>{new Date(s.shiftDate.split("-").reverse().join("-")).toLocaleDateString("en-GB")}</TableCell>
                        <TableCell>{s.site}</TableCell>
                        <TableCell>{s.officer}</TableCell>
                        <TableCell className="text-right">{s.hours}</TableCell>
                        <TableCell className="text-right">£{s.chargeRate}</TableCell>
                        <TableCell className="text-right">£{s.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end text-lg font-semibold">
                Total: £{total.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
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
              onClick={() => setStep(step + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={handleSaveDraft}>
                Save as Draft
              </Button>
              <Button type="button" className="gradient-primary" onClick={handleIssue}>
                Issue Invoice
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
