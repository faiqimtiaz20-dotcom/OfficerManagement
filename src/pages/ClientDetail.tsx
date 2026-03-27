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
  Building2,
  Users,
  MapPin,
  FileText,
  StickyNote,
  Save,
  Plus,
  Trash2,
  Upload,
  Edit,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getClientById, clientsList, type Client, type ClientContactPerson, type ClientDocument } from "@/data/clientsMock";
import { useSites } from "@/context/SitesContext";
import { AddSiteModal, type AddSiteFormData } from "@/components/sites/AddSiteModal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
];

const CLIENT_DOCUMENT_TYPES = [
  "Contract",
  "SLA",
  "Insurance certificate",
  "Site plan",
  "Other",
];

const statusConfig = {
  active: { label: "Active", className: "status-active" },
  inactive: { label: "Inactive", className: "status-inactive" },
};

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const canEdit = user?.role === "ADMIN" || user?.role === "OPS";

  const location = useLocation();
  const fromState = (location.state as { client?: Client } | null)?.client;
  const loaded = fromState ?? (id ? getClientById(id) : undefined);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [industry, setIndustry] = useState("");
  const [status, setStatus] = useState<Client["status"]>("active");
  const [companyRegNumber, setCompanyRegNumber] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [companyRegisteredAddress, setCompanyRegisteredAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [defaultBaseRate, setDefaultBaseRate] = useState<string>("");
  const [contactPersons, setContactPersons] = useState<ClientContactPerson[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [siteNames, setSiteNames] = useState<string[]>([]);
  const [addSiteModalOpen, setAddSiteModalOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadDocType, setUploadDocType] = useState(CLIENT_DOCUMENT_TYPES[0]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ClientContactPerson | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", role: "", email: "", phone: "" });
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [noteFormText, setNoteFormText] = useState("");

  useEffect(() => {
    if (!loaded) return;
    setName(loaded.name);
    setEmail(loaded.email ?? "");
    setPhone(loaded.phone ?? "");
    setAddress(loaded.address ?? "");
    setIndustry(loaded.industry);
    setStatus(loaded.status);
    setCompanyRegNumber(loaded.companyRegNumber ?? "");
    setVatNumber(loaded.vatNumber ?? "");
    setCompanyRegisteredAddress(loaded.companyRegisteredAddress ?? "");
    setWebsite(loaded.website ?? "");
    setDefaultBaseRate(loaded.defaultBaseRate != null ? String(loaded.defaultBaseRate) : "");
    setContactPersons(loaded.contactPersons ?? []);
    setDocuments(loaded.documents ?? []);
    setNotes(loaded.notes ?? []);
    setSiteNames(loaded.siteNames ?? []);
  }, [loaded]);

  const { getSitesByClientId, addSite } = useSites();
  const sitesForClient = loaded ? getSitesByClientId(loaded.id) : [];

  const handleSave = () => {
    toast.success("Client details saved.");
  };

  const handleUploadDocument = () => {
    const file = uploadFile;
    if (!file) {
      toast.error("Please select a file.");
      return;
    }
    setDocuments((prev) => [
      ...prev,
      { id: `d-${Date.now()}`, name: uploadDocType, file: file.name, date: new Date().toISOString().slice(0, 10) },
    ]);
    toast.success("Document added.");
    setUploadFile(null);
    setUploadDialogOpen(false);
  };

  const openAddContactModal = () => {
    setEditingContact(null);
    setContactForm({ name: "", role: "", email: "", phone: "" });
    setContactModalOpen(true);
  };

  const openEditContactModal = (contact: ClientContactPerson) => {
    setEditingContact(contact);
    setContactForm({
      name: contact.name,
      role: contact.role,
      email: contact.email,
      phone: contact.phone,
    });
    setContactModalOpen(true);
  };

  const closeContactModal = () => {
    setContactModalOpen(false);
    setEditingContact(null);
    setContactForm({ name: "", role: "", email: "", phone: "" });
  };

  const saveContactFromModal = () => {
    if (editingContact) {
      setContactPersons((prev) =>
        prev.map((c) => (c.id === editingContact.id ? { ...c, ...contactForm } : c))
      );
      toast.success("Contact updated.");
    } else {
      setContactPersons((prev) => [
        ...prev,
        { id: `c-${Date.now()}`, ...contactForm },
      ]);
      toast.success("Contact added.");
    }
    closeContactModal();
  };

  const removeContactPerson = (cid: string) => {
    setContactPersons((prev) => prev.filter((c) => c.id !== cid));
    closeContactModal();
  };

  const openAddNoteModal = () => {
    setEditingNoteIndex(null);
    setNoteFormText("");
    setNoteModalOpen(true);
  };

  const openEditNoteModal = (index: number) => {
    setEditingNoteIndex(index);
    setNoteFormText(notes[index] ?? "");
    setNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setNoteModalOpen(false);
    setEditingNoteIndex(null);
    setNoteFormText("");
  };

  const saveNoteFromModal = () => {
    const text = noteFormText.trim();
    if (!text) return;
    if (editingNoteIndex !== null) {
      setNotes((prev) => prev.map((n, i) => (i === editingNoteIndex ? text : n)));
      toast.success("Note updated.");
    } else {
      setNotes((prev) => [...prev, text]);
      toast.success("Note added.");
    }
    closeNoteModal();
  };

  const removeNote = (index: number) => {
    setNotes((prev) => prev.filter((_, i) => i !== index));
    closeNoteModal();
  };

  if (!id) {
    return (
      <MainLayout title="Client" subtitle="Not found">
        <p className="text-muted-foreground">No client ID provided.</p>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/clients">Back to Clients</Link>
        </Button>
      </MainLayout>
    );
  }

  if (!loaded) {
    return (
      <MainLayout title="Client" subtitle="Not found">
        <p className="text-muted-foreground">Client not found.</p>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/clients">Back to Clients</Link>
        </Button>
      </MainLayout>
    );
  }

  const statusBadge = statusConfig[status];

  return (
    <MainLayout
      title={name || "Client"}
      subtitle="Client details, contacts, documents, notes and sites"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/clients" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Clients
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
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{name || "—"}</CardTitle>
                <CardDescription>
                  {industry || "—"} · {email || "No email"}
                </CardDescription>
              </div>
              <Badge variant="outline" className={cn("status-badge ml-auto", statusBadge.className)}>
                {statusBadge.label}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="details" className="space-y-4">
          <TabsList className="flex flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="details" className="gap-1.5 text-xs">
              <Building2 className="h-3.5 w-3.5" />
              Client Details
            </TabsTrigger>
            <TabsTrigger value="contacts" className="gap-1.5 text-xs">
              <Users className="h-3.5 w-3.5" />
              Contact Persons
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-1.5 text-xs">
              <FileText className="h-3.5 w-3.5" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-1.5 text-xs">
              <StickyNote className="h-3.5 w-3.5" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="sites" className="gap-1.5 text-xs">
              <MapPin className="h-3.5 w-3.5" />
              Sites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Client details</CardTitle>
                <CardDescription>Name, contact and address.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Client name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!canEdit}
                      placeholder="Client name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Select value={industry} onValueChange={setIndustry} disabled={!canEdit}>
                      <SelectTrigger>
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
                    <Label>Status</Label>
                    <Select value={status} onValueChange={(v) => setStatus(v as Client["status"])} disabled={!canEdit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default base rate (£)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={defaultBaseRate}
                      onChange={(e) => setDefaultBaseRate(e.target.value)}
                      disabled={!canEdit}
                      placeholder="e.g. 14.50"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!canEdit}
                      placeholder="contact@client.com"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Phone</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!canEdit}
                      placeholder="+44 20 7123 4567"
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Address</Label>
                    <Textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      disabled={!canEdit}
                      placeholder="Street, city, postcode"
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Company details</CardTitle>
                <CardDescription>Registration number, VAT, registered address and website.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company registration number</Label>
                    <Input
                      value={companyRegNumber}
                      onChange={(e) => setCompanyRegNumber(e.target.value)}
                      disabled={!canEdit}
                      placeholder="e.g. 12345678 or Companies House number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>VAT number</Label>
                    <Input
                      value={vatNumber}
                      onChange={(e) => setVatNumber(e.target.value)}
                      disabled={!canEdit}
                      placeholder="e.g. GB 123 4567 89"
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Company registered address</Label>
                    <Textarea
                      value={companyRegisteredAddress}
                      onChange={(e) => setCompanyRegisteredAddress(e.target.value)}
                      disabled={!canEdit}
                      placeholder="Registered office address (e.g. at Companies House)"
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Website</Label>
                    <Input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      disabled={!canEdit}
                      placeholder="https://www.company.com"
                    />
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
                    <CardDescription>People you can contact at this client.</CardDescription>
                  </div>
                  {canEdit && (
                    <Button variant="outline" size="sm" onClick={openAddContactModal}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add contact
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {contactPersons.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No contact persons. {canEdit && "Add one above."}
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        {canEdit && <TableHead className="w-[80px]">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactPersons.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">{c.name || "—"}</TableCell>
                          <TableCell className="text-muted-foreground">{c.role || "—"}</TableCell>
                          <TableCell>
                            {c.email ? (
                              <a href={`mailto:${c.email}`} className="text-primary hover:underline text-sm">
                                {c.email}
                              </a>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm">{c.phone || "—"}</TableCell>
                          {canEdit && (
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8"
                                onClick={() => openEditContactModal(c)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
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

            <Dialog open={contactModalOpen} onOpenChange={(open) => !open && closeContactModal()}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingContact ? "Edit contact" : "Add contact"}</DialogTitle>
                  <DialogDescription>
                    {editingContact
                      ? "Update this contact person's details."
                      : "Add a new contact person for this client."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                      value={contactForm.role}
                      onChange={(e) => setContactForm((p) => ({ ...p, role: e.target.value }))}
                      placeholder="e.g. Security Lead"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="email@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={contactForm.phone}
                      onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+44 20 7123 4567"
                      className="font-mono"
                    />
                  </div>
                </div>
                <DialogFooter className="flex-row justify-between sm:justify-between gap-2">
                  <div>
                    {editingContact && (
                      <Button
                        type="button"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (window.confirm("Remove this contact?")) {
                            removeContactPerson(editingContact.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={closeContactModal}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={saveContactFromModal}>
                      {editingContact ? "Save changes" : "Add contact"}
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>Contracts, SLAs and other client documents.</CardDescription>
                  </div>
                  {canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setUploadFile(null);
                        setUploadDocType(CLIENT_DOCUMENT_TYPES[0]);
                        setUploadDialogOpen(true);
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload document
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No documents on file.
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
                    Choose document type and select a file.
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
                        {CLIENT_DOCUMENT_TYPES.map((type) => (
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
                    {uploadFile && <p className="text-xs text-muted-foreground">{uploadFile.name}</p>}
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

          <TabsContent value="notes" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Notes</CardTitle>
                    <CardDescription>Internal notes about this client.</CardDescription>
                  </div>
                  {canEdit && (
                    <Button variant="outline" size="sm" onClick={openAddNoteModal}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add note
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {notes.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No notes. {canEdit && "Add one above."}
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {notes.map((note, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 py-2 px-3 rounded-lg bg-muted/50 border border-border"
                      >
                        <StickyNote className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-sm flex-1">{note}</span>
                        {canEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 shrink-0"
                            onClick={() => openEditNoteModal(i)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Dialog open={noteModalOpen} onOpenChange={(open) => !open && closeNoteModal()}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingNoteIndex !== null ? "Edit note" : "Add note"}</DialogTitle>
                  <DialogDescription>
                    {editingNoteIndex !== null
                      ? "Update this note."
                      : "Add a new internal note for this client."}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label className="sr-only">Note</Label>
                  <Textarea
                    value={noteFormText}
                    onChange={(e) => setNoteFormText(e.target.value)}
                    placeholder="Enter note..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <DialogFooter className="flex-row justify-between sm:justify-between gap-2">
                  <div>
                    {editingNoteIndex !== null && (
                      <Button
                        type="button"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (window.confirm("Delete this note?")) {
                            removeNote(editingNoteIndex);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={closeNoteModal}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={saveNoteFromModal} disabled={!noteFormText.trim()}>
                      {editingNoteIndex !== null ? "Save changes" : "Add note"}
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="sites" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Sites</CardTitle>
                    <CardDescription>Sites linked to this client.</CardDescription>
                  </div>
                  {canEdit && (
                    <Button variant="outline" size="sm" onClick={() => setAddSiteModalOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add site
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {sitesForClient.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No sites linked. {canEdit && "Add one above."}
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Site</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Book-on email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sitesForClient.map((site) => (
                        <TableRow key={site.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <Link
                              to={`/sites/${site.id}`}
                              className="flex items-center gap-2 text-primary hover:underline"
                            >
                              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                              {site.name}
                            </Link>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{site.address}</TableCell>
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <AddSiteModal
              open={addSiteModalOpen}
              onOpenChange={setAddSiteModalOpen}
              onSuccess={(data: AddSiteFormData & { clientId?: string }) => {
                const clientId = data.clientId ?? loaded?.id ?? "";
                addSite({
                  name: data.name.trim(),
                  address: data.address.trim(),
                  clientId,
                  status: data.status,
                  currentShifts: 0,
                  bookonEmail: data.bookonEmail?.trim() || undefined,
                  contact: {
                    name: data.contactName.trim(),
                    phone: data.contactPhone.trim(),
                    email: data.contactEmail.trim(),
                  },
                });
                toast.success("Site added.");
                setAddSiteModalOpen(false);
              }}
              clients={clientsList}
              fixedClientId={loaded?.id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
