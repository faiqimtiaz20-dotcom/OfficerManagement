import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Briefcase,
  Users,
  UserCheck,
  MapPin,
  FileText,
  MoreHorizontal,
  Mail,
  Phone,
  Save,
  Plus,
  Trash2,
  Upload,
  Send,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { hasTenantFullAccess } from "@/lib/tenantPermissions";
import {
  type Subcontractor,
  type ContactPerson,
  type SubcontractorDocument,
  type SiteCoverageHistoryEntry,
} from "@/data/subcontractorsMock";
import { getSubcontractorById, mockDb } from "@/data/mockDb";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const officersList = mockDb.officersList;

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

const SUBCONTRACTOR_DOCUMENT_TYPES = [
  "Insurance certificate",
  "Contract",
  "Public liability",
  "Employer's liability",
  "SIA ACS / approval",
  "Other",
];

export default function SubcontractorDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const canEdit = hasTenantFullAccess(user?.role) || user?.role === "HR" || user?.role === "OPS";

  const location = useLocation();
  const fromState = (location.state as { subcontractor?: Subcontractor } | null)?.subcontractor;
  const loaded = fromState ?? (id ? getSubcontractorById(id) : undefined);

  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Subcontractor["status"]>("pending");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyRegNumber, setCompanyRegNumber] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);
  const [officerIds, setOfficerIds] = useState<string[]>([]);
  const [siteIds, setSiteIds] = useState<string[]>([]);
  const [siteCoverageHistory, setSiteCoverageHistory] = useState<SiteCoverageHistoryEntry[]>([]);
  const [documents, setDocuments] = useState<SubcontractorDocument[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadDocType, setUploadDocType] = useState(SUBCONTRACTOR_DOCUMENT_TYPES[0]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    if (!loaded) return;
    setCompanyName(loaded.companyName);
    setContactName(loaded.contactName);
    setEmail(loaded.email);
    setPhone(loaded.phone);
    setStatus(loaded.status);
    setCompanyAddress(loaded.companyAddress ?? "");
    setCompanyRegNumber(loaded.companyRegNumber ?? "");
    setVatNumber(loaded.vatNumber ?? "");
    setNotes(loaded.notes ?? "");
    setContactPersons(loaded.contactPersons ?? []);
    setOfficerIds(loaded.officerIds ?? []);
    setSiteIds(loaded.siteIds ?? []);
    setSiteCoverageHistory(loaded.siteCoverageHistory ?? []);
    setDocuments(loaded.documents ?? []);
  }, [loaded]);

  const handleSave = () => {
    toast.success("Subcontractor details saved. In production this would persist to the backend.");
  };

  const handleUploadDocument = () => {
    const file = uploadFile;
    if (!file) {
      toast.error("Please select a file.");
      return;
    }
    setDocuments((prev) => [
      ...prev,
      {
        id: `d-${Date.now()}`,
        name: uploadDocType,
        file: file.name,
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    toast.success("Document added.");
    setUploadFile(null);
    setUploadDialogOpen(false);
  };

  const handleRequestDocument = (docType: string) => {
    toast.success(`Request sent to subcontractor for: ${docType}`);
  };

  const addContactPerson = () => {
    setContactPersons((prev) => [
      ...prev,
      { id: `c-${Date.now()}`, name: "", role: "", email: "", phone: "" },
    ]);
  };

  const updateContactPerson = (cid: string, patch: Partial<ContactPerson>) => {
    setContactPersons((prev) => prev.map((c) => (c.id === cid ? { ...c, ...patch } : c)));
  };

  const removeContactPerson = (cid: string) => {
    setContactPersons((prev) => prev.filter((c) => c.id !== cid));
  };

  const selectedOfficers = officersList.filter((o) => officerIds.includes(o.id));
  const selectedSites = siteIds.map((sid) => ({ id: sid, name: SITE_NAMES[sid] ?? sid }));

  if (!id) {
    return (
      <MainLayout title="Subcontractor" subtitle="Not found">
        <p className="text-muted-foreground">No subcontractor ID provided.</p>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/subcontractors">Back to Subcontractors</Link>
        </Button>
      </MainLayout>
    );
  }

  if (!loaded) {
    return (
      <MainLayout title="Subcontractor" subtitle="Not found">
        <p className="text-muted-foreground">Subcontractor not found. It may have been added in this session.</p>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/subcontractors">Back to Subcontractors</Link>
        </Button>
      </MainLayout>
    );
  }

  const statusBadge = statusConfig[status];

  return (
    <MainLayout
      title={companyName || "Subcontractor"}
      subtitle="Company details, contacts, officers, sites and documents"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/subcontractors" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Subcontractors
            </Link>
          </Button>
          {canEdit && (
            <Button className="gradient-primary" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save changes
            </Button>
          )}
        </div>

        <Card className="glass-card">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{companyName || "—"}</CardTitle>
                <CardDescription>
                  Primary contact: {contactName || "—"} · {email || "—"}
                </CardDescription>
              </div>
              <Badge variant="outline" className={cn("status-badge ml-auto", statusBadge.className)}>
                {statusBadge.label}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="company" className="space-y-4">
          <TabsList className="flex flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="company" className="gap-1.5 text-xs">
              <Briefcase className="h-3.5 w-3.5" />
              Company details
            </TabsTrigger>
            <TabsTrigger value="contacts" className="gap-1.5 text-xs">
              <Users className="h-3.5 w-3.5" />
              Contact persons
            </TabsTrigger>
            <TabsTrigger value="officers" className="gap-1.5 text-xs">
              <UserCheck className="h-3.5 w-3.5" />
              Officers
            </TabsTrigger>
            <TabsTrigger value="sites" className="gap-1.5 text-xs">
              <MapPin className="h-3.5 w-3.5" />
              Sites covered
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-1.5 text-xs">
              <FileText className="h-3.5 w-3.5" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="other" className="gap-1.5 text-xs">
              <MoreHorizontal className="h-3.5 w-3.5" />
              Other
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Company details</CardTitle>
                <CardDescription>Registered address and company information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Company name</Label>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      disabled={!canEdit}
                      placeholder="Company name"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Registered address</Label>
                    <Input
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      disabled={!canEdit}
                      placeholder="Address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company registration number</Label>
                    <Input
                      value={companyRegNumber}
                      onChange={(e) => setCompanyRegNumber(e.target.value)}
                      disabled={!canEdit}
                      placeholder="e.g. 12345678"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>VAT number</Label>
                    <Input
                      value={vatNumber}
                      onChange={(e) => setVatNumber(e.target.value)}
                      disabled={!canEdit}
                      placeholder="e.g. GB 123456789"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary contact name</Label>
                    <Input
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      disabled={!canEdit}
                      placeholder="Main contact"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!canEdit}
                      placeholder="contact@company.co.uk"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary phone</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!canEdit}
                      placeholder="+44 7700 900000"
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={(v) => setStatus(v as Subcontractor["status"])} disabled={!canEdit}>
                      <SelectTrigger>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Contact persons</CardTitle>
                    <CardDescription>People you can contact at this subcontractor.</CardDescription>
                  </div>
                  {canEdit && (
                    <Button variant="outline" size="sm" onClick={addContactPerson}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add contact
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {contactPersons.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No contact persons added. {canEdit && "Add one above."}
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        {canEdit && <TableHead className="w-[60px]"></TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactPersons.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>
                            {canEdit ? (
                              <Input
                                value={c.name}
                                onChange={(e) => updateContactPerson(c.id, { name: e.target.value })}
                                placeholder="Name"
                                className="h-8"
                              />
                            ) : (
                              c.name || "—"
                            )}
                          </TableCell>
                          <TableCell>
                            {canEdit ? (
                              <Input
                                value={c.role}
                                onChange={(e) => updateContactPerson(c.id, { role: e.target.value })}
                                placeholder="Role"
                                className="h-8"
                              />
                            ) : (
                              c.role || "—"
                            )}
                          </TableCell>
                          <TableCell>
                            {canEdit ? (
                              <Input
                                type="email"
                                value={c.email}
                                onChange={(e) => updateContactPerson(c.id, { email: e.target.value })}
                                placeholder="Email"
                                className="h-8"
                              />
                            ) : (
                              <a href={`mailto:${c.email}`} className="text-primary hover:underline">
                                {c.email || "—"}
                              </a>
                            )}
                          </TableCell>
                          <TableCell>
                            {canEdit ? (
                              <Input
                                value={c.phone}
                                onChange={(e) => updateContactPerson(c.id, { phone: e.target.value })}
                                placeholder="Phone"
                                className="h-8 font-mono"
                              />
                            ) : (
                              c.phone || "—"
                            )}
                          </TableCell>
                          {canEdit && (
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => removeContactPerson(c.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="officers" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Officers</CardTitle>
                <CardDescription>Officers assigned to or supplied by this subcontractor.</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedOfficers.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No officers linked. In production you would assign officers to this subcontractor.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>SIA licence</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOfficers.map((o) => (
                        <TableRow key={o.id}>
                          <TableCell className="font-medium">{o.name}</TableCell>
                          <TableCell>{o.email}</TableCell>
                          <TableCell className="font-mono text-sm">{o.phone}</TableCell>
                          <TableCell className="font-mono text-xs">{o.siaLicense}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/officers/${o.id}`}>View</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {canEdit && (
                  <p className="text-xs text-muted-foreground mt-4">
                    To link officers, use the Officers page and assign subcontractor there, or add a selector here (demo: list shows officers with matching IDs from mock).
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sites" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Sites covered</CardTitle>
                <CardDescription>
                  Current sites this subcontractor provides cover for. Managed via scheduling; no add/delete here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedSites.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No current sites. Coverage is updated via scheduling or contract.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {selectedSites.map((s) => (
                      <li
                        key={s.id}
                        className="flex items-center gap-2 py-2 px-3 rounded-lg bg-muted/50"
                      >
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>{s.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Coverage history</CardTitle>
                <CardDescription>
                  Past and current site coverage. Read-only record.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {siteCoverageHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No coverage history on file.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Site</TableHead>
                        <TableHead className="w-[120px]">From</TableHead>
                        <TableHead className="w-[120px]">To</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {siteCoverageHistory.map((entry, idx) => (
                        <TableRow key={`${entry.siteId}-${entry.from}-${idx}`}>
                          <TableCell>
                            <span className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                              {entry.siteName}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{entry.from}</TableCell>
                          <TableCell className="text-muted-foreground">{entry.to ?? "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>
                      Contracts, insurance, certificates. Upload or request from the subcontractor.
                    </CardDescription>
                  </div>
                  {canEdit && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUploadFile(null);
                          setUploadDocType(SUBCONTRACTOR_DOCUMENT_TYPES[0]);
                          setUploadDialogOpen(true);
                        }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload document
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRequestDocument("Document")}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Request document
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Document options: {SUBCONTRACTOR_DOCUMENT_TYPES.join(", ")}
                </p>
                {documents.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No documents on file. Upload contracts and certificates when available.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {documents.map((d) => (
                      <li
                        key={d.id}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{d.name}</span>
                          <span className="text-muted-foreground text-sm">{d.file}</span>
                        </div>
                        <span className="text-muted-foreground text-sm">{d.date}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload document</DialogTitle>
                  <DialogDescription>
                    Choose document type and select a file. The document will be added to this subcontractor&apos;s file.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Document type</Label>
                    <Select value={uploadDocType} onValueChange={setUploadDocType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBCONTRACTOR_DOCUMENT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>File</Label>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                    />
                    {uploadFile && (
                      <p className="text-xs text-muted-foreground">{uploadFile.name}</p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUploadDocument}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="other" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Notes & other</CardTitle>
                <CardDescription>Additional notes and information.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={!canEdit}
                    placeholder="e.g. Specialisms, areas covered, contract terms"
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

