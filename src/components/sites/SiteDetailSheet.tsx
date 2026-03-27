import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Building2, FileText, StickyNote, Phone, Mail, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SiteDetail {
  id: string;
  name: string;
  address: string;
  client: string;
  status: "active" | "inactive";
  currentShifts: number;
  bookonEmail?: string;
  contact: { name: string; phone: string; email: string };
  sop?: string;
  notes?: string[];
}

const defaultSop =
  "1. Report to control room on arrival.\n2. Complete handover with outgoing officer.\n3. Conduct hourly patrols of zones A–C.\n4. Log all incidents in the daily report.\n5. Emergency contact: Control 020 7123 4567.";

const defaultNotes = [
  "Key holder: John Manager – collect from reception.",
  "Access code for side gate: 4521.",
];

interface SiteDetailSheetProps {
  site: SiteDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canEdit: boolean;
}

export function SiteDetailSheet({ site, open, onOpenChange, canEdit }: SiteDetailSheetProps) {
  const navigate = useNavigate();
  if (!site) return null;

  const handleEdit = () => {
    onOpenChange(false);
    navigate(`/sites/${site.id}`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={cn(
                  "p-2 rounded-lg flex-shrink-0",
                  site.status === "active" ? "bg-success/10" : "bg-muted"
                )}
              >
                <MapPin
                  className={cn(
                    "h-5 w-5",
                    site.status === "active" ? "text-success" : "text-muted-foreground"
                  )}
                />
              </div>
              <div className="min-w-0">
                <SheetTitle className="text-xl truncate">{site.name}</SheetTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Building2 className="h-3 w-3" />
                  {site.client}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "status-badge",
                      site.status === "active" ? "status-active" : "status-inactive"
                    )}
                  >
                    {site.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
            {canEdit && (
              <Button variant="outline" size="sm" onClick={handleEdit} className="shrink-0">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-6 mt-4 grid grid-cols-3 w-auto">
            <TabsTrigger value="overview" className="gap-1.5 text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="sop" className="gap-1.5 text-xs">
              <FileText className="h-3.5 w-3.5" />
              SOP & Instructions
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-1.5 text-xs">
              <StickyNote className="h-3.5 w-3.5" />
              Notes
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 px-6 pb-6">
            <TabsContent value="overview" className="mt-4 space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Address
                </p>
                <p className="text-sm">{site.address}</p>
              </div>
              {site.bookonEmail && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Book-on email
                  </p>
                  <a href={`mailto:${site.bookonEmail}`} className="text-sm text-primary hover:underline">
                    {site.bookonEmail}
                  </a>
                </div>
              )}
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Site contact
                </p>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{site.contact.name}</p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {site.contact.phone}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {site.contact.email}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sop" className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Standard operating procedures and site instructions.
              </p>
              {canEdit ? (
                <Textarea
                  defaultValue={site.sop ?? defaultSop}
                  className="min-h-[200px] font-mono text-sm"
                  placeholder="Enter SOP and instructions..."
                />
              ) : (
                <div className="rounded-lg border bg-muted/30 p-4 whitespace-pre-wrap text-sm font-mono">
                  {site.sop ?? defaultSop}
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes" className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Internal notes for this site.
              </p>
              <ul className="space-y-2">
                {(site.notes ?? defaultNotes).map((note, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm py-2 px-3 rounded-lg bg-muted/50 border border-border"
                  >
                    <StickyNote className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    {note}
                  </li>
                ))}
              </ul>
              {canEdit && (
                <Textarea
                  placeholder="Add a note..."
                  className="min-h-[80px]"
                />
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
