import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Officers from "./pages/Officers";
import OfficerDetail from "./pages/OfficerDetail";
import Subcontractors from "./pages/Subcontractors";
import SubcontractorDetail from "./pages/SubcontractorDetail";
import Compliance from "./pages/Compliance";
import Onboarding from "./pages/Onboarding";
import Scheduling from "./pages/Scheduling";
import Shifts from "./pages/Shifts";
import Sites from "./pages/Sites";
import SiteDetail from "./pages/SiteDetail";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import Invoices from "./pages/Invoices";
import Payroll from "./pages/Payroll";
import Reports from "./pages/Reports";
import ReportView from "./pages/ReportView";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import PlatformTenants from "./pages/PlatformTenants";
import PlatformSubscriptionPlans from "./pages/PlatformSubscriptionPlans";
import PlatformDashboard from "./pages/PlatformDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PlatformCatalogProvider } from "./context/PlatformCatalogContext";
import { OfficerTypesProvider } from "./context/OfficerTypesContext";
import { DutyTypesProvider } from "./context/DutyTypesContext";
import { SitesProvider } from "./context/SitesContext";

const queryClient = new QueryClient();
const OFFICER_PORTAL_BASE_URL =
  (import.meta.env.VITE_OFFICER_PORTAL_URL as string | undefined)?.replace(/\/$/, "") ??
  "http://localhost:8081";

interface ProtectedRouteProps {
  children: JSX.Element;
}
interface RoleProtectedRouteProps extends ProtectedRouteProps {
  allowedRoles: Array<"ADMIN" | "HR" | "OPS" | "SCHEDULER" | "FINANCE">;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "OFFICER") {
    window.location.assign(`${OFFICER_PORTAL_BASE_URL}/portal/dashboard`);
    return null;
  }

  if (user.role === "SUPER_ADMIN" && !location.pathname.startsWith("/platform")) {
    return <Navigate to="/platform" replace />;
  }

  return children;
};

const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "SUPER_ADMIN") {
    return <Navigate to="/platform" replace />;
  }

  if (user.role === "OFFICER") {
    window.location.assign(`${OFFICER_PORTAL_BASE_URL}/portal/dashboard`);
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const PlatformProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "SUPER_ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <OfficerTypesProvider>
        <DutyTypesProvider>
        <SitesProvider>
        <BrowserRouter>
          <PlatformCatalogProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/platform"
              element={
                <PlatformProtectedRoute>
                  <PlatformDashboard />
                </PlatformProtectedRoute>
              }
            />

            <Route
              path="/platform/tenants"
              element={
                <PlatformProtectedRoute>
                  <PlatformTenants />
                </PlatformProtectedRoute>
              }
            />

            <Route
              path="/platform/subscription-plans"
              element={
                <PlatformProtectedRoute>
                  <PlatformSubscriptionPlans />
                </PlatformProtectedRoute>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officers"
              element={
                <ProtectedRoute>
                  <Officers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officers/:id"
              element={
                <ProtectedRoute>
                  <OfficerDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subcontractors"
              element={
                <ProtectedRoute>
                  <Subcontractors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subcontractors/:id"
              element={
                <ProtectedRoute>
                  <SubcontractorDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/compliance"
              element={
                <ProtectedRoute>
                  <Compliance />
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/scheduling"
              element={
                <ProtectedRoute>
                  <Scheduling />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shifts"
              element={
                <ProtectedRoute>
                  <Shifts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sites"
              element={
                <ProtectedRoute>
                  <Sites />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sites/:id"
              element={
                <ProtectedRoute>
                  <SiteDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients"
              element={
                <ProtectedRoute>
                  <Clients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/clients/:id"
              element={
                <ProtectedRoute>
                  <ClientDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN", "OPS", "FINANCE"]}>
                  <Invoices />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/payroll"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN", "FINANCE"]}>
                  <Payroll />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/:reportId"
              element={
                <ProtectedRoute>
                  <ReportView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN", "HR", "OPS", "SCHEDULER", "FINANCE"]}>
                  <Notifications />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <RoleProtectedRoute allowedRoles={["ADMIN", "HR", "OPS"]}>
                  <Settings />
                </RoleProtectedRoute>
              }
            />
            {/* officer portal routes will be added in later milestones */}

            <Route path="*" element={<NotFound />} />
          </Routes>
          </PlatformCatalogProvider>
        </BrowserRouter>
        </SitesProvider>
        </DutyTypesProvider>
        </OfficerTypesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
