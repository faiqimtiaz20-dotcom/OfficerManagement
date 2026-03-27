import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Plus, Building2, FileQuestion, ClipboardCheck, Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { EmploymentReference, EmploymentReferenceStatus } from "@/data/officersMock";

const REFERENCE_STATUS: { value: EmploymentReferenceStatus; label: string; className: string }[] = [
  { value: "pending", label: "Pending", className: "status-pending" },
  { value: "contacted", label: "Contacted", className: "status-info" },
  { value: "screening_completed", label: "Screening done", className: "status-active" },
  { value: "verified", label: "Verified", className: "status-active" },
];

interface EmploymentReferenceSectionProps {
  references: EmploymentReference[];
  onReferencesChange: (refs: EmploymentReference[]) => void;
  canEdit: boolean;
  onSendEmail: (ref: EmploymentReference) => void;
  onCall: (ref: EmploymentReference) => void;
  onAddReference: () => void;
}

const emptyRef = (id: string): EmploymentReference => ({
  id,
  requestedDate: "",
  noOfRequests: 0,
  company: "",
  phone: "",
  email: "",
  from: "",
  to: "",
  confirmedDatesFrom: "",
  confirmedDatesTo: "",
  comments: "",
  status: "pending",
});

export function EmploymentReferenceSection({
  references,
  onReferencesChange,
  canEdit,
  onSendEmail,
  onCall,
  onAddReference,
}: EmploymentReferenceSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRef, setEditingRef] = useState<EmploymentReference | null>(null);
  const [form, setForm] = useState<EmploymentReference>(() => emptyRef(`new-${Date.now()}`));

  const openAddModal = () => {
    setEditingRef(null);
    setForm(emptyRef(`new-${Date.now()}`));
    setModalOpen(true);
  };

  const openEditModal = (ref: EmploymentReference) => {
    setEditingRef(ref);
    setForm({ ...ref });
    setModalOpen(true);
  };

  const handleSaveModal = () => {
    if (editingRef) {
      onReferencesChange(
        references.map((r) => (r.id === editingRef.id ? form : r))
      );
    } else {
      onReferencesChange([...references, { ...form, id: String(Date.now()) }]);
    }
    setModalOpen(false);
  };

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  if (references.length === 0 && !canEdit) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Employment reference
          </CardTitle>
          <CardDescription>BS7858 employment history and referee checks. References are added by HR during vetting.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <FileQuestion className="h-12 w-12 mb-3 opacity-50" />
            <p className="font-medium">No employment references on file</p>
            <p className="text-sm mt-1">References are added by HR during the vetting process.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Employment reference
            </CardTitle>
            <CardDescription>
              Record previous employers and conduct telephone screening. Use email and call actions to log contact. BS7858 employment history verification.
            </CardDescription>
          </div>
          {canEdit && (
            <Button variant="outline" size="sm" onClick={openAddModal} className="shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Add reference
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {references.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center border-t border-border">
            <Building2 className="h-10 w-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium text-foreground">No references yet</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Add employment references to run background checks and telephone screening.
            </p>
            {canEdit && (
              <Button variant="outline" size="sm" className="mt-4" onClick={openAddModal}>
                <Plus className="h-4 w-4 mr-2" />
                Add first reference
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto border-t border-border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[100px]">Requested</TableHead>
                  <TableHead className="text-center w-[70px]">Requests</TableHead>
                  <TableHead className="min-w-[140px]">Company</TableHead>
                  <TableHead className="min-w-[110px]">Phone</TableHead>
                  <TableHead className="min-w-[160px]">Email</TableHead>
                  <TableHead className="w-[90px]">From</TableHead>
                  <TableHead className="w-[90px]">To</TableHead>
                  <TableHead colSpan={3} className="text-center border-l border-border bg-muted/30">
                    Telephone screening
                  </TableHead>
                  <TableHead className="w-[90px]">Status</TableHead>
                  <TableHead className="text-right w-[100px]">Actions</TableHead>
                </TableRow>
                <TableRow className="hover:bg-transparent bg-muted/20">
                  <TableHead className="bg-transparent" />
                  <TableHead className="bg-transparent" />
                  <TableHead className="bg-transparent" />
                  <TableHead className="bg-transparent" />
                  <TableHead className="bg-transparent" />
                  <TableHead className="bg-transparent" />
                  <TableHead className="bg-transparent" />
                  <TableHead className="bg-transparent border-l border-border text-muted-foreground font-normal text-xs">
                    Confirmed from
                  </TableHead>
                  <TableHead className="bg-transparent text-muted-foreground font-normal text-xs">
                    Confirmed to
                  </TableHead>
                  <TableHead className="bg-transparent text-muted-foreground font-normal text-xs">
                    Comments
                  </TableHead>
                  <TableHead className="bg-transparent" />
                  <TableHead className="bg-transparent" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {references.map((ref) => {
                  const statusMeta = REFERENCE_STATUS.find((s) => s.value === ref.status) ?? REFERENCE_STATUS[0];
                  return (
                    <TableRow
                      key={ref.id}
                      className={cn(
                        "align-top",
                        ref.status === "verified" && "bg-success/5"
                      )}
                    >
                      <TableCell className="py-3 whitespace-nowrap text-sm">
                        {formatDate(ref.requestedDate)}
                      </TableCell>
                      <TableCell className="py-3 text-center">
                        <span className="text-sm tabular-nums">{ref.noOfRequests}</span>
                      </TableCell>
                      <TableCell className="py-3 min-w-[140px]">
                        <span className="font-medium text-sm">{ref.company || "—"}</span>
                      </TableCell>
                      <TableCell className="py-3 min-w-[110px]">
                        <span className="text-sm font-mono">{ref.phone || "—"}</span>
                      </TableCell>
                      <TableCell className="py-3 min-w-[160px]">
                        <span className="text-sm truncate block max-w-[180px]" title={ref.email}>
                          {ref.email || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 whitespace-nowrap text-sm">
                        {formatDate(ref.from)}
                      </TableCell>
                      <TableCell className="py-3 whitespace-nowrap text-sm">
                        {formatDate(ref.to)}
                      </TableCell>
                      <TableCell className="py-3 border-l border-border text-sm">
                        {formatDate(ref.confirmedDatesFrom)}
                      </TableCell>
                      <TableCell className="py-3 text-sm">
                        {formatDate(ref.confirmedDatesTo)}
                      </TableCell>
                      <TableCell className="py-3 max-w-[160px]">
                        <span className="text-sm text-muted-foreground line-clamp-2">
                          {ref.comments || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="outline" className={cn("text-xs status-badge", statusMeta.className)}>
                          {statusMeta.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          {canEdit && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                  onClick={() => openEditModal(ref)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">Edit reference</TooltipContent>
                            </Tooltip>
                          )}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={() => onSendEmail(ref)}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Send email to referee</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={() => onCall(ref)}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Log telephone screening call</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRef ? "Edit employment reference" : "Add employment reference"}</DialogTitle>
            <DialogDescription>
              Enter employer and employment period. Use telephone screening actions from the table to log contact.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Requested date</Label>
                <Input
                  type="date"
                  value={form.requestedDate}
                  onChange={(e) => setForm((f) => ({ ...f, requestedDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Number of requests</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.noOfRequests || ""}
                  onChange={(e) => setForm((f) => ({ ...f, noOfRequests: parseInt(e.target.value, 10) || 0 }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company name</Label>
                <Input
                  placeholder="Previous employer"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  placeholder="Referee phone"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="font-mono"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="referee@company.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employment from</Label>
                <Input
                  type="date"
                  value={form.from}
                  onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Employment to</Label>
                <Input
                  type="date"
                  value={form.to}
                  onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Confirmed dates from (screening)</Label>
                <Input
                  type="date"
                  value={form.confirmedDatesFrom}
                  onChange={(e) => setForm((f) => ({ ...f, confirmedDatesFrom: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Confirmed dates to (screening)</Label>
                <Input
                  type="date"
                  value={form.confirmedDatesTo}
                  onChange={(e) => setForm((f) => ({ ...f, confirmedDatesTo: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Screening comments</Label>
              <Input
                placeholder="Notes from telephone screening"
                value={form.comments}
                onChange={(e) => setForm((f) => ({ ...f, comments: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: v as EmploymentReferenceStatus }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REFERENCE_STATUS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveModal}>
              {editingRef ? "Save changes" : "Add reference"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
