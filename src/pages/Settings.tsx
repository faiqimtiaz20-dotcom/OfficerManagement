import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useState } from "react";
import {
  Building2,
  Shield,
  Bell,
  Clock,
  CreditCard,
  Users,
  Mail,
  Globe,
  Lock,
  Briefcase,
  ClipboardList,
  Plus,
  Pencil,
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
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { useOfficerTypes, type OfficerTypeOption } from "@/context/OfficerTypesContext";
import { useDutyTypes, type DutyTypeOption } from "@/context/DutyTypesContext";
import { toast } from "sonner";

const mockUsers = [
  {
    id: "7",
    name: "Company Admin",
    email: "admin@guardforce.local",
    role: "Company Admin",
    status: "Active",
  },
  {
    id: "2",
    name: "HR Manager",
    email: "hr@guardforce.local",
    role: "HR / Compliance",
    status: "Active",
  },
  {
    id: "3",
    name: "Operations Manager",
    email: "ops@guardforce.local",
    role: "Operations",
    status: "Active",
  },
  {
    id: "4",
    name: "Scheduler",
    email: "scheduler@guardforce.local",
    role: "Scheduler",
    status: "Active",
  },
  {
    id: "5",
    name: "Finance User",
    email: "finance@guardforce.local",
    role: "Finance",
    status: "Active",
  },
];
 
 export default function Settings() {
  const { user } = useAuth();
  const { officerTypes, addOfficerType, updateOfficerType, removeOfficerType } = useOfficerTypes();
  const [officerTypeModalOpen, setOfficerTypeModalOpen] = useState(false);
  const [editingOfficerType, setEditingOfficerType] = useState<OfficerTypeOption | null>(null);
  const [officerTypeName, setOfficerTypeName] = useState("");
  const [officerTypeRequiresLicence, setOfficerTypeRequiresLicence] = useState(true);

  const { dutyTypes, addDutyType, updateDutyType, removeDutyType } = useDutyTypes();
  const [dutyTypeModalOpen, setDutyTypeModalOpen] = useState(false);
  const [editingDutyType, setEditingDutyType] = useState<DutyTypeOption | null>(null);
  const [dutyTypeName, setDutyTypeName] = useState("");

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifShiftAssignment, setNotifShiftAssignment] = useState(true);
  const [notifComplianceExpiry, setNotifComplianceExpiry] = useState(true);
  const [notifNoShow, setNotifNoShow] = useState(true);
  const [notifDailySummary, setNotifDailySummary] = useState(false);

  const openAddOfficerType = () => {
    setEditingOfficerType(null);
    setOfficerTypeName("");
    setOfficerTypeRequiresLicence(true);
    setOfficerTypeModalOpen(true);
  };

  const openEditOfficerType = (t: OfficerTypeOption) => {
    setEditingOfficerType(t);
    setOfficerTypeName(t.name);
    setOfficerTypeRequiresLicence(t.requiresLicence);
    setOfficerTypeModalOpen(true);
  };

  const saveOfficerTypeModal = () => {
    const name = officerTypeName.trim();
    if (!name) return;
    if (editingOfficerType) {
      updateOfficerType(editingOfficerType.id, name, officerTypeRequiresLicence);
    } else {
      addOfficerType(name, officerTypeRequiresLicence);
    }
    setOfficerTypeModalOpen(false);
  };

  const openAddDutyType = () => {
    setEditingDutyType(null);
    setDutyTypeName("");
    setDutyTypeModalOpen(true);
  };

  const openEditDutyType = (t: DutyTypeOption) => {
    setEditingDutyType(t);
    setDutyTypeName(t.name);
    setDutyTypeModalOpen(true);
  };

  const saveDutyTypeModal = () => {
    const name = dutyTypeName.trim();
    if (!name) return;
    if (editingDutyType) {
      updateDutyType(editingDutyType.id, name);
    } else {
      addDutyType(name);
    }
    setDutyTypeModalOpen(false);
  };

  const handleSaveSettings = () => {
    toast.success("Settings saved in demo mode. Backend persistence will be wired in API phase.");
  };

   return (
     <MainLayout title="Settings" subtitle="System configuration and preferences">
       <Tabs defaultValue="general" className="space-y-6">
         <TabsList className="grid grid-cols-2 lg:grid-cols-8 w-full lg:w-auto">
           <TabsTrigger value="general" className="gap-2">
             <Building2 className="h-4 w-4" />
             <span className="hidden sm:inline">General</span>
           </TabsTrigger>
           <TabsTrigger value="officer-types" className="gap-2">
             <Briefcase className="h-4 w-4" />
             <span className="hidden sm:inline">Officer types</span>
           </TabsTrigger>
           <TabsTrigger value="duty-types" className="gap-2">
             <ClipboardList className="h-4 w-4" />
             <span className="hidden sm:inline">Duty / Shifts types</span>
           </TabsTrigger>
           <TabsTrigger value="compliance" className="gap-2">
             <Shield className="h-4 w-4" />
             <span className="hidden sm:inline">Compliance</span>
           </TabsTrigger>
           <TabsTrigger value="scheduling" className="gap-2">
             <Clock className="h-4 w-4" />
             <span className="hidden sm:inline">Scheduling</span>
           </TabsTrigger>
           <TabsTrigger value="notifications" className="gap-2">
             <Bell className="h-4 w-4" />
             <span className="hidden sm:inline">Notifications</span>
           </TabsTrigger>
           <TabsTrigger value="billing" className="gap-2">
             <CreditCard className="h-4 w-4" />
             <span className="hidden sm:inline">Billing</span>
           </TabsTrigger>
           <TabsTrigger value="users" className="gap-2">
             <Users className="h-4 w-4" />
             <span className="hidden sm:inline">Users</span>
           </TabsTrigger>
         </TabsList>
 
         {/* General Settings */}
         <TabsContent value="general">
           <div className="grid gap-6">
             <Card className="glass-card">
               <CardHeader>
                 <CardTitle>Company Information</CardTitle>
                 <CardDescription>
                   Basic details about your organization
                 </CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="company-name">Company Name</Label>
                     <Input id="company-name" defaultValue="GuardForce Security Ltd" />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="company-reg">Company Registration</Label>
                     <Input id="company-reg" defaultValue="12345678" />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="sia-acs">SIA ACS Number</Label>
                     <Input id="sia-acs" defaultValue="ACS12345" />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="vat">VAT Number</Label>
                     <Input id="vat" defaultValue="GB123456789" />
                   </div>
                 </div>
                 <Separator />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="timezone">Timezone</Label>
                     <Select defaultValue="europe-london">
                       <SelectTrigger>
                         <Globe className="h-4 w-4 mr-2" />
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="europe-london">Europe/London (GMT)</SelectItem>
                         <SelectItem value="europe-paris">Europe/Paris (CET)</SelectItem>
                         <SelectItem value="america-new-york">America/New York (EST)</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="date-format">Date Format</Label>
                     <Select defaultValue="dd-mm-yyyy">
                       <SelectTrigger>
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                         <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                         <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 </div>
               </CardContent>
             </Card>
 
             <Card className="glass-card">
               <CardHeader>
                 <CardTitle>System Preferences</CardTitle>
                 <CardDescription>
                   Configure system-wide settings
                 </CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <Label>Auto-assign officers</Label>
                     <p className="text-sm text-muted-foreground">
                       Automatically assign available officers to shifts
                     </p>
                   </div>
                   <Switch defaultChecked />
                 </div>
                 <Separator />
                 <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <Label>Require shift confirmation</Label>
                     <p className="text-sm text-muted-foreground">
                       Officers must confirm their shifts
                     </p>
                   </div>
                   <Switch defaultChecked />
                 </div>
                 <Separator />
                 <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <Label>Enable GPS check-in</Label>
                     <p className="text-sm text-muted-foreground">
                       Require location verification for check-ins
                     </p>
                   </div>
                   <Switch defaultChecked />
                 </div>
               </CardContent>
             </Card>
</div>
         </TabsContent>

         {/* Officer types */}
         <TabsContent value="officer-types">
           <Card className="glass-card">
             <CardHeader>
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                 <div>
                   <CardTitle>Officer types</CardTitle>
                   <CardDescription>
                     Types used when adding officers. Tick &quot;Requires SIA licence&quot; for roles that need a valid SIA licence (e.g. Door Supervisor, Security Guard).
                   </CardDescription>
                 </div>
                 <Button className="gradient-primary shrink-0" onClick={openAddOfficerType}>
                   <Plus className="h-4 w-4 mr-2" />
                   Add officer type
                 </Button>
               </div>
             </CardHeader>
             <CardContent>
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Name</TableHead>
                     <TableHead className="w-[180px]">Requires SIA licence</TableHead>
                     <TableHead className="w-[120px] text-right">Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {officerTypes.map((t) => (
                     <TableRow key={t.id}>
                       <TableCell className="font-medium">{t.name}</TableCell>
                       <TableCell>{t.requiresLicence ? "Yes" : "No"}</TableCell>
                       <TableCell className="text-right">
                         <div className="flex justify-end gap-1">
                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditOfficerType(t)}>
                             <Pencil className="h-4 w-4" />
                           </Button>
                           <Button
                             variant="ghost"
                             size="icon"
                             className="h-8 w-8 text-destructive hover:text-destructive"
                             onClick={() => removeOfficerType(t.id)}
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         </div>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </CardContent>
           </Card>

           <Dialog open={officerTypeModalOpen} onOpenChange={setOfficerTypeModalOpen}>
             <DialogContent className="sm:max-w-md">
               <DialogHeader>
                 <DialogTitle>{editingOfficerType ? "Edit officer type" : "Add officer type"}</DialogTitle>
                 <DialogDescription>
                   This type will appear in the officer creation form. Set whether an SIA licence is required for this role.
                 </DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                 <div className="space-y-2">
                   <Label htmlFor="officer-type-name">Name</Label>
                   <Input
                     id="officer-type-name"
                     value={officerTypeName}
                     onChange={(e) => setOfficerTypeName(e.target.value)}
                     placeholder="e.g. SECURITY GUARD"
                   />
                 </div>
                 <div className="flex items-center space-x-2">
                   <Checkbox
                     id="officer-type-licence"
                     checked={officerTypeRequiresLicence}
                     onCheckedChange={(checked) => setOfficerTypeRequiresLicence(checked === true)}
                   />
                   <Label htmlFor="officer-type-licence" className="font-normal cursor-pointer">
                     Requires SIA licence
                   </Label>
                 </div>
               </div>
               <DialogFooter>
                 <Button variant="outline" onClick={() => setOfficerTypeModalOpen(false)}>
                   Cancel
                 </Button>
                 <Button onClick={saveOfficerTypeModal} disabled={!officerTypeName.trim()}>
                   {editingOfficerType ? "Save changes" : "Add type"}
                 </Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>
         </TabsContent>

         {/* Duty / Shifts types */}
         <TabsContent value="duty-types">
           <Card className="glass-card">
             <CardHeader>
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                 <div>
                   <CardTitle>Duty / Shifts types</CardTitle>
                   <CardDescription>
                     Types used in site rate cards (e.g. Security, Cleaning, Site supervisor). Set rates per duty type on each site&apos;s Rate card tab.
                   </CardDescription>
                 </div>
                 <Button className="gradient-primary shrink-0" onClick={openAddDutyType}>
                   <Plus className="h-4 w-4 mr-2" />
                   Add duty type
                 </Button>
               </div>
             </CardHeader>
             <CardContent>
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Name</TableHead>
                     <TableHead className="w-[120px] text-right">Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {dutyTypes.map((t) => (
                     <TableRow key={t.id}>
                       <TableCell className="font-medium">{t.name}</TableCell>
                       <TableCell className="text-right">
                         <div className="flex justify-end gap-1">
                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDutyType(t)}>
                             <Pencil className="h-4 w-4" />
                           </Button>
                           <Button
                             variant="ghost"
                             size="icon"
                             className="h-8 w-8 text-destructive hover:text-destructive"
                             onClick={() => removeDutyType(t.id)}
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         </div>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </CardContent>
           </Card>

           <Dialog open={dutyTypeModalOpen} onOpenChange={setDutyTypeModalOpen}>
             <DialogContent className="sm:max-w-md">
               <DialogHeader>
                 <DialogTitle>{editingDutyType ? "Edit duty type" : "Add duty type"}</DialogTitle>
                 <DialogDescription>
                   This type will appear in site rate cards so you can set a rate per duty type (e.g. Security, Cleaning).
                 </DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                 <div className="space-y-2">
                   <Label htmlFor="duty-type-name">Name</Label>
                   <Input
                     id="duty-type-name"
                     value={dutyTypeName}
                     onChange={(e) => setDutyTypeName(e.target.value)}
                     placeholder="e.g. Security, Site supervisor"
                   />
                 </div>
               </div>
               <DialogFooter>
                 <Button variant="outline" onClick={() => setDutyTypeModalOpen(false)}>
                   Cancel
                 </Button>
                 <Button onClick={saveDutyTypeModal} disabled={!dutyTypeName.trim()}>
                   {editingDutyType ? "Save changes" : "Add type"}
                 </Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>
         </TabsContent>

         {/* Compliance Settings */}
         <TabsContent value="compliance">
           <Card className="glass-card">
             <CardHeader>
               <CardTitle>BS7858 Compliance Settings</CardTitle>
               <CardDescription>
                 Configure vetting and compliance requirements
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
               <div className="flex items-center justify-between">
                 <div className="space-y-0.5">
                   <Label>Enforce BS7858 screening</Label>
                   <p className="text-sm text-muted-foreground">
                     Require full screening before officer activation
                   </p>
                 </div>
                 <Switch defaultChecked />
               </div>
               <Separator />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>SIA License Expiry Warning (days)</Label>
                   <Input type="number" defaultValue="30" />
                 </div>
                 <div className="space-y-2">
                   <Label>DBS Renewal Period (months)</Label>
                   <Input type="number" defaultValue="36" />
                 </div>
               </div>
               <Separator />
               <div className="flex items-center justify-between">
                 <div className="space-y-0.5">
                   <Label>Auto-suspend on SIA expiry</Label>
                   <p className="text-sm text-muted-foreground">
                     Automatically suspend officers with expired licenses
                   </p>
                 </div>
                 <Switch defaultChecked />
               </div>
               <div className="flex items-center justify-between">
                 <div className="space-y-0.5">
                   <Label>Require reference verification</Label>
                   <p className="text-sm text-muted-foreground">
                     5-year employment history verification
                   </p>
                 </div>
                 <Switch defaultChecked />
               </div>
             </CardContent>
           </Card>
         </TabsContent>
 
         {/* Scheduling Settings */}
         <TabsContent value="scheduling">
           <Card className="glass-card">
             <CardHeader>
               <CardTitle>Scheduling Rules</CardTitle>
               <CardDescription>
                 Configure shift scheduling parameters
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Maximum shift duration (hours)</Label>
                   <Input type="number" defaultValue="12" />
                 </div>
                 <div className="space-y-2">
                   <Label>Minimum rest period (hours)</Label>
                   <Input type="number" defaultValue="11" />
                 </div>
                 <div className="space-y-2">
                   <Label>Maximum weekly hours</Label>
                   <Input type="number" defaultValue="48" />
                 </div>
                 <div className="space-y-2">
                   <Label>Late arrival threshold (minutes)</Label>
                   <Input type="number" defaultValue="15" />
                 </div>
               </div>
               <Separator />
               <div className="flex items-center justify-between">
                 <div className="space-y-0.5">
                   <Label>Enable fatigue management</Label>
                   <p className="text-sm text-muted-foreground">
                     Prevent scheduling that violates rest requirements
                   </p>
                 </div>
                 <Switch defaultChecked />
               </div>
               <div className="flex items-center justify-between">
                 <div className="space-y-0.5">
                   <Label>Allow overtime</Label>
                   <p className="text-sm text-muted-foreground">
                     Allow officers to work beyond standard hours
                   </p>
                 </div>
                 <Switch />
               </div>
             </CardContent>
           </Card>
         </TabsContent>
 
         {/* Notifications Settings */}
         <TabsContent value="notifications">
           <Card className="glass-card">
             <CardHeader>
               <CardTitle>Notification Preferences</CardTitle>
               <CardDescription>
                 Configure alerts and notifications. These preferences are saved in the app (frontend state).
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <Mail className="h-5 w-5 text-muted-foreground" />
                   <div className="space-y-0.5">
                     <Label>Email notifications</Label>
                     <p className="text-sm text-muted-foreground">
                       Receive alerts via email
                     </p>
                   </div>
                 </div>
                 <Switch checked={notifEmail} onCheckedChange={setNotifEmail} />
               </div>
               <Separator />
               <div className="flex items-center justify-between">
                 <div className="space-y-0.5">
                   <Label>Shift assignment alerts</Label>
                   <p className="text-sm text-muted-foreground">
                     Notify officers of new shift assignments
                   </p>
                 </div>
                 <Switch checked={notifShiftAssignment} onCheckedChange={setNotifShiftAssignment} />
               </div>
               <div className="flex items-center justify-between">
                 <div className="space-y-0.5">
                   <Label>Compliance expiry warnings</Label>
                   <p className="text-sm text-muted-foreground">
                     Alert before SIA/DBS expiration
                   </p>
                 </div>
                 <Switch checked={notifComplianceExpiry} onCheckedChange={setNotifComplianceExpiry} />
               </div>
               <div className="flex items-center justify-between">
                 <div className="space-y-0.5">
                   <Label>No-show alerts</Label>
                   <p className="text-sm text-muted-foreground">
                     Immediate notification for missed check-ins
                   </p>
                 </div>
                 <Switch checked={notifNoShow} onCheckedChange={setNotifNoShow} />
               </div>
               <div className="flex items-center justify-between">
                 <div className="space-y-0.5">
                   <Label>Daily summary reports</Label>
                   <p className="text-sm text-muted-foreground">
                     Receive daily operational summaries
                   </p>
                 </div>
                 <Switch checked={notifDailySummary} onCheckedChange={setNotifDailySummary} />
               </div>
             </CardContent>
           </Card>
         </TabsContent>
 
         {/* Billing Settings */}
         <TabsContent value="billing">
           <Card className="glass-card">
             <CardHeader>
               <CardTitle>Billing Configuration</CardTitle>
               <CardDescription>
                 Pay rates, charge rates, and invoice settings
               </CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label>Default hourly pay rate (£)</Label>
                   <Input type="number" defaultValue="12.50" step="0.01" />
                 </div>
                 <div className="space-y-2">
                   <Label>Default hourly charge rate (£)</Label>
                   <Input type="number" defaultValue="18.00" step="0.01" />
                 </div>
                 <div className="space-y-2">
                   <Label>Overtime multiplier</Label>
                   <Input type="number" defaultValue="1.5" step="0.1" />
                 </div>
                 <div className="space-y-2">
                   <Label>Invoice prefix</Label>
                   <Input defaultValue="INV-" />
                 </div>
               </div>
               <Separator />
               <div className="flex items-center justify-between">
                 <div className="space-y-0.5">
                   <Label>Auto-generate weekly invoices</Label>
                   <p className="text-sm text-muted-foreground">
                     Automatically create draft invoices each week
                   </p>
                 </div>
                 <Switch />
               </div>
             </CardContent>
           </Card>
         </TabsContent>
 
         {/* Users Settings */}
         <TabsContent value="users">
           <Card className="glass-card">
             <CardHeader>
               <div className="flex items-center justify-between">
                 <div>
                   <CardTitle>User Management</CardTitle>
                   <CardDescription>
                     Manage system users and roles
                   </CardDescription>
                 </div>
                {user?.role === "ADMIN" && (
                  <Button className="gradient-primary">
                    <Users className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                )}
               </div>
             </CardHeader>
             <CardContent>
              <div className="mb-4 text-sm text-muted-foreground flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>
                  This is a demo list. Role changes and new users are not yet persisted.
                </span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell>{u.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
             </CardContent>
           </Card>
         </TabsContent>
       </Tabs>
 
       {/* Save Button */}
       <div className="flex justify-end mt-6">
        <Button className="gradient-primary" onClick={handleSaveSettings}>
          Save Changes
        </Button>
       </div>
     </MainLayout>
   );
 }