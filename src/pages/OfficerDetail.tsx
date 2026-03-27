import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Shield,
  CreditCard,
  FileText,
  CheckCircle,
  Clock,
  Save,
  Stethoscope,
  ClipboardCheck,
  Landmark,
  Send,
  Upload,
  GraduationCap,
  Phone,
  FileCheck,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { hasTenantFullAccess } from "@/lib/tenantPermissions";
import { useAuth } from "@/context/AuthContext";
import { useOfficerTypes } from "@/context/OfficerTypesContext";
import {
  getOfficerById,
  type Officer,
  type BS7858Step,
  type EmploymentReference,
  type VettingLogEntry,
  type BankDetails,
} from "@/data/officersMock";
import { getOfficerDetailExtras, mockDb } from "@/data/mockDb";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmploymentReferenceSection } from "@/components/officers/EmploymentReferenceSection";

const defaultBS7858Steps: BS7858Step[] = (getOfficerDetailExtras("1").bs7858Steps as BS7858Step[]) ?? [];

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

const defaultEmploymentRefs: EmploymentReference[] =
  (getOfficerDetailExtras("1").employmentRefs as EmploymentReference[]) ?? [];

const defaultVettingLog: VettingLogEntry[] =
  (getOfficerDetailExtras("1").vettingLog as VettingLogEntry[]) ?? [];

const healthFields: { key: string; label: string }[] =
  (((mockDb.officerDetailDefaults.healthFields as unknown as { key: string; label: string }[]) ?? []).map((f) => ({ ...f })));

const appearanceFields: { key: string; label: string }[] =
  (((mockDb.officerDetailDefaults.appearanceFields as unknown as { key: string; label: string }[]) ?? []).map((f) => ({ ...f })));

