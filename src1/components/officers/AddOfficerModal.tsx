import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, ChevronLeft, Upload, User, CreditCard, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOfficerTypes } from "@/context/OfficerTypesContext";
import { subcontractorsList } from "@/data/subcontractorsMock";

export interface AddOfficerFormData {
  // Step 1 – Personal
  name: string;
  email: string;
  phone: string;
  address: string;
  officerTypeId: string;
  subcontractorId: string;
  // Step 2 – SIA (only when type requires licence)
  siaLicense: string;
  siaExpiry: string;
  // Step 3 – Documents (mock: just a note)
  documentsNote: string;
}

const defaultFormData: AddOfficerFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  officerTypeId: "",
  subcontractorId: "",
  siaLicense: "",
  siaExpiry: "",
  documentsNote: "",
};

interface AddOfficerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (data: AddOfficerFormData) => void;
}

export function AddOfficerModal({ open, onOpenChange, onSuccess }: AddOfficerModalProps) {
  const { officerTypes, getRequiresLicence } = useOfficerTypes();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AddOfficerFormData>(defaultFormData);

  const requiresLicence = data.officerTypeId ? getRequiresLicence(data.officerTypeId) : false;
  const totalSteps = requiresLicence ? 3 : 2;
  const progressStep = step === 3 && !requiresLicence ? 2 : step;
  const progress = (progressStep / totalSteps) * 100;

  const handleClose = () => {
    setStep(1);
    setData(defaultFormData);
    onOpenChange(false);
  };

  const update = (partial: Partial<AddOfficerFormData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const handleSubmit = () => {
    onSuccess?.(data);
    handleClose();
  };

  const goNext = () => {
    if (step === 1) {
      if (requiresLicence) setStep(2);
      else setStep(3);
    } else if (step === 2) setStep(3);
  };

  const goBack = () => {
    if (step === 3) {
      if (requiresLicence) setStep(2);
      else setStep(1);
    } else if (step === 2) setStep(1);
  };

  const canNextStep1 =
    data.name.trim() &&
    data.email.trim() &&
    data.phone.trim() &&
    data.officerTypeId &&
    data.subcontractorId.trim() !== "";
  const canNextStep2 = data.siaLicense.trim() && data.siaExpiry.trim();
  const isLastStep = step === 3;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Add Officer</DialogTitle>
          <div className="flex gap-2 pt-2 flex-wrap">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium",
                step === 1 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              )}
            >
              <User className="h-3.5 w-3.5" />
              Personal
            </div>
            {requiresLicence && (
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium",
                  step === 2 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                <CreditCard className="h-3.5 w-3.5" />
                SIA details
              </div>
            )}
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium",
                step === 3 ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              )}
            >
              <FileCheck className="h-3.5 w-3.5" />
              Documents
            </div>
          </div>
          <Progress value={progress} className="h-1.5 mt-2" />
        </DialogHeader>

        <div className="min-h-[240px] px-2 py-4 overflow-y-auto flex-1 min-h-0">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="officerType">Type of officer</Label>
                <Select
                  value={data.officerTypeId || ""}
                  onValueChange={(v) => update({ officerTypeId: v })}
                >
                  <SelectTrigger id="officerType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {officerTypes.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                        {t.requiresLicence ? " (SIA required)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcontractor">Subcontractor</Label>
                <Select
                  value={data.subcontractorId || ""}
                  onValueChange={(v) => update({ subcontractorId: v })}
                >
                  <SelectTrigger id="subcontractor">
                    <SelectValue placeholder="Select Main or subcontractor" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcontractorsList.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Main = direct employees; otherwise select the supplying subcontractor.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => update({ name: e.target.value })}
                  placeholder="e.g. James Wilson"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => update({ email: e.target.value })}
                  placeholder="james@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={data.phone}
                  onChange={(e) => update({ phone: e.target.value })}
                  placeholder="+44 7700 900123"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address (optional)</Label>
                <Input
                  id="address"
                  value={data.address}
                  onChange={(e) => update({ address: e.target.value })}
                  placeholder="Current address"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siaLicense">SIA licence number</Label>
                <Input
                  id="siaLicense"
                  value={data.siaLicense}
                  onChange={(e) => update({ siaLicense: e.target.value })}
                  placeholder="16 digits"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siaExpiry">SIA expiry date</Label>
                <Input
                  id="siaExpiry"
                  type="date"
                  value={data.siaExpiry}
                  onChange={(e) => update({ siaExpiry: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Upload identity and right-to-work documents. (Demo: uploads are not stored.)
              </p>
              <div className="border-2 border-dashed rounded-lg p-6 text-center text-muted-foreground">
                <Upload className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Drag and drop or click to upload</p>
                <p className="text-xs mt-1">ID, right-to-work, etc.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="docNote">Notes (optional)</Label>
                <Input
                  id="docNote"
                  value={data.documentsNote}
                  onChange={(e) => update({ documentsNote: e.target.value })}
                  placeholder="e.g. Passport and BRP uploaded"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 shrink-0">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={goBack}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          ) : (
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}
          <div className="flex-1" />
          {!isLastStep ? (
            <Button
              type="button"
              className="gradient-primary"
              disabled={step === 1 ? !canNextStep1 : !canNextStep2}
              onClick={goNext}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button type="button" className="gradient-primary" onClick={handleSubmit}>
              Save Officer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
