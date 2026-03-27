import { Link } from "react-router-dom";
import { PlatformLayout } from "@/components/layout/PlatformLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDb } from "@/data/mockDb";
import { usePlatformCatalog } from "@/context/PlatformCatalogContext";
import { Building2, ArrowRight, Package, Shield, Sparkles } from "lucide-react";

export default function PlatformDashboard() {
  const { sortedPlans, sortedFeatures } = usePlatformCatalog();
  const tenantCount = mockDb.platformTenantsList.length;

  return (
    <PlatformLayout
      title="Platform dashboard"
      subtitle="Manage customer companies, billing plans, and product features — separate from tenant CRM data."
    >
      <div className="space-y-8 max-w-5xl">
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 flex gap-3 items-start">
          <Sparkles className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300 leading-relaxed">
            You are signed in as a <strong className="text-white">Super Administrator</strong>. This
            console is for operating the multi-tenant product (new companies, subscription catalog).
            Customer security work happens inside each company&apos;s CRM after you open or delegate
            access to a tenant admin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-white/10 bg-[#111827]/80 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-500">Tenants</CardDescription>
              <CardTitle className="text-3xl font-bold text-white tabular-nums">{tenantCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">Companies on the platform</p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-[#111827]/80 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-500">Subscription plans</CardDescription>
              <CardTitle className="text-3xl font-bold text-white tabular-nums">
                {sortedPlans.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">Sellable tiers</p>
            </CardContent>
          </Card>
          <Card className="border-white/10 bg-[#111827]/80 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-500">Features</CardDescription>
              <CardTitle className="text-3xl font-bold text-white tabular-nums">
                {sortedFeatures.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500">Entitlement modules</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Quick actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-white/10 bg-[#111827]/80 hover:border-violet-500/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2 text-violet-300">
                  <Building2 className="h-5 w-5" />
                  <CardTitle className="text-lg text-white">Companies</CardTitle>
                </div>
                <CardDescription className="text-slate-500">
                  Create tenants, assign subscription plans, and onboard customer admins.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  className="bg-violet-600 hover:bg-violet-500 text-white gap-2"
                >
                  <Link to="/platform/tenants">
                    Open companies
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#111827]/80 hover:border-violet-500/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-2 text-violet-300">
                  <Package className="h-5 w-5" />
                  <CardTitle className="text-lg text-white">Plans & features</CardTitle>
                </div>
                <CardDescription className="text-slate-500">
                  Configure pricing, limits, and which product modules each plan includes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  variant="outline"
                  className="border-violet-500/40 text-violet-100 hover:bg-violet-500/10 gap-2"
                >
                  <Link to="/platform/subscription-plans">
                    Manage catalog
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border-white/10 bg-[#111827]/60">
          <CardHeader>
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="h-4 w-4" />
              <CardTitle className="text-base text-slate-300">Security note</CardTitle>
            </div>
            <CardDescription className="text-slate-500 text-sm">
              Restrict this role to trusted operators. Audit platform actions in production and use
              separate credentials from tenant company admins.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PlatformLayout>
  );
}
