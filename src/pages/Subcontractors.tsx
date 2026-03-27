import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { hasTenantFullAccess } from "@/lib/tenantPermissions";
import { AddSubcontractorModal, type AddSubcontractorFormData } from "@/components/subcontractors/AddSubcontractorModal";
import { SubcontractorDetailSheet } from "@/components/subcontractors/SubcontractorDetailSheet";
import { toast } from "sonner";
import { subcontractorsList, type Subcontractor } from "@/data/subcontractorsMock";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusConfig = {
  active: { label: "Active", className: "status-active" },
  pending: { label: "Pending", className: "status-pending" },
  inactive: { label: "Inactive", className: "status-inactive" },
};

export default function Subcontractors() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>(subcontractorsList);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [detailSubcontractor, setDetailSubcontractor] = useState<Subcontractor | null>(null);

  const canAddSubcontractor =
    hasTenantFullAccess(user?.role) || user?.role === "HR" || user?.role === "OPS";
  const canEditSubcontractor =
    hasTenantFullAccess(user?.role) || user?.role === "HR" || user?.role === "OPS";

  const openDetailSheet = (sub: Subcontractor) => {
    setDetailSubcontractor(sub);
    setDetailSheetOpen(true);
  };

  const openFullDetailPage = () => {
    if (!detailSubcontractor) return;
    navigate(`/subcontractors/${detailSubcontractor.id}`, {
      state: { subcontractor: detailSubcontractor },
    });
    setDetailSheetOpen(false);
  };

  const handleAddSubcontractorSuccess = (data: AddSubcontractorFormData) => {
    const newOne: Subcontractor = {
      id: String(Date.now()),
      companyName: data.companyName,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      status: data.status,
    };
    setSubcontractors((prev) => [newOne, ...prev]);
    toast.success("Subcontractor added.");
    setAddModalOpen(false);
  };

  const filteredSubcontractors = subcontractors.filter((s) => {
    const matchesSearch =
      s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout
      title="Subcontractors"
      subtitle="Manage subcontractor companies and contacts"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subcontractors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3">
            {canAddSubcontractor && (
              <Button className="gradient-primary" onClick={() => setAddModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add subcontractor
              </Button>
            )}
          </div>
        </div>

        <AddSubcontractorModal
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
          onSuccess={handleAddSubcontractorSuccess}
        />

        <SubcontractorDetailSheet
          subcontractor={detailSubcontractor}
          open={detailSheetOpen}
          onOpenChange={setDetailSheetOpen}
          onEdit={openFullDetailPage}
          canEdit={canEditSubcontractor}
        />

        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[200px]">Company</TableHead>
                <TableHead className="min-w-[140px]">Contact</TableHead>
                <TableHead className="min-w-[200px]">Email</TableHead>
                <TableHead className="min-w-[120px]">Phone</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubcontractors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No subcontractors found. {canAddSubcontractor && "Add one to get started."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubcontractors.map((sub) => {
                  const status = statusConfig[sub.status];
                  return (
                    <TableRow
                      key={sub.id}
                      className="group cursor-pointer"
                      onClick={() => openDetailSheet(sub)}
                    >
                      <TableCell className="font-medium">{sub.companyName}</TableCell>
                      <TableCell>{sub.contactName}</TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${sub.email}`}
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          {sub.email}
                        </a>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{sub.phone}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium status-badge ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem onClick={() => openDetailSheet(sub)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                navigate(`/subcontractors/${sub.id}`, { state: { subcontractor: sub } });
                              }}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`mailto:${sub.email}`}>
                                <Mail className="h-4 w-4 mr-2" />
                                Email
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`tel:${sub.phone}`}>
                                <Phone className="h-4 w-4 mr-2" />
                                Call
                              </a>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <p className="text-sm text-muted-foreground">
          Showing {filteredSubcontractors.length} of {subcontractors.length} subcontractors
        </p>
      </div>
    </MainLayout>
  );
}
