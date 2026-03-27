 import { ReactNode } from "react";
 import { Navigate } from "react-router-dom";
 import { AppSidebar } from "./AppSidebar";
 import { TopBar } from "./TopBar";
 import { useAuth } from "@/context/AuthContext";
 
 interface MainLayoutProps {
   children: ReactNode;
   title: string;
   subtitle?: string;
 }
 
 export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
   const { user } = useAuth();
   if (user?.role === "SUPER_ADMIN") {
     return <Navigate to="/platform" replace />;
   }

   return (
     <div className="min-h-screen flex w-full bg-background">
       <AppSidebar />
       <div className="flex-1 flex flex-col min-w-0">
         <TopBar title={title} subtitle={subtitle} />
         <main className="flex-1 p-6 overflow-auto">
           {children}
         </main>
       </div>
     </div>
   );
 }