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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AddClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  status: "active" | "inactive";
  defaultBaseRate: string;
}

const defaultFormData: AddClientFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  industry: "",
  status: "active",
  defaultBaseRate: "",
};

const INDUSTRIES = [
  "Corporate & Office",
  "Retail",
  "Healthcare",
  "Education",
  "Events & Venues",
  "Government & Public Sector",
  "Transport & Logistics",
  "Industrial & Warehousing",
  "Hospitality",
  "Construction",
  "Other",
] as const;

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (data: AddClientFormData) => void;
}

export function AddClientModal({ open, onOpenChange, onSuccess }: AddClientModalProps) {
  const [data, setData] = useState<AddClientFormData>(defaultFormData);

  const handleClose = () => {
    setData(defaultFormData);
    onOpenChange(false);
  };

  const update = (partial: Partial<AddClientFormData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name.trim() || !data.industry) return;
    onSuccess?.(data);
    handleClose();
  };

  const isValid = data.name.trim() !== "" && data.industry !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="client-name">Client name</Label>
            <Input
              id="client-name"
              placeholder="e.g. Acme Security Ltd"
              value={data.name}
              onChange={(e) => update({ name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-email">Email</Label>
            <Input
              id="client-email"
              type="email"
              placeholder="contact@client.com"
              value={data.email}
              onChange={(e) => update({ email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-phone">Phone number</Label>
            <Input
              id="client-phone"
              type="tel"
              placeholder="e.g. +44 20 7123 4567"
              value={data.phone}
              onChange={(e) => update({ phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-address">Address</Label>
            <Textarea
              id="client-address"
              placeholder="Street, city, postcode"
              value={data.address}
              onChange={(e) => update({ address: e.target.value })}
              rows={2}
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-industry">Industry</Label>
            <Select
              value={data.industry}
              onValueChange={(value) => update({ industry: value })}
            >
              <SelectTrigger id="client-industry">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-default-base-rate">Default Charge rate (£)</Label>
            <Input
              id="client-default-base-rate"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 14.50"
              value={data.defaultBaseRate}
              onChange={(e) => update({ defaultBaseRate: e.target.value })}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary" disabled={!isValid}>
              Add Client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
