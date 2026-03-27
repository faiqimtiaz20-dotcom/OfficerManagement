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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Client } from "@/data/clientsMock";

export interface AddSiteFormData {
  name: string;
  address: string;
  clientId: string;
  status: "active" | "inactive";
  bookonEmail: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

const defaultFormData: AddSiteFormData = {
  name: "",
  address: "",
  clientId: "",
  status: "active",
  bookonEmail: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
};

interface AddSiteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (data: AddSiteFormData) => void;
  clients: Client[];
  /** When set, client dropdown is hidden and fixed to this client. */
  fixedClientId?: string;
}

export function AddSiteModal({
  open,
  onOpenChange,
  onSuccess,
  clients,
  fixedClientId,
}: AddSiteModalProps) {
  const [data, setData] = useState<AddSiteFormData>(defaultFormData);

  const handleClose = () => {
    setData(defaultFormData);
    onOpenChange(false);
  };

  const update = (partial: Partial<AddSiteFormData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clientId = fixedClientId ?? data.clientId;
    if (!data.name.trim() || !clientId) return;
    onSuccess?.({ ...data, clientId });
    handleClose();
  };

  const clientId = fixedClientId ?? data.clientId;
  const isValid =
    data.name.trim() !== "" &&
    clientId !== "" &&
    data.contactName.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Site</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label>Site name</Label>
            <Input
              value={data.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="e.g. Westfield Shopping Centre"
            />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={data.address}
              onChange={(e) => update({ address: e.target.value })}
              placeholder="Street, city, postcode"
            />
          </div>
          {!fixedClientId && (
            <div className="space-y-2">
              <Label>Client</Label>
              <Select value={data.clientId} onValueChange={(v) => update({ clientId: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label>Book-on email</Label>
            <Input
              type="email"
              value={data.bookonEmail}
              onChange={(e) => update({ bookonEmail: e.target.value })}
              placeholder="bookon@site.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Site contact name</Label>
            <Input
              value={data.contactName}
              onChange={(e) => update({ contactName: e.target.value })}
              placeholder="Full name"
            />
          </div>
          <div className="space-y-2">
            <Label>Contact phone</Label>
            <Input
              value={data.contactPhone}
              onChange={(e) => update({ contactPhone: e.target.value })}
              placeholder="+44 20 7123 4567"
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label>Contact email</Label>
            <Input
              type="email"
              value={data.contactEmail}
              onChange={(e) => update({ contactEmail: e.target.value })}
              placeholder="contact@site.com"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary" disabled={!isValid}>
              Add Site
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
