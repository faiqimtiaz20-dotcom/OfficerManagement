 import { useNavigate } from "react-router-dom";
 import { Bell, Search, ChevronDown, HelpCircle } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 import { Avatar, AvatarFallback } from "@/components/ui/avatar";
 import { useAuth } from "@/context/AuthContext";

 const roleLabels: Record<string, string> = {
   SUPER_ADMIN: "Super Administrator",
   ADMIN: "Company Admin",
   HR: "HR / Compliance",
   OPS: "Operations Manager",
   SCHEDULER: "Scheduler",
   FINANCE: "Finance",
   OFFICER: "Officer",
 };

 interface TopBarProps {
   title: string;
   subtitle?: string;
 }

 export function TopBar({ title, subtitle }: TopBarProps) {
   const { user, logout } = useAuth();
   const navigate = useNavigate();

   const handleSignOut = () => {
     logout();
     navigate("/login", { replace: true });
   };

   return (
     <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
       <div className="h-full px-6 flex items-center justify-between">
         {/* Page Title */}
         <div>
           <h1 className="text-xl font-semibold text-foreground">{title}</h1>
           {subtitle && (
             <p className="text-sm text-muted-foreground">{subtitle}</p>
           )}
         </div>
 
         {/* Right Section */}
         <div className="flex items-center gap-4">
           {/* Search */}
           <div className="relative hidden md:block">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input
               placeholder="Search..."
               className="w-64 pl-9 bg-muted/50 border-transparent focus:border-primary focus:bg-background"
             />
           </div>
 
           {/* Help */}
           <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
             <HelpCircle className="h-5 w-5" />
           </Button>
 
           {/* Notifications */}
           <Button
             variant="ghost"
             size="icon"
             className="relative text-muted-foreground hover:text-foreground"
             onClick={() => navigate("/notifications")}
           >
             <Bell className="h-5 w-5" />
             <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
           </Button>
 
           {/* User Menu */}
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="flex items-center gap-2 px-2">
                 <Avatar className="h-8 w-8">
                   <AvatarFallback className="bg-primary/10 text-primary text-xs">
                     {user?.name?.slice(0, 2).toUpperCase() ?? "U"}
                   </AvatarFallback>
                 </Avatar>
                 <div className="hidden md:block text-left">
                   <p className="text-sm font-medium">{user?.name ?? "User"}</p>
                   <p className="text-xs text-muted-foreground">
                     {user ? roleLabels[user.role] ?? user.role : "—"}
                   </p>
                 </div>
                 <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
               </Button>
             </DropdownMenuTrigger>
             <DropdownMenuContent align="end" className="w-56">
               <DropdownMenuLabel>My Account</DropdownMenuLabel>
               <DropdownMenuSeparator />
               <DropdownMenuItem>Profile Settings</DropdownMenuItem>
               <DropdownMenuItem>Preferences</DropdownMenuItem>
               <DropdownMenuItem>Keyboard Shortcuts</DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
                 Sign Out
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>
         </div>
       </div>
     </header>
   );
 }