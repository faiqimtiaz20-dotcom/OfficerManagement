import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MapPin,
  Building2,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useSites } from "@/context/SitesContext";
import { getClientById } from "@/data/mockDb";
import { clientsList } from "@/data/clientsMock";
import { AddSiteModal, type AddSiteFormData } from "@/components/sites/AddSiteModal";
import { SiteDetailSheet, type SiteDetail } from "@/components/sites/SiteDetailSheet";
import { toast } from "sonner";
import type { Site } from "@/data/sitesMock";

function toSiteDetail(site: Site): SiteDetail {
  const clientName = getClientById(site.clientId)?.name ?? "—";
  return {
    id: site.id,
    name: site.name,
    address: site.address,
    client: clientName,
    status: site.status,
    currentShifts: site.currentShifts,
    bookonEmail: site.bookonEmail,
    contact: site.contact,
    sop: site.sop,
    notes: site.notes,
  };
}

export default function Sites() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { sites, addSite, removeSite } = useSites();
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [detailSite, setDetailSite] = useState<SiteDetail | null>(null);

  const canEditSites = user?.role === "ADMIN" || user?.role === "OPS";

  const openDetailSheet = (site: Site) => {
    setDetailSite(toSiteDetail(site));
    setDetailSheetOpen(true);
  };

  const openEditPage = (site: Site) => {
    navigate(`/sites/${site.id}`);
  };

  const handleAddSiteSuccess = (data: AddSiteFormData) => {
    addSite({
      name: data.name.trim(),
      address: data.address.trim(),
      clientId: data.clientId,
      status: data.status,
      currentShifts: 0,
      bookonEmail: data.bookonEmail.trim() || undefined,
      contact: {
        name: data.contactName.trim(),
        phone: data.contactPhone.trim(),
        email: data.contactEmail.trim(),
      },
    });
    toast.success("Site added.");
    setAddModalOpen(false);
  };

  const handleDeleteSite = (site: Site, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete site "${site.name}"?`)) {
      removeSite(site.id);
      if (detailSite?.id === site.id) setDetailSheetOpen(false);
      toast.success("Site removed.");
    }
  };

  const filteredSites = sites.filter(
    (site) =>
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (getClientById(site.clientId)?.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout title="Sites" subtitle="Manage client locations and requirements">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {canEditSites && (
            <Button className="gradient-primary" onClick={() => setAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Site
            </Button>
          )}
        </div>

        <AddSiteModal
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
          onSuccess={handleAddSiteSuccess}
          clients={clientsList}
        />

        <SiteDetailSheet
          site={detailSite}
          open={detailSheetOpen}
          onOpenChange={setDetailSheetOpen}
          canEdit={canEditSites}
        />

        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[240px]">Site</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Book-on email</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.map((site) => {
                  const clientName = getClientById(site.clientId)?.name ?? "—";
                  return (
                    <TableRow
                      key={site.id}
                      className="group cursor-pointer hover:bg-muted/50"
                      onClick={() => openDetailSheet(site)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "p-2 rounded-lg shrink-0",
                              site.status === "active" ? "bg-success/10" : "bg-muted"
                            )}
                          >
                            <MapPin
                              className={cn(
                                "h-4 w-4",
                                site.status === "active" ? "text-success" : "text-muted-foreground"
                              )}
                            />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{site.name}</p>
                            <p className="text-sm text-muted-foreground">{site.contact.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          {clientName}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {site.address}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            site.status === "active" ? "status-active" : "status-inactive"
                          )}
                        >
                          {site.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {site.bookonEmail || "—"}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openDetailSheet(site)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View details
                            </DropdownMenuItem>
                            {canEditSites && (
                              <DropdownMenuItem onClick={() => openEditPage(site)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {canEditSites && (
                              <DropdownMenuItem className="text-destructive" onClick={(e) => handleDeleteSite(site, e)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
