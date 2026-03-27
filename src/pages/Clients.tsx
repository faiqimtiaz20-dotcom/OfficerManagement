import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
   Building2,
   MapPin,
   Calendar,
   LayoutGrid,
   List,
   MoreHorizontal,
   Eye,
   Edit,
   Trash2,
} from "lucide-react";
 import { cn } from "@/lib/utils";
 import { useAuth } from "@/context/AuthContext";
 import { ClientDetailSheet, type ClientDetail } from "@/components/clients/ClientDetailSheet";
import { AddClientModal, type AddClientFormData } from "@/components/clients/AddClientModal";
import { toast } from "sonner";
import { clientsList as initialClientsList, type Client } from "@/data/clientsMock";

 function toClientDetail(c: Client): ClientDetail {
   return {
     id: c.id,
     name: c.name,
     email: c.email,
     phone: c.phone,
     address: c.address,
     industry: c.industry,
     sites: c.sites,
     activeShifts: c.activeShifts,
     status: c.status,
     since: c.since,
     companyRegNumber: c.companyRegNumber,
     vatNumber: c.vatNumber,
     companyRegisteredAddress: c.companyRegisteredAddress,
     website: c.website,
     siteNames: c.siteNames,
     notes: c.notes,
   };
 }

 export default function Clients() {
   const { user } = useAuth();
   const navigate = useNavigate();
   const [searchQuery, setSearchQuery] = useState("");
   const [viewMode, setViewMode] = useState<"cards" | "table">("table");
   const [clientsList, setClientsList] = useState<Client[]>(initialClientsList);
   const [addModalOpen, setAddModalOpen] = useState(false);
   const [detailClient, setDetailClient] = useState<ClientDetail | null>(null);
   const [detailOpen, setDetailOpen] = useState(false);

   const canEditClients = user?.role === "ADMIN" || user?.role === "OPS";

   const openDetail = (client: Client) => {
     setDetailClient(toClientDetail(client));
     setDetailOpen(true);
   };

   const handleDeleteClient = (client: Client, e: React.MouseEvent) => {
     e.stopPropagation();
     if (window.confirm(`Delete client "${client.name}"? This cannot be undone.`)) {
       setClientsList((prev) => prev.filter((c) => c.id !== client.id));
       setDetailOpen(false);
       if (detailClient?.id === client.id) setDetailClient(null);
       toast.success("Client removed.");
     }
   };

   const handleAddClientSuccess = (data: AddClientFormData) => {
     const newId = String(Math.max(...clientsList.map((c) => Number(c.id) || 0), 0) + 1);
     const rate = data.defaultBaseRate.trim() ? parseFloat(data.defaultBaseRate) : undefined;
     const newClient: Client = {
       id: newId,
       name: data.name.trim(),
       email: data.email.trim() || undefined,
       phone: data.phone.trim() || undefined,
       address: data.address.trim() || undefined,
       industry: data.industry,
       status: data.status,
       defaultBaseRate: rate != null && !Number.isNaN(rate) ? rate : undefined,
       sites: 0,
       activeShifts: 0,
       since: new Date().toISOString().slice(0, 10),
       contactPersons: [],
       documents: [],
       notes: [],
       siteNames: [],
     };
     setClientsList((prev) => [...prev, newClient]);
     toast.success("Client added.");
     setAddModalOpen(false);
   };

   const filteredClients = clientsList.filter(
     (c) =>
       c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       c.industry.toLowerCase().includes(searchQuery.toLowerCase())
   );

   return (
     <MainLayout title="Clients" subtitle="Manage client relationships">
       <div className="space-y-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row gap-4 justify-between">
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder="Search clients..."
               className="pl-9"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
           </div>
           <div className="flex items-center gap-2">
             <div className="flex rounded-lg border border-border p-0.5 bg-muted/30">
               <Button
                 variant={viewMode === "cards" ? "secondary" : "ghost"}
                 size="sm"
                 className="rounded-md"
                 onClick={() => setViewMode("cards")}
               >
                 <LayoutGrid className="h-4 w-4 mr-1.5" />
                 Cards
               </Button>
               <Button
                 variant={viewMode === "table" ? "secondary" : "ghost"}
                 size="sm"
                 className="rounded-md"
                 onClick={() => setViewMode("table")}
               >
                 <List className="h-4 w-4 mr-1.5" />
                 Table
               </Button>
             </div>
             {canEditClients && (
               <Button className="gradient-primary" onClick={() => setAddModalOpen(true)}>
                 <Plus className="h-4 w-4 mr-2" />
                 Add Client
               </Button>
             )}
           </div>
         </div>

         <AddClientModal
           open={addModalOpen}
           onOpenChange={setAddModalOpen}
           onSuccess={handleAddClientSuccess}
         />

         <ClientDetailSheet
           client={detailClient}
           open={detailOpen}
           onOpenChange={setDetailOpen}
           canEdit={canEditClients}
         />

         {/* Clients Grid or Table */}
         {viewMode === "cards" ? (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
             {filteredClients.map((client) => (
               <Card
                 key={client.id}
                 className="glass-card hover-lift cursor-pointer"
                 onClick={() => openDetail(client)}
               >
                 <CardHeader className="pb-2">
                   <div className="flex items-center gap-3">
                     <Avatar className="h-12 w-12">
                       <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                         {client.name
                           .split(" ")
                           .map((n) => n[0])
                           .join("")
                           .slice(0, 2)}
                       </AvatarFallback>
                     </Avatar>
                     <div className="flex-1">
                       <CardTitle className="text-base">{client.name}</CardTitle>
                       <p className="text-sm text-muted-foreground">
                         {client.industry}
                       </p>
                     </div>
                     <Badge
                       variant="outline"
                       className={cn(
                         client.status === "active"
                           ? "status-active"
                           : "status-inactive"
                       )}
                     >
                       {client.status}
                     </Badge>
                   </div>
                 </CardHeader>
                 <CardContent>
                   <div className="grid grid-cols-2 gap-4 py-4">
                     <div className="flex items-center gap-2">
                       <MapPin className="h-4 w-4 text-muted-foreground" />
                       <div>
                         <p className="font-semibold">{client.sites}</p>
                         <p className="text-xs text-muted-foreground">Sites</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                       <Calendar className="h-4 w-4 text-muted-foreground" />
                       <div>
                         <p className="font-semibold">{client.activeShifts}</p>
                         <p className="text-xs text-muted-foreground">Active Shifts</p>
                       </div>
                     </div>
                   </div>
                   <div className="pt-3 border-t border-border">
                     <p className="text-xs text-muted-foreground">
                       Since {new Date(client.since).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                     </p>
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
         ) : (
           <div className="glass-card rounded-xl overflow-hidden">
             <div className="overflow-x-auto">
               <Table>
                 <TableHeader>
                   <TableRow className="hover:bg-transparent">
                     <TableHead className="w-[280px]">Client</TableHead>
                     <TableHead>Email</TableHead>
                     <TableHead>Phone</TableHead>
                     <TableHead>Sites</TableHead>
                     <TableHead>Active shifts</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead>Since</TableHead>
                     <TableHead className="w-[50px]"></TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {filteredClients.map((client) => (
                     <TableRow
                       key={client.id}
                       className="group cursor-pointer hover:bg-muted/50"
                       onClick={() => openDetail(client)}
                     >
                       <TableCell>
                         <div className="flex items-center gap-3">
                           <Avatar className="h-10 w-10">
                             <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                               {client.name
                                 .split(" ")
                                 .map((n) => n[0])
                                 .join("")
                                 .slice(0, 2)}
                             </AvatarFallback>
                           </Avatar>
                           <div>
                             <p className="font-medium text-foreground">{client.name}</p>
                             <p className="text-sm text-muted-foreground">{client.industry}</p>
                           </div>
                         </div>
                       </TableCell>
                       <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                         {client.email || "—"}
                       </TableCell>
                       <TableCell className="text-sm font-mono whitespace-nowrap">
                         {client.phone || "—"}
                       </TableCell>
                       <TableCell className="text-sm font-medium">{client.sites}</TableCell>
                       <TableCell className="text-sm font-medium">{client.activeShifts}</TableCell>
                       <TableCell>
                         <Badge
                           variant="outline"
                           className={cn(
                             client.status === "active"
                               ? "status-active"
                               : "status-inactive"
                           )}
                         >
                           {client.status}
                         </Badge>
                       </TableCell>
                       <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                         {new Date(client.since).toLocaleDateString("en-GB", {
                           month: "short",
                           year: "numeric",
                         })}
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
                             <DropdownMenuItem onClick={() => openDetail(client)}>
                               <Eye className="h-4 w-4 mr-2" />
                               View details
                             </DropdownMenuItem>
                             {canEditClients && (
                               <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}`, { state: { client } })}>
                                 <Edit className="h-4 w-4 mr-2" />
                                 Edit
                               </DropdownMenuItem>
                             )}
                             {canEditClients && (
                               <DropdownMenuItem
                                 className="text-destructive"
                                 onClick={(e) => handleDeleteClient(client, e)}
                               >
                                 <Trash2 className="h-4 w-4 mr-2" />
                                 Delete
                               </DropdownMenuItem>
                             )}
                           </DropdownMenuContent>
                         </DropdownMenu>
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </div>
           </div>
         )}
       </div>
     </MainLayout>
   );
 }