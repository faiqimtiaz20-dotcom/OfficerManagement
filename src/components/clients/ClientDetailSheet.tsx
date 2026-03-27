import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Building2, StickyNote, Calendar, Mail, Phone, FileDigit, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ClientDetail {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  industry: string;
  sites: number;
  activeShifts: number;
  status: "active" | "inactive";
  since: string;
  companyRegNumber?: string;
  vatNumber?: string;
  companyRegisteredAddress?: string;
  website?: string;
  siteNames?: string[];
  notes?: string[];
}

const defaultSiteNames = [
  "Westfield Shopping Centre",
  "Westfield Stratford",
  "Westfield London",
];

const defaultNotes = [
  "Primary contact: John Manager (Security).",
  "Contract renewed until Dec 2026.",
];

interface ClientDetailSheetProps {
  client: ClientDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canEdit: boolean;
}

export function ClientDetailSheet({ client, open, onOpenChange, canEdit }: ClientDetailSheetProps) {
  if (!client) return null;

  const siteList = client.siteNames ?? defaultSiteNames;
  const notesList = client.notes ?? defaultNotes;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <SheetTitle className="text-xl truncate">{client.name}</SheetTitle>
                <p className="text-sm text-muted-foreground mt-0.5">{client.industry}</p>
                <Badge
                  variant="outline"
                  className={cn(
                    "mt-2 status-badge",
                    client.status === "active"
                      ? "status-active"
                      : "status-inactive"
                  )}
                >
                  {client.status}
                </Badge>
              </div>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-6 mt-4 grid grid-cols-3 w-auto">
            <TabsTrigger value="overview" className="gap-1.5 text-xs">
              Overview
            </TabsTrigger>
            <TabsTrigger value="sites" className="gap-1.5 text-xs">
              <MapPin className="h-3.5 w-3.5" />
              Sites
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-1.5 text-xs">
              <StickyNote className="h-3.5 w-3.5" />
              Notes
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 px-6 pb-6">
            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Sites
                  </p>
                  <p className="text-2xl font-bold">{client.sites}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Active shifts
                  </p>
                  <p className="text-2xl font-bold">{client.activeShifts}</p>
                </div>
              </div>
              {(client.email || client.phone || client.address) && (
                <div className="space-y-2">
                  {client.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <a href={`mailto:${client.email}`} className="text-primary hover:underline truncate">
                        {client.email}
                      </a>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                      <a href={`tel:${client.phone}`} className="text-primary hover:underline">
                        {client.phone}
                      </a>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                      <span className="whitespace-pre-line">{client.address}</span>
                    </div>
                  )}
                </div>
              )}
              {(client.companyRegNumber || client.vatNumber || client.website) && (
                <div className="space-y-2 pt-2 border-t border-border">
                  {client.companyRegNumber && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileDigit className="h-4 w-4 shrink-0" />
                      <span>Reg. no. {client.companyRegNumber}</span>
                    </div>
                  )}
                  {client.vatNumber && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                      <FileDigit className="h-4 w-4 shrink-0" />
                      <span>VAT {client.vatNumber}</span>
                    </div>
                  )}
                  {client.companyRegisteredAddress && (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                      <span className="whitespace-pre-line">Registered: {client.companyRegisteredAddress}</span>
                    </div>
                  )}
                  {client.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <a href={client.website.startsWith("http") ? client.website : `https://${client.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                        {client.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Client since {new Date(client.since).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
              </div>
            </TabsContent>

            <TabsContent value="sites" className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Sites linked to this client.
              </p>
              <ul className="space-y-2">
                {siteList.map((name, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm py-2 px-3 rounded-lg bg-muted/50 border border-border"
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    {name}
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="notes" className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Internal notes for this client.
              </p>
              <ul className="space-y-2">
                {notesList.map((note, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm py-2 px-3 rounded-lg bg-muted/50 border border-border"
                  >
                    <StickyNote className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    {note}
                  </li>
                ))}
              </ul>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