export default function OfficerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { officerTypes, getById: getOfficerTypeById } = useOfficerTypes();
  const canEdit = hasTenantFullAccess(user?.role) || user?.role === "HR";

  const officerFromList = id ? getOfficerById(id) : undefined;
  const officerExtras = getOfficerDetailExtras(id ?? "1");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [officerTypeId, setOfficerTypeId] = useState("");
  const [status, setStatus] = useState<Officer["status"]>("active");
  const [complianceStatus, setComplianceStatus] = useState<Officer["complianceStatus"]>("pending");
  const [siaLicense, setSiaLicense] = useState("");
  const [siaExpiry, setSiaExpiry] = useState("");
  const [bs7858Steps, setBs7858Steps] = useState<BS7858Step[]>(defaultBS7858Steps);
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [employmentRefs, setEmploymentRefs] = useState<EmploymentReference[]>(defaultEmploymentRefs);
  const [vettingLog, setVettingLog] = useState<VettingLogEntry[]>(defaultVettingLog);
  const [bankDetails, setBankDetails] = useState<BankDetails>(
    (officerExtras.bankDetails as BankDetails) ?? { accountName: "", sortCode: "", accountNumber: "" }
  );
  const [healthInfo, setHealthInfo] = useState<Record<string, string>>(
    ((officerExtras.healthInfo as Record<string, string>) ?? {})
  );
  const [appearanceInfo, setAppearanceInfo] = useState<Record<string, string>>(
    ((officerExtras.appearanceInfo as Record<string, string>) ?? {})
  );
  const [screeningPeriodYears, setScreeningPeriodYears] = useState<5 | 10>(
    ((officerExtras.screeningPeriodYears as 5 | 10) ?? 5)
  );
  const [niNumber, setNiNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [passportNumber, setPassportNumber] = useState((officerExtras.passportNumber as string) ?? "");
  const [passportCountry, setPassportCountry] = useState((officerExtras.passportCountry as string) ?? "");
  const [passportIssueDate, setPassportIssueDate] = useState((officerExtras.passportIssueDate as string) ?? "");
  const [passportExpiryDate, setPassportExpiryDate] = useState((officerExtras.passportExpiryDate as string) ?? "");
  const [visaType, setVisaType] = useState((officerExtras.visaType as string) ?? "");
  const [visaNumber, setVisaNumber] = useState((officerExtras.visaNumber as string) ?? "");
  const [visaExpiryDate, setVisaExpiryDate] = useState((officerExtras.visaExpiryDate as string) ?? "");
  const [rightToWorkUk, setRightToWorkUk] = useState((officerExtras.rightToWorkUk as string) ?? "");
  const [rightToWorkShareCode, setRightToWorkShareCode] = useState((officerExtras.rightToWorkShareCode as string) ?? "");
  const [shareCodeExpiry, setShareCodeExpiry] = useState((officerExtras.shareCodeExpiry as string) ?? "");
  const [documents, setDocuments] = useState<{ id: string; name: string; file: string; date: string }[]>(
    ((officerExtras.documents as { id: string; name: string; file: string; date: string }[]) ?? []).map((d) => ({ ...d }))
  );
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadDocType, setUploadDocType] = useState("Proof of identity");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [educationHistory, setEducationHistory] = useState<{ id: string; institution: string; qualification: string; from: string; to: string }[]>(
    ((officerExtras.educationHistory as { id: string; institution: string; qualification: string; from: string; to: string }[]) ?? []).map((e) => ({ ...e }))
  );
  const [emergencyContacts, setEmergencyContacts] = useState<{ id: string; name: string; relationship: string; phone: string }[]>(
    ((officerExtras.emergencyContacts as { id: string; name: string; relationship: string; phone: string }[]) ?? []).map((c) => ({ ...c }))
  );
  const [siaLicenceType, setSiaLicenceType] = useState((officerExtras.siaLicenceType as string) ?? "");
  const [trainingCertifications, setTrainingCertifications] = useState<
    { id: string; name: string; expiryDate: string }[]
  >(
    ((officerExtras.trainingCertifications as { id: string; name: string; expiryDate: string }[]) ?? []).map((t) => ({ ...t }))
  );

  const officerTypeName = officerTypeId ? getOfficerTypeById(officerTypeId)?.name : null;

  const DOCUMENT_TYPES = (officerExtras.documentTypes as string[]) ?? [
    "Proof of identity",
    "Proof of address",
    "Right to work",
    "DBS certificate",
    "Other",
  ];

  useEffect(() => {
    if (!officerFromList) return;
    setName(officerFromList.name);
    setEmail(officerFromList.email);
    setPhone(officerFromList.phone);
    setOfficerTypeId(officerFromList.officerTypeId ?? "");
    setStatus(officerFromList.status);
    setComplianceStatus(officerFromList.complianceStatus);
    setSiaLicense(officerFromList.siaLicense);
    setSiaExpiry(officerFromList.siaExpiry);
    setAvatar(officerFromList.avatar);
    setDateOfBirth(officerFromList.dateOfBirth ?? "");
    setAddress(officerFromList.address ?? "");
    setNiNumber(officerFromList.niNumber ?? "");

    const extras = getOfficerDetailExtras(officerFromList.id);
    setBs7858Steps(((extras.bs7858Steps as BS7858Step[]) ?? []).map((s) => ({ ...s })));
    setEmploymentRefs(((extras.employmentRefs as EmploymentReference[]) ?? []).map((r) => ({ ...r })));
    setVettingLog(((extras.vettingLog as VettingLogEntry[]) ?? []).map((v) => ({ ...v })));
    setBankDetails((extras.bankDetails as BankDetails) ?? { accountName: "", sortCode: "", accountNumber: "" });
    setHealthInfo({ ...((extras.healthInfo as Record<string, string>) ?? {}) });
    setAppearanceInfo({ ...((extras.appearanceInfo as Record<string, string>) ?? {}) });
    setScreeningPeriodYears((extras.screeningPeriodYears as 5 | 10) ?? 5);
    setPassportNumber((extras.passportNumber as string) ?? "");
    setPassportCountry((extras.passportCountry as string) ?? "");
    setPassportIssueDate((extras.passportIssueDate as string) ?? "");
    setPassportExpiryDate((extras.passportExpiryDate as string) ?? "");
    setVisaType((extras.visaType as string) ?? "");
    setVisaNumber((extras.visaNumber as string) ?? "");
    setVisaExpiryDate((extras.visaExpiryDate as string) ?? "");
    setRightToWorkUk((extras.rightToWorkUk as string) ?? "");
    setRightToWorkShareCode((extras.rightToWorkShareCode as string) ?? "");
    setShareCodeExpiry((extras.shareCodeExpiry as string) ?? "");
    setDocuments(((extras.documents as { id: string; name: string; file: string; date: string }[]) ?? []).map((d) => ({ ...d })));
    setEducationHistory(((extras.educationHistory as { id: string; institution: string; qualification: string; from: string; to: string }[]) ?? []).map((e) => ({ ...e })));
    setEmergencyContacts(((extras.emergencyContacts as { id: string; name: string; relationship: string; phone: string }[]) ?? []).map((c) => ({ ...c })));
    setSiaLicenceType((extras.siaLicenceType as string) ?? "");
    setTrainingCertifications(((extras.trainingCertifications as { id: string; name: string; expiryDate: string }[]) ?? []).map((t) => ({ ...t })));
  }, [officerFromList]);

  const toggleBS7858Step = (stepId: string) => {
    setBs7858Steps((prev) =>
      prev.map((s) =>
        s.id === stepId
          ? { ...s, done: !s.done, completedDate: !s.done ? new Date().toISOString().slice(0, 10) : undefined }
          : s
      )
    );
  };

  const handleSave = () => {
    toast.success("Officer details saved. In production this would persist to the backend.");
  };

  const handleRequestDocument = (docType: string) => {
    toast.success(`Request sent to officer for: ${docType}`);
    setVettingLog((prev) => [
      {
        id: String(Date.now()),
        date: new Date().toISOString().slice(0, 10),
        action: `Document requested: ${docType}`,
        outcome: "Pending",
        by: user?.name ?? "You",
      },
      ...prev,
    ]);
  };

  const handleUploadDocument = () => {
    if (!uploadFile) {
      toast.error("Please select a file.");
      return;
    }
    const date = new Date().toISOString().slice(0, 10);
    setDocuments((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: uploadDocType,
        file: uploadFile.name,
        date,
      },
    ]);
    setVettingLog((prev) => [
      {
        id: String(Date.now()),
        date,
        action: `Document uploaded: ${uploadDocType}`,
        outcome: uploadFile.name,
        by: user?.name ?? "You",
      },
      ...prev,
    ]);
    toast.success(`Document "${uploadFile.name}" uploaded.`);
    setUploadFile(null);
    setUploadDialogOpen(false);
  };

  const handleRequestBankDetails = () => {
    toast.success("Bank details request sent to officer.");
    setVettingLog((prev) => [
      {
        id: String(Date.now()),
        date: new Date().toISOString().slice(0, 10),
        action: "Bank details requested",
        outcome: "Pending",
        by: user?.name ?? "You",
      },
      ...prev,
    ]);
  };

  const handleSendReferenceEmail = (ref: EmploymentReference) => {
    toast.success(`Email will be sent to ${ref.email}`);
    setVettingLog((prev) => [
      {
        id: String(Date.now()),
        date: new Date().toISOString().slice(0, 10),
        action: `Reference email sent: ${ref.company}`,
        outcome: "Sent",
        by: user?.name ?? "You",
      },
      ...prev,
    ]);
  };

  const handleCallReference = (ref: EmploymentReference) => {
    toast.success(`In production this would dial ${ref.phone}`);
    setVettingLog((prev) => [
      {
        id: String(Date.now()),
        date: new Date().toISOString().slice(0, 10),
        action: `Telephone screening: ${ref.company}`,
        outcome: "Logged",
        by: user?.name ?? "You",
      },
      ...prev,
    ]);
  };

  const handleAddEmploymentReference = () => {
    setEmploymentRefs((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        requestedDate: new Date().toISOString().slice(0, 10),
        noOfRequests: 0,
        company: "",
        phone: "",
        email: "",
        from: "",
        to: "",
        confirmedDatesFrom: "",
        confirmedDatesTo: "",
        comments: "",
        status: "pending",
      },
    ]);
    toast.success("New employment reference added. Fill in details and use Email/Call to log screening.");
  };

  const renderEmptyOrValue = (value: string) =>
    value ? (
      <span className="text-foreground">{value}</span>
    ) : (
      <span className="text-destructive font-medium">EMPTY</span>
    );

  if (!id || !officerFromList) {
    return (
      <MainLayout title="Officer not found" subtitle="">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-4">No officer found with this ID.</p>
            <Button asChild variant="outline">
              <Link to="/officers">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Officers
              </Link>
            </Button>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }

  const statusBadge = statusConfig[status];
  const complianceBadge = complianceConfig[complianceStatus];

  return (
    <MainLayout
      title={name || "Officer detail"}
      subtitle="View and edit officer profile · BS7858 compliance"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/officers")} asChild>
            <Link to="/officers" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Officers
            </Link>
          </Button>
          {canEdit && (
            <Button className="gradient-primary" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save changes
            </Button>
          )}
        </div>

        {/* Profile card */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={cn("status-badge", statusBadge.className)}>
                    {statusBadge.label}
                  </Badge>
                  <Badge variant="outline" className={cn("status-badge", complianceBadge.className)}>
                    {complianceBadge.label}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList className="flex flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="summary" className="gap-1.5 text-xs">
              <User className="h-3.5 w-3.5" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="sia" className="gap-1.5 text-xs">
              <CreditCard className="h-3.5 w-3.5" />
              SIA & Training
            </TabsTrigger>
            <TabsTrigger value="education-emergency" className="gap-1.5 text-xs">
              <GraduationCap className="h-3.5 w-3.5" />
              Education & Emergency
            </TabsTrigger>
            <TabsTrigger value="health" className="gap-1.5 text-xs">
              <Stethoscope className="h-3.5 w-3.5" />
              Health
            </TabsTrigger>
            <TabsTrigger value="vetting" className="gap-1.5 text-xs">
              <ClipboardCheck className="h-3.5 w-3.5" />
              Vetting
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-1.5 text-xs">
              <FileText className="h-3.5 w-3.5" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="compliance" className="gap-1.5 text-xs">
              <Shield className="h-3.5 w-3.5" />
              BS7858
            </TabsTrigger>
            
            
            
            
           
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Personal details</CardTitle>
                <CardDescription>Contact and employment status. Fields required for BS7858 screening.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type of officer</Label>
                    {canEdit ? (
                      <Select
                        value={officerTypeId || "none"}
                        onValueChange={(v) => setOfficerTypeId(v === "none" ? "" : v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">—</SelectItem>
                          {officerTypes.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={officerTypeName ?? "—"} readOnly className="bg-muted/50" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Full name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!canEdit}
                      placeholder="Officer name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!canEdit}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!canEdit}
                      placeholder="+44 7700 900000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of birth</Label>
                    <Input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      disabled={!canEdit}
                      placeholder="BS7858 identity"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Address</Label>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      disabled={!canEdit}
                      placeholder="Current address (for BS7858 address verification)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>National Insurance number</Label>
                    <Input
                      value={niNumber}
                      onChange={(e) => setNiNumber(e.target.value)}
                      disabled={!canEdit}
                      placeholder="e.g. AB 12 34 56 C"
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>BS7858 screening period</Label>
                    <Select
                      value={String(screeningPeriodYears)}
                      onValueChange={(v) => setScreeningPeriodYears(v === "10" ? 10 : 5)}
                      disabled={!canEdit}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 years (e.g. BS 7499 guarding)</SelectItem>
                        <SelectItem value="10">10 years (e.g. BS 7872 cash in transit)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Employment status</Label>
                    <Select
                      value={status}
                      onValueChange={(v) => setStatus(v as Officer["status"])}
                      disabled={!canEdit}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>BS7858 compliance status</Label>
                    <Select
                      value={complianceStatus}
                      onValueChange={(v) => setComplianceStatus(v as Officer["complianceStatus"])}
                      disabled={!canEdit}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compliant">Compliant</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passport & visa details */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  Passport & visa details
                </CardTitle>
                <CardDescription>Identity and right to work. Required for BS7858 verification.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Passport</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Passport number</Label>
                      <Input
                        value={passportNumber}
                        onChange={(e) => setPassportNumber(e.target.value)}
                        disabled={!canEdit}
                        placeholder="e.g. 123456789"
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Country of issue</Label>
                      <Input
                        value={passportCountry}
                        onChange={(e) => setPassportCountry(e.target.value)}
                        disabled={!canEdit}
                        placeholder="e.g. United Kingdom"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Issue date</Label>
                      <Input
                        type="date"
                        value={passportIssueDate}
                        onChange={(e) => setPassportIssueDate(e.target.value)}
                        disabled={!canEdit}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Expiry date</Label>
                      <Input
                        type="date"
                        value={passportExpiryDate}
                        onChange={(e) => setPassportExpiryDate(e.target.value)}
                        disabled={!canEdit}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Visa & right to work</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Visa / immigration status</Label>
                      <Select value={visaType || "none"} onValueChange={(v) => setVisaType(v === "none" ? "" : v)} disabled={!canEdit}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">—</SelectItem>
                          <SelectItem value="british_citizen">British citizen</SelectItem>
                          <SelectItem value="settled">Settled status / ILR</SelectItem>
                          <SelectItem value="pre_settled">Pre-settled status</SelectItem>
                          <SelectItem value="work_visa">Work visa</SelectItem>
                          <SelectItem value="eu_settlement">EU Settlement Scheme</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Visa / BRP number</Label>
                      <Input
                        value={visaNumber}
                        onChange={(e) => setVisaNumber(e.target.value)}
                        disabled={!canEdit}
                        placeholder="If applicable"
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Visa expiry date</Label>
                      <Input
                        type="date"
                        value={visaExpiryDate}
                        onChange={(e) => setVisaExpiryDate(e.target.value)}
                        disabled={!canEdit}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Right to work in UK</Label>
                      <Select value={rightToWorkUk || "none"} onValueChange={(v) => setRightToWorkUk(v === "none" ? "" : v)} disabled={!canEdit}>
                        <SelectTrigger>
                          <SelectValue placeholder="Confirm status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">—</SelectItem>
                          <SelectItem value="yes">Yes – verified</SelectItem>
                          <SelectItem value="pending">Pending verification</SelectItem>
                          <SelectItem value="no">No / expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Right to work share code</Label>
                      <Input
                        value={rightToWorkShareCode}
                        onChange={(e) => setRightToWorkShareCode(e.target.value)}
                        disabled={!canEdit}
                        placeholder="e.g. ABC1DE2F3 (from GOV.UK check)"
                        className="font-mono"
                      />
                      <p className="text-xs text-muted-foreground">Share code from the officer’s GOV.UK right to work online check.</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Share code expiry</Label>
                      <Input
                        type="date"
                        value={shareCodeExpiry}
                        onChange={(e) => setShareCodeExpiry(e.target.value)}
                        disabled={!canEdit}
                      />
                      <p className="text-xs text-muted-foreground">Date the share code expires (GOV.UK codes are valid for a limited period).</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bank details */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Landmark className="h-4 w-4" />
                      Bank details
                    </CardTitle>
                    <CardDescription>For payroll. Request from officer if not provided.</CardDescription>
                  </div>
                  {canEdit && !bankDetails.accountNumber && (
                    <Button variant="outline" size="sm" onClick={handleRequestBankDetails}>
                      <Send className="h-4 w-4 mr-2" />
                      Request bank details
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Account name</Label>
                    <Input
                      value={bankDetails.accountName}
                      onChange={(e) => setBankDetails((p) => ({ ...p, accountName: e.target.value }))}
                      disabled={!canEdit}
                      placeholder="Name on account"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sort code</Label>
                    <Input
                      value={bankDetails.sortCode}
                      onChange={(e) => setBankDetails((p) => ({ ...p, sortCode: e.target.value }))}
                      disabled={!canEdit}
                      placeholder="00-00-00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account number</Label>
                    <Input
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails((p) => ({ ...p, accountNumber: e.target.value }))}
                      disabled={!canEdit}
                      placeholder="8 digits"
                    />
                  </div>
                </div>
                {!bankDetails.accountNumber && (
                  <p className="text-sm text-muted-foreground">
                    Bank details not provided. Use &quot;Request bank details&quot; to send a secure request to the officer.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>BS7858 screening checklist</CardTitle>
                <CardDescription>
                  Vetting requirements per British Standard BS7858 (security screening). Complete in order: initial checks then full screening.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Initial checks (before limited screening)
                  </h4>
                  <ul className="space-y-2">
                    {bs7858Steps.filter((s) => s.phase === "initial").map((item) => (
                      <li
                        key={item.id}
                        className={cn(
                          "flex items-center gap-3 py-2 px-3 rounded-md border border-border/50",
                          item.done ? "text-foreground bg-muted/20" : "text-muted-foreground"
                        )}
                      >
                        {canEdit ? (
                          <Checkbox id={item.id} checked={item.done} onCheckedChange={() => toggleBS7858Step(item.id)} />
                        ) : item.done ? (
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        ) : (
                          <Clock className="h-4 w-4 flex-shrink-0" />
                        )}
                        <label htmlFor={item.id} className="flex-1 text-sm cursor-pointer">
                          {item.label}
                        </label>
                        {item.completedDate && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(item.completedDate).toLocaleDateString("en-GB")}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Full screening
                  </h4>
                  <ul className="space-y-2">
                    {bs7858Steps.filter((s) => s.phase === "full_screening").map((item) => (
                      <li
                        key={item.id}
                        className={cn(
                          "flex items-center gap-3 py-2 px-3 rounded-md border border-border/50",
                          item.done ? "text-foreground bg-muted/20" : "text-muted-foreground"
                        )}
                      >
                        {canEdit ? (
                          <Checkbox id={item.id} checked={item.done} onCheckedChange={() => toggleBS7858Step(item.id)} />
                        ) : item.done ? (
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        ) : (
                          <Clock className="h-4 w-4 flex-shrink-0" />
                        )}
                        <label htmlFor={item.id} className="flex-1 text-sm cursor-pointer">
                          {item.label}
                        </label>
                        {item.completedDate && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(item.completedDate).toLocaleDateString("en-GB")}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vetting" className="space-y-4">
            <EmploymentReferenceSection
              references={employmentRefs}
              onReferencesChange={setEmploymentRefs}
              canEdit={!!canEdit}
              onSendEmail={handleSendReferenceEmail}
              onCall={handleCallReference}
              onAddReference={handleAddEmploymentReference}
            />

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Vetting log</CardTitle>
                <CardDescription>
                  BS7858 audit trail: chronological log of all vetting and background check activity. Retain for compliance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[100px]">Date</TableHead>
                      <TableHead>Check / action</TableHead>
                      <TableHead className="w-[120px]">Outcome</TableHead>
                      <TableHead className="w-[120px]">Completed by</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vettingLog.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="text-sm whitespace-nowrap">{entry.date}</TableCell>
                        <TableCell>{entry.action}</TableCell>
                        <TableCell>{entry.outcome}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{entry.by}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Health information</CardTitle>
                  <CardDescription>Medical and fitness information for BS7858 and duty suitability.</CardDescription>
                </CardHeader>
                <CardContent>
                  {canEdit ? (
                    <div className="grid grid-cols-1 gap-3">
                      {healthFields.map(({ key, label }) => (
                        <div key={key} className="space-y-1">
                          <Label className="text-xs text-muted-foreground">{label}</Label>
                          <Input
                            value={healthInfo[key] ?? ""}
                            onChange={(e) => setHealthInfo((p) => ({ ...p, [key]: e.target.value }))}
                            placeholder="Enter or leave empty"
                            className="h-8"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {healthFields.map(({ key, label }) => (
                        <li key={key} className="flex justify-between items-center py-2 border-b border-border last:border-0 text-sm">
                          <span className="text-muted-foreground">{label}</span>
                          {renderEmptyOrValue(healthInfo[key] ?? "")}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>User appearance</CardTitle>
                  <CardDescription>Uniform allocation and identification.</CardDescription>
                </CardHeader>
                <CardContent>
                  {canEdit ? (
                    <div className="grid grid-cols-1 gap-3">
                      {appearanceFields.map(({ key, label }) => (
                        <div key={key} className="space-y-1">
                          <Label className="text-xs text-muted-foreground">{label}</Label>
                          <Input
                            value={appearanceInfo[key] ?? ""}
                            onChange={(e) => setAppearanceInfo((p) => ({ ...p, [key]: e.target.value }))}
                            placeholder="Enter or leave empty"
                            className="h-8"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {appearanceFields.map(({ key, label }) => (
                        <li key={key} className="flex justify-between items-center py-2 border-b border-border last:border-0 text-sm">
                          <span className="text-muted-foreground">{label}</span>
                          {renderEmptyOrValue(appearanceInfo[key] ?? "")}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sia" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>SIA licence & training</CardTitle>
                <CardDescription>
                  SIA licence validation is a BS7858 initial check. Record licence type, number, expiry and training certifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    SIA licence
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Licence type</Label>
                      <Select value={siaLicenceType || "none"} onValueChange={(v) => setSiaLicenceType(v === "none" ? "" : v)} disabled={!canEdit}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">—</SelectItem>
                          <SelectItem value="front_line">Front Line (DS)</SelectItem>
                          <SelectItem value="cctv">CCTV (PSS)</SelectItem>
                          <SelectItem value="cctv_nvq">CCTV (NVQ)</SelectItem>
                          <SelectItem value="key_holding">Key Holding</SelectItem>
                          <SelectItem value="close_protection">Close Protection</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>SIA licence number</Label>
                      <Input
                        value={siaLicense}
                        onChange={(e) => setSiaLicense(e.target.value)}
                        disabled={!canEdit}
                        placeholder="16-digit licence"
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SIA expiry date</Label>
                      <Input
                        type="date"
                        value={siaExpiry}
                        onChange={(e) => setSiaExpiry(e.target.value)}
                        disabled={!canEdit}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                    Training & certifications
                  </p>
                  <div className="space-y-3">
                    {trainingCertifications.map((cert) => {
                      const expiry = cert.expiryDate ? new Date(cert.expiryDate) : null;
                      const isExpired = expiry ? expiry < new Date() : false;
                      return (
                        <div
                          key={cert.id}
                          className={cn(
                            "flex flex-wrap items-center gap-3 py-3 px-4 rounded-lg border border-border/50",
                            isExpired ? "bg-destructive/5 border-destructive/30" : "bg-muted/20"
                          )}
                        >
                          {canEdit ? (
                            <>
                              <Input
                                placeholder="Certification name"
                                value={cert.name}
                                onChange={(e) =>
                                  setTrainingCertifications((prev) =>
                                    prev.map((x) => (x.id === cert.id ? { ...x, name: e.target.value } : x))
                                  )
                                }
                                className="flex-1 min-w-[180px]"
                              />
                              <Input
                                type="date"
                                value={cert.expiryDate}
                                onChange={(e) =>
                                  setTrainingCertifications((prev) =>
                                    prev.map((x) => (x.id === cert.id ? { ...x, expiryDate: e.target.value } : x))
                                  )
                                }
                                className="w-[140px]"
                              />
                              <Badge variant={isExpired ? "destructive" : "secondary"} className="shrink-0">
                                {isExpired ? "Expired" : "Valid"}
                              </Badge>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="shrink-0 text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                  setTrainingCertifications((prev) => prev.filter((x) => x.id !== cert.id))
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <span className="font-medium flex-1 min-w-[180px]">{cert.name || "—"}</span>
                              <span className="text-muted-foreground text-sm">
                                {cert.expiryDate ? `Expires ${cert.expiryDate}` : "—"}
                              </span>
                              <Badge variant={isExpired ? "destructive" : "secondary"}>
                                {isExpired ? "Expired" : "Valid"}
                              </Badge>
                            </>
                          )}
                        </div>
                      );
                    })}
                    {canEdit && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                        onClick={() =>
                          setTrainingCertifications((prev) => [
                            ...prev,
                            { id: String(Date.now()), name: "", expiryDate: "" },
                          ])
                        }
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add certification
                      </Button>
                    )}
                  </div>
                </div>
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
                      BS7858 required documents: proof of identity, address, right to work, DBS. Upload or request from the officer.
                    </CardDescription>
                  </div>
                  {canEdit && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUploadFile(null);
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
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Document options
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {DOCUMENT_TYPES.join(", ")}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    BS7858 required documents
                  </p>
                  <ul className="space-y-2">
                    {documents.map((doc) => (
                      <li
                        key={doc.id}
                        className="flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-muted/50"
                      >
                        <div>
                          <span className="font-medium block">{doc.name}</span>
                          <span className="text-muted-foreground text-xs">{doc.file}</span>
                        </div>
                        <span className="text-muted-foreground text-xs">{doc.date}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload document</DialogTitle>
                  <DialogDescription>
                    Choose document type and select a file. The document will be added to this officer&apos;s file.
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
                        {DOCUMENT_TYPES.map((type) => (
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

          <TabsContent value="education-emergency" className="space-y-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Education history
                </CardTitle>
                <CardDescription>Qualifications and training history.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {educationHistory.map((edu) => (
                    <div
                      key={edu.id}
                      className="py-3 px-4 rounded-lg border border-border/50 bg-muted/20 space-y-2"
                    >
                      {canEdit ? (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Input
                              placeholder="Institution"
                              value={edu.institution}
                              onChange={(e) =>
                                setEducationHistory((prev) =>
                                  prev.map((x) => (x.id === edu.id ? { ...x, institution: e.target.value } : x))
                                )
                              }
                            />
                            <Input
                              placeholder="Qualification"
                              value={edu.qualification}
                              onChange={(e) =>
                                setEducationHistory((prev) =>
                                  prev.map((x) => (x.id === edu.id ? { ...x, qualification: e.target.value } : x))
                                )
                              }
                            />
                            <Input
                              placeholder="From (year)"
                              value={edu.from}
                              onChange={(e) =>
                                setEducationHistory((prev) =>
                                  prev.map((x) => (x.id === edu.id ? { ...x, from: e.target.value } : x))
                                )
                              }
                            />
                            <Input
                              placeholder="To (year)"
                              value={edu.to}
                              onChange={(e) =>
                                setEducationHistory((prev) =>
                                  prev.map((x) => (x.id === edu.id ? { ...x, to: e.target.value } : x))
                                )
                              }
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setEducationHistory((prev) => prev.filter((e) => e.id !== edu.id))}
                          >
                            Remove
                          </Button>
                        </>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="font-medium text-sm">{edu.institution || "—"}</p>
                            <p className="text-xs text-muted-foreground">{edu.qualification || "—"}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {edu.from || "—"} – {edu.to || "—"}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEducationHistory((prev) => [
                          ...prev,
                          { id: String(Date.now()), institution: "", qualification: "", from: "", to: "" },
                        ])
                      }
                    >
                      Add education
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Emergency contacts
                </CardTitle>
                <CardDescription>People to contact in case of emergency.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emergencyContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="py-3 px-4 rounded-lg border border-border/50 bg-muted/20 space-y-2"
                    >
                      {canEdit ? (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <Input
                              placeholder="Full name"
                              value={contact.name}
                              onChange={(e) =>
                                setEmergencyContacts((prev) =>
                                  prev.map((c) => (c.id === contact.id ? { ...c, name: e.target.value } : c))
                                )
                              }
                            />
                            <Input
                              placeholder="Relationship (e.g. Spouse, Parent)"
                              value={contact.relationship}
                              onChange={(e) =>
                                setEmergencyContacts((prev) =>
                                  prev.map((c) => (c.id === contact.id ? { ...c, relationship: e.target.value } : c))
                                )
                              }
                            />
                            <Input
                              placeholder="Phone"
                              value={contact.phone}
                              onChange={(e) =>
                                setEmergencyContacts((prev) =>
                                  prev.map((c) => (c.id === contact.id ? { ...c, phone: e.target.value } : c))
                                )
                              }
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setEmergencyContacts((prev) => prev.filter((c) => c.id !== contact.id))}
                          >
                            Remove
                          </Button>
                        </>
                      ) : (
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="font-medium text-sm">{contact.name || "—"}</p>
                            <p className="text-xs text-muted-foreground">{contact.relationship || "—"}</p>
                          </div>
                          <span className="text-sm text-muted-foreground font-mono">{contact.phone || "—"}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEmergencyContacts((prev) => [
                          ...prev,
                          { id: String(Date.now()), name: "", relationship: "", phone: "" },
                        ])
                      }
                    >
                      Add emergency contact
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </MainLayout>
  );
}
