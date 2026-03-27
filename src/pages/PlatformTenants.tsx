import { PlatformLayout } from "@/components/layout/PlatformLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockDb } from "@/data/mockDb";
import { usePlatformCatalog } from "@/context/PlatformCatalogContext";
import { toast } from "sonner";

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function PlatformTenants() {
  const { sortedPlans, getPlanById } = usePlatformCatalog();

  const handleAddCompany = () => {
    toast.message("Add company", {
      description: "Wire this to your API: create tenant row + subscription_plan_id and admin user.",
    });
  };

  return (
    <PlatformLayout
      title="Companies"
      subtitle="Create and manage customer tenants — isolated data per company."
    >
      <div className="space-y-6">
        <Card className="border-white/10 bg-slate-900/50 text-slate-200 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-white">Tenants</CardTitle>
              <CardDescription className="text-slate-400">
                Each company is isolated; billing is tied via{" "}
                <code className="text-xs">tenant.subscription_plan_id</code> and status columns.
              </CardDescription>
            </div>
            <Button type="button" className="gradient-primary" onClick={handleAddCompany}>
              Add company
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Renews / ends</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDb.platformTenantsList.map((t) => {
                  const plan = t.subscriptionPlanId ? getPlanById(t.subscriptionPlanId) : undefined;
                  return (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell className="text-muted-foreground">{t.slug}</TableCell>
                      <TableCell>
                        {plan ? (
                          <span>
                            {plan.name}{" "}
                            <span className="text-muted-foreground text-sm">
                              ({formatMoney(plan.priceAmount, plan.currency)} / {plan.billingInterval})
                            </span>
                          </span>
                        ) : t.subscriptionStatus === "none" ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <span className="text-muted-foreground">Unknown plan</span>
                        )}
                      </TableCell>
                      <TableCell className="capitalize">
                        {t.subscriptionStatus.replace(/_/g, " ")}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {t.subscriptionCurrentPeriodEnd
                          ? formatDate(t.subscriptionCurrentPeriodEnd)
                          : "—"}
                      </TableCell>
                      <TableCell className="capitalize">{t.status}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-900/50 text-slate-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white">Subscription plans</CardTitle>
            <CardDescription className="text-slate-400">
              Catalog from <code className="text-xs">subscription_plan</code> — link tenants with{" "}
              <code className="text-xs">subscription_plan_id</code>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Limits (users / sites / officers)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPlans.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">{p.code}</TableCell>
                      <TableCell>
                        {formatMoney(p.priceAmount, p.currency)}
                        <span className="text-muted-foreground text-sm"> / {p.billingInterval}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {p.maxUsers == null && p.maxSites == null && p.maxOfficers == null
                          ? "Unlimited"
                          : `${p.maxUsers ?? "—"} / ${p.maxSites ?? "—"} / ${p.maxOfficers ?? "—"}`}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PlatformLayout>
  );
}
