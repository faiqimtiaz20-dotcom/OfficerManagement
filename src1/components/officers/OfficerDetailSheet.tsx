import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Shield,
  FileText,
  Briefcase,
  MapPin,
  Hash,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Officer } from "@/data/officersMock";
import { useOfficerTypes } from "@/context/OfficerTypesContext";

const statusConfig = {
  active: { label: "Active", className: "status-active" },
  pending: { label: "Pending", className: "status-pending" },
  suspended: { label: "Suspended", className: "status-inactive" },
};

const complianceConfig = {
  compliant: { label: "Compliant", className: "status-active" },
  pending: { label: "Pending", className: "status-pending" },
  expired: { label: "Expired", className: "status-inactive" },
};

interface OfficerDetailSheetProps {
  officer: Officer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OfficerDetailSheet({
  officer,
  open,
  onOpenChange,
}: OfficerDetailSheetProps) {
  const { getById: getOfficerTypeById } = useOfficerTypes();

  if (!officer) return null;

  const status = statusConfig[officer.status];
  const compliance = complianceConfig[officer.complianceStatus];
  const officerTypeName = officer.officerTypeId
    ? getOfficerTypeById(officer.officerTypeId)?.name
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 shrink-0">
              <AvatarImage src={officer.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {officer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-xl truncate">{officer.name}</SheetTitle>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {officer.email}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className={cn("status-badge", status.className)}>
                  {status.label}
                </Badge>
                <Badge variant="outline" className={cn("status-badge", compliance.className)}>
                  {compliance.label}
                </Badge>
                {officerTypeName && (
                  <Badge variant="secondary" className="text-xs">
                    {officerTypeName}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-6 mt-4 flex flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="overview" className="gap-1.5 text-xs">
              <User className="h-3.5 w-3.5" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="sia" className="gap-1.5 text-xs">
              <CreditCard className="h-3.5 w-3.5" />
              SIA licence
            </TabsTrigger>
            <TabsTrigger value="compliance" className="gap-1.5 text-xs">
              <Shield className="h-3.5 w-3.5" />
              BS7858
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-1.5 text-xs">
              <FileText className="h-3.5 w-3.5" />
              Documents
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 px-6 pb-6">
            <TabsContent value="overview" className="mt-4 space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Contact
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <a href={`mailto:${officer.email}`} className="text-primary hover:underline">
                      {officer.email}
                    </a>
                  </div>
                  {officer.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 shrink-0" />
                      {officer.phone}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Officer type
                </p>
                <p className="text-sm flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                  {officerTypeName ?? "—"}
                </p>
              </div>

              {officer.address && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Address
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    {officer.address}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    National Insurance number
                  </p>
                  <p className="text-sm font-mono flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
                    {officer.niNumber ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Date of birth
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    {officer.dateOfBirth
                      ? new Date(officer.dateOfBirth).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Status
                  </p>
                  <p className="text-sm font-medium">{status.label}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    BS7858
                  </p>
                  <p className="text-sm font-medium">{compliance.label}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sia" className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                SIA licence details. Use Edit for full profile.
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Licence number
                  </p>
                  <p className="text-sm font-mono">
                    {officer.siaLicense.replace(/(.{4})/g, "$1 ").trim()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Expiry date
                  </p>
                  <p className="text-sm">
                    {new Date(officer.siaExpiry).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                BS7858 vetting status. Open full profile for checklist and employment references.
              </p>
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Compliance status
                </p>
                <p className="text-sm font-medium">{compliance.label}</p>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                Proof of identity, right to work, DBS and other documents are held on the full profile. Click Edit from the list to open the full officer detail page.
              </p>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
