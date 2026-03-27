import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Subcontractor } from "@/data/subcontractorsMock";

export interface AddSubcontractorFormData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: Subcontractor["status"];
}

const defaultFormData: AddSubcontractorFormData = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  status: "pending",
};

interface AddSubcontractorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (data: AddSubcontractorFormData) => void;
}

export function AddSubcontractorModal({
  open,
  onOpenChange,
  onSuccess,
}: AddSubcontractorModalProps) {
  const [data, setData] = useState<AddSubcontractorFormData>(defaultFormData);

  const handleClose = () => {
    setData(defaultFormData);
    onOpenChange(false);
  };

  const update = (partial: Partial<AddSubcontractorFormData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const handleSubmit = () => {
    onSuccess?.(data);
    handleClose();
  };

  const canSubmit =
    data.companyName.trim() && data.contactName.trim() && data.email.trim() && data.phone.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add subcontractor</DialogTitle>
          <DialogDescription>
            Add a subcontractor company. Contact details will be used for scheduling and invoicing.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company name</Label>
            <Input
              id="companyName"
              value={data.companyName}
              onChange={(e) => update({ companyName: e.target.value })}
              placeholder="e.g. SecureGuard Solutions Ltd"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactName">Contact name</Label>
            <Input
              id="contactName"
              value={data.contactName}
              onChange={(e) => update({ contactName: e.target.value })}
              placeholder="e.g. David Moore"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => update({ email: e.target.value })}
              placeholder="contact@company.co.uk"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={data.phone}
              onChange={(e) => update({ phone: e.target.value })}
              placeholder="+44 7700 900000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={data.status}
              onValueChange={(v) => update({ status: v as Subcontractor["status"] })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            Add subcontractor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
