import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSites } from "@/context/SitesContext";
import { getClientById } from "@/data/mockDb";
import { useOfficerTypes } from "@/context/OfficerTypesContext";
import { toast } from "sonner";

export type BroadcastAudienceType = "all" | "site" | "role";

interface BroadcastModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BroadcastModal({ open, onOpenChange }: BroadcastModalProps) {
  const { sites } = useSites();
  const { officerTypes } = useOfficerTypes();
  const [audienceType, setAudienceType] = useState<BroadcastAudienceType>("all");
  const [siteId, setSiteId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [message, setMessage] = useState("");

  const handleClose = () => {
    setAudienceType("all");
    setSiteId("");
    setRoleId("");
    setMessage("");
    onOpenChange(false);
  };

  const handleSend = () => {
    const text = message.trim();
    if (!text) {
      toast.error("Please enter a message.");
      return;
    }
    if (audienceType === "site" && !siteId) {
      toast.error("Please select a site.");
      return;
    }
    if (audienceType === "role" && !roleId) {
      toast.error("Please select a role.");
      return;
    }
    // Mock send
    const audienceLabel =
      audienceType === "all"
        ? "All officers"
        : audienceType === "site"
          ? `Officers at ${sites.find((s) => s.id === siteId)?.name ?? "site"}`
          : `Role: ${officerTypes.find((r) => r.id === roleId)?.name ?? "role"}`;
    toast.success(`Broadcast sent to ${audienceLabel} (mock).`);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Broadcast message</DialogTitle>
          <DialogDescription>
            Send a message to officers. Choose who should receive it. This is a mock; no message is actually sent.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Audience</Label>
            <Select
              value={audienceType}
              onValueChange={(v) => setAudienceType(v as BroadcastAudienceType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All officers</SelectItem>
                <SelectItem value="site">Officers at site</SelectItem>
                <SelectItem value="role">By role (e.g. Supervisor)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {audienceType === "site" && (
            <div className="space-y-2">
              <Label>Site</Label>
              <Select value={siteId} onValueChange={setSiteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select site" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => {
                    const clientName = getClientById(site.clientId)?.name ?? "";
                    return (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                        {clientName ? ` (${clientName})` : ""}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
          {audienceType === "role" && (
            <div className="space-y-2">
              <Label>Role / officer type</Label>
              <Select value={roleId} onValueChange={setRoleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {officerTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message..."
              rows={4}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSend} className="gradient-primary">
            Send broadcast
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
