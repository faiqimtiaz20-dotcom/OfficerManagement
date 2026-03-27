import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Briefcase,
  Users,
  MapPin,
  FileText,
  Phone,
  Mail,
  Building2,
  StickyNote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Subcontractor } from "@/data/subcontractorsMock";

const SITE_NAMES: Record<string, string> = {
  "1": "Westfield Shopping Centre",
  "2": "HSBC Tower",
  "3": "Royal Hospital",
  "4": "Tech Park Building A",
  "5": "Metro Station Central",
  "6": "Old Warehouse",
};

const statusConfig = {
  active: { label: "Active", className: "status-active" },
  pending: { label: "Pending", className: "status-pending" },
  inactive: { label: "Inactive", className: "status-inactive" },
};

interface SubcontractorDetailSheetProps {
  subcontractor: Subcontractor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  canEdit?: boolean;
}

export function SubcontractorDetailSheet({
  subcontractor,
  open,
  onOpenChange,
}: SubcontractorDetailSheetProps) {
  if (!subcontractor) return null;

  const status = statusConfig[subcontractor.status];
  const contactPersons = subcontractor.contactPersons ?? [];
  const siteIds = subcontractor.siteIds ?? [];
  const documents = subcontractor.documents ?? [];
  const siteNames = siteIds.map((sid) => SITE_NAMES[sid] ?? sid);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={cn(
                  "p-2 rounded-lg flex-shrink-0",
                  subcontractor.status === "active" ? "bg-success/10" : "bg-muted"
                )}
              >
                <Briefcase
                  className={cn(
                    "h-5 w-5",
                    subcontractor.status === "active" ? "text-success" : "text-muted-foreground"
                  )}
                />
              </div>
              <div className="min-w-0">
                <SheetTitle className="text-xl truncate">{subcontractor.companyName}</SheetTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  {subcontractor.contactName}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className={cn("status-badge", status.className)}>
                    {status.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-6 mt-4 flex flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="overview" className="gap-1.5 text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="contacts" className="gap-1.5 text-xs">
              <Users className="h-3.5 w-3.5" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="sites" className="gap-1.5 text-xs">
              <MapPin className="h-3.5 w-3.5" />
              Sites
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-1.5 text-xs">
              <FileText className="h-3.5 w-3.5" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-1.5 text-xs">
              <StickyNote className="h-3.5 w-3.5" />
              Notes
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 px-6 pb-6">
            <TabsContent value="overview" className="mt-4 space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Primary contact
                </p>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{subcontractor.contactName}</p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <a href={`mailto:${subcontractor.email}`} className="text-primary hover:underline">
                      {subcontractor.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {subcontractor.phone}
                  </div>
                </div>
              </div>
              {subcontractor.companyAddress && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Address
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {subcontractor.companyAddress}
                  </p>
                </div>
              )}
              {(subcontractor.companyRegNumber || subcontractor.vatNumber) && (
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                  {subcontractor.companyRegNumber && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        Company reg
                      </p>
                      <p className="text-sm font-mono">{subcontractor.companyRegNumber}</p>
                    </div>
                  )}
                  {subcontractor.vatNumber && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                        VAT number
                      </p>
                      <p className="text-sm font-mono">{subcontractor.vatNumber}</p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="contacts" className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Contact persons at this subcontractor.
              </p>
              {contactPersons.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No contact persons on file.</p>
              ) : (
                <ul className="space-y-2">
                  {contactPersons.map((c) => (
                    <li
                      key={c.id}
                      className="flex items-start gap-2 text-sm py-2 px-3 rounded-lg bg-muted/50 border border-border"
                    >
                      <Users className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">{c.name}</span>
                        {c.role && <span className="text-muted-foreground"> · {c.role}</span>}
                        {c.email && (
                          <p className="text-muted-foreground text-xs mt-0.5">{c.email}</p>
                        )}
                        {c.phone && (
                          <p className="text-muted-foreground text-xs">{c.phone}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="sites" className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Sites this subcontractor provides cover for.
              </p>
              {siteNames.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No sites assigned.</p>
              ) : (
                <ul className="space-y-2">
                  {siteNames.map((name, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm py-2 px-3 rounded-lg bg-muted/50 border border-border"
                    >
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      {name}
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="documents" className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Contracts, insurance and other documents.
              </p>
              {documents.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No documents on file.</p>
              ) : (
                <ul className="space-y-2">
                  {documents.map((d) => (
                    <li
                      key={d.id}
                      className="flex items-start gap-2 text-sm py-2 px-3 rounded-lg bg-muted/50 border border-border"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">{d.name}</span>
                        <span className="text-muted-foreground text-xs block">{d.file}</span>
                        <span className="text-muted-foreground text-xs">{d.date}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>

            <TabsContent value="notes" className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Internal notes for this subcontractor.
              </p>
              {subcontractor.notes ? (
                <div className="rounded-lg border bg-muted/30 p-4 whitespace-pre-wrap text-sm">
                  {subcontractor.notes}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4">No notes.</p>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
