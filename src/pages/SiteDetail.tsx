import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
  MapPin,
  Building2,
  FileText,
  StickyNote,
  Save,
  Plus,
  Trash2,
  Upload,
  Edit,
  Users,
  PoundSterling,
  UserPlus,
  PhoneCall,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { useSites } from "@/context/SitesContext";
import { useDutyTypes } from "@/context/DutyTypesContext";
import { getClientById, getOfficerById, mockDb } from "@/data/mockDb";
import type { Officer } from "@/data/officersMock";
import type { SiteContactPerson, SiteDocument, SiteRateCard } from "@/data/sitesMock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SITE_DOCUMENT_TYPES = [
  "Site plan",
  "Risk assessment",
  "SOP",
  "Contract",
  "Other",
];

const officersList = mockDb.officersList as unknown as Officer[];

const statusConfig = {
  active: { label: "Active", className: "status-active" },
  inactive: { label: "Inactive", className: "status-inactive" },
};

export default function SiteDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const canEdit = user?.role === "ADMIN" || user?.role === "OPS";

  const { getSiteById, updateSite } = useSites();
  const { dutyTypes } = useDutyTypes();
  const site = id ? getSiteById(id) : undefined;
  const client = site ? getClientById(site.clientId) : undefined;
  const clientDefaultBaseRate = client?.defaultBaseRate;

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [bookonEmail, setBookonEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPersons, setContactPersons] = useState<SiteContactPerson[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [rateCard, setRateCard] = useState<SiteRateCard>({ currency: "GBP" });
  const [sop, setSop] = useState("");
  const [documents, setDocuments] = useState<SiteDocument[]>([]);
  const [preferredOfficerIds, setPreferredOfficerIds] = useState<string[]>([]);
  const [checkCallEnabled, setCheckCallEnabled] = useState(false);
  const [checkCallIntervalMinutes, setCheckCallIntervalMinutes] = useState(60);

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<SiteContactPerson | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", role: "", email: "", phone: "" });
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [noteFormText, setNoteFormText] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadDocType, setUploadDocType] = useState(SITE_DOCUMENT_TYPES[0]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [addOfficerModalOpen, setAddOfficerModalOpen] = useState(false);
  const [addOfficerId, setAddOfficerId] = useState("");

  useEffect(() => {
    if (!site) return;
    setName(site.name);
    setAddress(site.address);
    setStatus(site.status);
    setBookonEmail(site.bookonEmail ?? "");
    setContactName(site.contact.name);
    setContactPhone(site.contact.phone);
    setContactEmail(site.contact.email);
    setContactPersons(site.contactPersons ?? []);
    setNotes(site.notes ?? []);
    setRateCard(site.rateCard ?? { currency: "GBP" });
    setSop(site.sop ?? "");
    setDocuments(site.documents ?? []);
    setPreferredOfficerIds(site.preferredOfficerIds ?? []);
    setCheckCallEnabled(site.checkCallEnabled ?? false);
    setCheckCallIntervalMinutes(site.checkCallIntervalMinutes ?? 60);
  }, [site]);

  const handleSaveSiteInfo = () => {
    if (!id) return;
    updateSite(id, {
      name: name.trim(),
      address: address.trim(),
      status,
      bookonEmail: bookonEmail.trim() || undefined,
      contact: {
        name: contactName.trim(),
        phone: contactPhone.trim(),
        email: contactEmail.trim(),
      },
    });
    toast.success("Site info saved.");
  };

  const handleSaveContactPersons = () => {
    if (!id) return;
    updateSite(id, { contactPersons });
    toast.success("Contacts saved.");
  };

  const handleSaveNotes = () => {
    if (!id) return;
    updateSite(id, { notes });
    toast.success("Notes saved.");
  };

  const handleSaveRateCard = () => {
    if (!id) return;
    updateSite(id, { rateCard });
    toast.success("Rate card saved.");
  };

  const handleSaveSop = () => {
    if (!id) return;
    updateSite(id, { sop: sop.trim() || undefined });
    toast.success("SOP saved.");
  };

  const handleSaveDocuments = () => {
    if (!id) return;
    updateSite(id, { documents });
    toast.success("Documents list updated.");
  };

  const handleSavePreferredOfficers = () => {
    if (!id) return;
    updateSite(id, { preferredOfficerIds });
    toast.success("Preferred officers saved.");
  };

  const handleSaveCheckCall = () => {
    if (!id) return;
    updateSite(id, {
      checkCallEnabled: checkCallEnabled,
      checkCallIntervalMinutes: Math.max(15, Math.min(120, checkCallIntervalMinutes)),
    });
    toast.success("Check call settings saved.");
  };

  const openAddContactModal = () => {
    setEditingContact(null);
    setContactForm({ name: "", role: "", email: "", phone: "" });
    setContactModalOpen(true);
  };

  const openEditContactModal = (contact: SiteContactPerson) => {
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
        { id: `sc-${Date.now()}`, ...contactForm },
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

  const handleUploadDocument = () => {
    const file = uploadFile;
    if (!file) {
      toast.error("Please select a file.");
      return;
    }
    setDocuments((prev) => [
      ...prev,
      {
        id: `sd-${Date.now()}`,
        name: uploadDocType,
        file: file.name,
        date: new Date().toISOString().slice(0, 10),
      },
    ]);
    toast.success("Document added.");
    setUploadFile(null);
    setUploadDialogOpen(false);
  };

  const removeDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const addPreferredOfficer = () => {
    if (!addOfficerId || preferredOfficerIds.includes(addOfficerId)) return;
    setPreferredOfficerIds((prev) => [...prev, addOfficerId]);
    setAddOfficerId("");
    setAddOfficerModalOpen(false);
  };

  const removePreferredOfficer = (officerId: string) => {
    setPreferredOfficerIds((prev) => prev.filter((id) => id !== officerId));
  };

  const preferredOfficers: Officer[] = preferredOfficerIds
    .map((oid) => getOfficerById(oid))
    .filter((o): o is Officer => o != null);

  const availableOfficersToAdd = officersList.filter(
    (o) => !preferredOfficerIds.includes(o.id)
  );

  if (!id) {
    return (
      <MainLayout title="Site" subtitle="Not found">
        <p className="text-muted-foreground">No site ID provided.</p>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/sites">Back to Sites</Link>
        </Button>
      </MainLayout>
    );
  }

  if (!site) {
    return (
      <MainLayout title="Site" subtitle="Not found">
        <p className="text-muted-foreground">Site not found.</p>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/sites">Back to Sites</Link>
        </Button>
      </MainLayout>
    );
  }

  const clientName = getClientById(site.clientId)?.name ?? "—";
  const statusBadge = statusConfig[status];

  return (
    <MainLayout
      title={name || "Site"}
      subtitle={`Site details · ${clientName}`}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/sites" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Sites
            </Link>
          </Button>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{name || "—"}</CardTitle>
                <CardDescription>
                  <Building2 className="h-3.5 w-3.5 inline mr-1" />
                  {clientName} · {address || "—"}
                </CardDescription>
              </div>
              <Badge variant="outline" className={cn("status-badge ml-auto", statusBadge.className)}>
                {statusBadge.label}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="site-info" className="space-y-4">
          <TabsList className="flex flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="site-info" className="gap-1.5 text-xs">
              <MapPin className="h-3.5 w-3.5" />
              Site info
            </TabsTrigger>
            <TabsTrigger value="contact-person" className="gap-1.5 text-xs">
              <Users className="h-3.5 w-3.5" />
              Contact person
            </TabsTrigger>
            <TabsTrigger value="notes" className="gap-1.5 text-xs">
              <StickyNote className="h-3.5 w-3.5" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="rate-card" className="gap-1.5 text-xs">
              <PoundSterling className="h-3.5 w-3.5" />
              Rate card
            </TabsTrigger>
            <TabsTrigger value="sop" className="gap-1.5 text-xs">
              <FileText className="h-3.5 w-3.5" />
              SOP
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-1.5 text-xs">
              <FileText className="h-3.5 w-3.5" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="preferred-officers" className="gap-1.5 text-xs">
              <UserPlus className="h-3.5 w-3.5" />
              Preferred officers
            </TabsTrigger>
            <TabsTrigger value="check-call" className="gap-1.5 text-xs">
              <PhoneCall className="h-3.5 w-3.5" />
              Check call
            </TabsTrigger>
          </TabsList>

          <TabsContent value="site-info" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Site information</CardTitle>
                <CardDescription>Name, address, status and primary contact.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Site name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!canEdit}
                      placeholder="Site name"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Address</Label>
                    <Textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      disabled={!canEdit}
                      placeholder="Full address"
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={(v) => setStatus(v as "active" | "inactive")} disabled={!canEdit}>
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
                    <Label>Book-on email</Label>
                    <Input
                      type="email"
                      value={bookonEmail}
                      onChange={(e) => setBookonEmail(e.target.value)}
                      disabled={!canEdit}
                      placeholder="bookon@site.com"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2 pt-2 border-t">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Primary contact
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          disabled={!canEdit}
                          placeholder="Contact name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          disabled={!canEdit}
                          placeholder="+44 20 7123 4567"
                          className="font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          disabled={!canEdit}
                          placeholder="contact@site.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {canEdit && (
                  <Button className="gradient-primary" onClick={handleSaveSiteInfo}>
                    <Save className="h-4 w-4 mr-2" />
                    Save site info
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact-person" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Contact persons</CardTitle>
                    <CardDescription>Additional contacts at this site.</CardDescription>
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
                {canEdit && contactPersons.length > 0 && (
                  <Button variant="outline" size="sm" className="mt-4" onClick={handleSaveContactPersons}>
                    <Save className="h-4 w-4 mr-2" />
                    Save contacts
                  </Button>
                )}
              </CardContent>
            </Card>

            <Dialog open={contactModalOpen} onOpenChange={(open) => !open && closeContactModal()}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingContact ? "Edit contact" : "Add contact"}</DialogTitle>
                  <DialogDescription>
                    {editingContact ? "Update this contact person." : "Add a new contact for this site."}
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

          <TabsContent value="notes" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Notes</CardTitle>
                    <CardDescription>Internal notes about this site.</CardDescription>
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
                {canEdit && notes.length > 0 && (
                  <Button variant="outline" size="sm" className="mt-4" onClick={handleSaveNotes}>
                    <Save className="h-4 w-4 mr-2" />
                    Save notes
                  </Button>
                )}
              </CardContent>
            </Card>

            <Dialog open={noteModalOpen} onOpenChange={(open) => !open && closeNoteModal()}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingNoteIndex !== null ? "Edit note" : "Add note"}</DialogTitle>
                  <DialogDescription>
                    {editingNoteIndex !== null ? "Update this note." : "Add a new internal note for this site."}
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

          <TabsContent value="rate-card" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Rate card</CardTitle>
                <CardDescription>
                  Rates per duty type (e.g. per hour). Unset rates use the client&apos;s default base rate ({clientDefaultBaseRate != null ? `£${clientDefaultBaseRate.toFixed(2)}` : "not set"}). Change any rate to override for this site and save.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Rates by duty / shift type
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dutyTypes.map((duty) => {
                      const siteRate = rateCard.ratesByDutyType?.[duty.id];
                      const displayValue = siteRate != null ? siteRate : clientDefaultBaseRate ?? "";
                      return (
                        <div key={duty.id} className="space-y-2">
                          <Label>{duty.name} (£)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={displayValue}
                            onChange={(e) => {
                              const raw = e.target.value;
                              const v = raw === "" ? undefined : parseFloat(raw);
                              const num = v != null && !Number.isNaN(v) ? v : undefined;
                              setRateCard((p) => {
                                const nextRates = { ...(p.ratesByDutyType ?? {}) };
                                if (num != null) nextRates[duty.id] = num;
                                else delete nextRates[duty.id];
                                return {
                                  ...p,
                                  ratesByDutyType: Object.keys(nextRates).length ? nextRates : undefined,
                                };
                              });
                            }}
                            disabled={!canEdit}
                            placeholder={clientDefaultBaseRate != null ? String(clientDefaultBaseRate) : "0.00"}
                          />
                          {siteRate == null && clientDefaultBaseRate != null && (
                            <p className="text-xs text-muted-foreground">Using client default</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {canEdit && (
                  <Button className="gradient-primary" onClick={handleSaveRateCard}>
                    <Save className="h-4 w-4 mr-2" />
                    Save rate card
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sop" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>SOP &amp; instructions</CardTitle>
                <CardDescription>Standard operating procedures for this site.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={sop}
                  onChange={(e) => setSop(e.target.value)}
                  disabled={!canEdit}
                  placeholder="Enter SOP and instructions..."
                  rows={12}
                  className="font-mono text-sm resize-none"
                />
                {canEdit && (
                  <Button className="gradient-primary" onClick={handleSaveSop}>
                    <Save className="h-4 w-4 mr-2" />
                    Save SOP
                  </Button>
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
                    <CardDescription>Site plans, risk assessments and other documents.</CardDescription>
                  </div>
                  {canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setUploadFile(null);
                        setUploadDocType(SITE_DOCUMENT_TYPES[0]);
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
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-sm">{d.date}</span>
                          {canEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-destructive"
                              onClick={() => removeDocument(d.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {canEdit && documents.length > 0 && (
                  <Button variant="outline" size="sm" className="mt-4" onClick={handleSaveDocuments}>
                    <Save className="h-4 w-4 mr-2" />
                    Save documents
                  </Button>
                )}
              </CardContent>
            </Card>

            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload document</DialogTitle>
                  <DialogDescription>Choose document type and select a file.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Document type</Label>
                    <Select value={uploadDocType} onValueChange={setUploadDocType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SITE_DOCUMENT_TYPES.map((type) => (
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

          <TabsContent value="preferred-officers" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Preferred officers</CardTitle>
                    <CardDescription>Officers preferred for shifts at this site.</CardDescription>
                  </div>
                  {canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddOfficerModalOpen(true)}
                      disabled={availableOfficersToAdd.length === 0}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add officer
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {preferredOfficers.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-6 text-center">
                    No preferred officers. {canEdit && "Add one above."}
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Phone</TableHead>
                        {canEdit && <TableHead className="w-[80px]">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preferredOfficers.map((o) => (
                        <TableRow key={o.id}>
                          <TableCell className="font-medium">
                            <Link to={`/officers/${o.id}`} className="text-primary hover:underline">
                              {o.name}
                            </Link>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{o.position || "—"}</TableCell>
                          <TableCell className="font-mono text-sm">{o.phone || "—"}</TableCell>
                          {canEdit && (
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-destructive"
                                onClick={() => removePreferredOfficer(o.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {canEdit && preferredOfficers.length > 0 && (
                  <Button variant="outline" size="sm" className="mt-4" onClick={handleSavePreferredOfficers}>
                    <Save className="h-4 w-4 mr-2" />
                    Save preferred officers
                  </Button>
                )}
              </CardContent>
            </Card>

            <Dialog open={addOfficerModalOpen} onOpenChange={setAddOfficerModalOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add preferred officer</DialogTitle>
                  <DialogDescription>Select an officer to add to this site&apos;s preferred list.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label>Officer</Label>
                  <Select value={addOfficerId} onValueChange={setAddOfficerId}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select officer" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableOfficersToAdd.map((o) => (
                        <SelectItem key={o.id} value={o.id}>
                          {o.name} {o.position ? `· ${o.position}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddOfficerModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addPreferredOfficer} disabled={!addOfficerId}>
                    Add officer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="check-call" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4" />
                  Check call (shift monitoring)
                </CardTitle>
                <CardDescription>
                  Require officers to complete check calls during shifts. Precheck (90 min before) and book-on (15 min before – 30 min after start) are always created per shift; enable check calls to add recurring call windows during the shift.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label className="text-base">Enable check calls</Label>
                    <p className="text-sm text-muted-foreground">Officers must complete a check call at each interval during the shift.</p>
                  </div>
                  <Switch
                    checked={checkCallEnabled}
                    onCheckedChange={setCheckCallEnabled}
                    disabled={!canEdit}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Check call interval (minutes)</Label>
                  <Input
                    type="number"
                    min={15}
                    max={120}
                    value={checkCallIntervalMinutes}
                    onChange={(e) => setCheckCallIntervalMinutes(parseInt(e.target.value, 10) || 60)}
                    disabled={!canEdit}
                    className="w-32"
                  />
                  <p className="text-sm text-muted-foreground">How often officers must check in during the shift (e.g. 60 = every hour). Only used when check calls are enabled.</p>
                </div>
                {canEdit && (
                  <Button className="gradient-primary" onClick={handleSaveCheckCall}>
                    <Save className="h-4 w-4 mr-2" />
                    Save check call settings
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
