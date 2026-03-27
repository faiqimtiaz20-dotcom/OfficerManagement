 import { MainLayout } from "@/components/layout/MainLayout";
 import { KPICard } from "@/components/dashboard/KPICard";
 import { ShiftOverviewChart } from "@/components/dashboard/ShiftOverviewChart";
 import { ComplianceStatusChart } from "@/components/dashboard/ComplianceStatusChart";
 import { LiveShiftMonitor } from "@/components/dashboard/LiveShiftMonitor";
 import { UpcomingExpirations } from "@/components/dashboard/UpcomingExpirations";
 import { QuickActions } from "@/components/dashboard/QuickActions";
 import {
   Users,
   Calendar,
   CheckCircle,
   AlertTriangle,
   Clock,
   Building2,
   TrendingUp,
 } from "lucide-react";
 import { useAuth } from "@/context/AuthContext";

 const Index = () => {
   const { user } = useAuth();
   return (
     <MainLayout
       title="Dashboard"
       subtitle={`Welcome back, ${user?.name ?? "User"}. Here's your operational overview.`}
     >
       <div className="space-y-6 stagger-children">
         {/* KPI Cards */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
           <KPICard
             title="Total Officers"
             value="156"
             icon={Users}
             variant="default"
             trend={{ value: 12, isPositive: true }}
             subtitle="Active workforce"
             to="/officers"
           />
           <KPICard
             title="Today's Shifts"
             value="48"
             icon={Calendar}
             variant="info"
             subtitle="24 in progress"
             to="/scheduling"
           />
           <KPICard
             title="Unassigned Shifts"
             value="5"
             icon={Clock}
             variant="warning"
             subtitle="Need coverage"
             to="/scheduling?filter=unassigned"
           />
           <KPICard
             title="Attendance Rate"
             value="96.5%"
             icon={TrendingUp}
             variant="success"
             trend={{ value: 2.3, isPositive: true }}
             subtitle="Shift attendance"
             to="/reports/shift-attendance"
           />
           <KPICard
             title="Compliant"
             value="128"
             icon={CheckCircle}
             variant="success"
             trend={{ value: 5, isPositive: true }}
             subtitle="BS7858 verified"
             to="/compliance"
           />
           <KPICard
             title="Pending Reviews"
             value="18"
             icon={Clock}
             variant="warning"
             subtitle="Needs attention"
             to="/compliance"
           />
           <KPICard
             title="Expiring Soon"
             value="12"
             icon={AlertTriangle}
             variant="danger"
             subtitle="Within 30 days"
             to="/compliance?filter=expiring"
           />
           <KPICard
             title="Active Sites"
             value="34"
             icon={Building2}
             variant="default"
             subtitle="Across 12 clients"
             to="/sites"
           />
         </div>
 
         {/* Charts Row */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2">
             <ShiftOverviewChart />
           </div>
           <div>
             <ComplianceStatusChart />
           </div>
         </div>
 
         {/* Bottom Row */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2">
             <LiveShiftMonitor />
           </div>
           <div className="space-y-6">
             <QuickActions />
             <UpcomingExpirations />
           </div>
         </div>
       </div>
     </MainLayout>
   );
 };
 
 export default Index;
