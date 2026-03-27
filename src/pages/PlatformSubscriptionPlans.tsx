import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { usePlatformCatalog, type SubscriptionPlanEditable } from "@/context/PlatformCatalogContext";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function parseOptionalInt(s: string): number | null {
  const t = s.trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export default function PlatformSubscriptionPlans() {
  const {
    sortedFeatures,
    sortedPlans,
    getFeatureById,
    addFeature,
    updateFeature,
    removeFeature,
    addPlan,
    updatePlan,
    removePlan,
    togglePlanFeature,
  } = usePlatformCatalog();

  const [featureDialogOpen, setFeatureDialogOpen] = useState(false);
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);
  const [featCode, setFeatCode] = useState("");
  const [featName, setFeatName] = useState("");
  const [featDesc, setFeatDesc] = useState("");
  const [featSort, setFeatSort] = useState("10");
  const [featureDeleteId, setFeatureDeleteId] = useState<string | null>(null);

  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState({
    code: "",
    name: "",
    description: "",
    billingInterval: "monthly" as "monthly" | "yearly",
    priceAmount: "99",
    currency: "GBP",
    maxUsers: "",
    maxSites: "",
    maxOfficers: "",
    sortOrder: "1",
  });
  const [planDeleteId, setPlanDeleteId] = useState<string | null>(null);

  const openAddFeature = () => {
    setEditingFeatureId(null);
    setFeatCode("");
    setFeatName("");
    setFeatDesc("");
    setFeatSort(String((sortedFeatures[sortedFeatures.length - 1]?.sortOrder ?? 0) + 10));
    setFeatureDialogOpen(true);
  };

  const openEditFeature = (id: string) => {
    const f = getFeatureById(id);
    if (!f) return;
    setEditingFeatureId(id);
    setFeatCode(f.code);
    setFeatName(f.name);
    setFeatDesc(f.description);
    setFeatSort(String(f.sortOrder));
    setFeatureDialogOpen(true);
  };

  const saveFeature = () => {
    const sortOrder = Number(featSort);
    if (!Number.isFinite(sortOrder)) {
      toast.error("Sort order must be a number.");
      return;
    }
    if (!featCode.trim() || !featName.trim()) {
      toast.error("Code and name are required.");
      return;
    }
    if (editingFeatureId) {
      updateFeature(editingFeatureId, {
        code: featCode,
        name: featName,
        description: featDesc,
        sortOrder,
      });
      toast.success("Feature updated (session only until API is wired).");
    } else {
      addFeature({
        code: featCode,
        name: featName,
        description: featDesc,
        sortOrder,
      });
      toast.success("Feature added (session only until API is wired).");
    }
    setFeatureDialogOpen(false);
  };

  const openAddPlan = () => {
    setEditingPlanId(null);
    setPlanForm({
      code: "",
      name: "",
      description: "",
      billingInterval: "monthly",
      priceAmount: "99",
      currency: "GBP",
      maxUsers: "",
      maxSites: "",
      maxOfficers: "",
      sortOrder: String((sortedPlans[sortedPlans.length - 1]?.sortOrder ?? 0) + 1),
    });
    setPlanDialogOpen(true);
  };

  const openEditPlan = (p: SubscriptionPlanEditable) => {
    setEditingPlanId(p.id);
    setPlanForm({
      code: p.code,
      name: p.name,
      description: p.description,
      billingInterval: p.billingInterval,
      priceAmount: String(p.priceAmount),
      currency: p.currency,
      maxUsers: p.maxUsers == null ? "" : String(p.maxUsers),
      maxSites: p.maxSites == null ? "" : String(p.maxSites),
      maxOfficers: p.maxOfficers == null ? "" : String(p.maxOfficers),
      sortOrder: String(p.sortOrder),
    });
    setPlanDialogOpen(true);
  };

  const savePlan = () => {
    const priceAmount = Number(planForm.priceAmount);
    const sortOrder = Number(planForm.sortOrder);
    if (!planForm.code.trim() || !planForm.name.trim()) {
      toast.error("Code and name are required.");
      return;
    }
    if (!Number.isFinite(priceAmount) || priceAmount < 0) {
      toast.error("Price must be a valid non-negative number.");
      return;
    }
    if (!Number.isFinite(sortOrder)) {
      toast.error("Sort order must be a number.");
      return;
    }
    const maxUsers = parseOptionalInt(planForm.maxUsers);
    const maxSites = parseOptionalInt(planForm.maxSites);
    const maxOfficers = parseOptionalInt(planForm.maxOfficers);

    if (editingPlanId) {
      updatePlan(editingPlanId, {
        code: planForm.code,
        name: planForm.name,
        description: planForm.description,
        billingInterval: planForm.billingInterval,
        priceAmount,
        currency: planForm.currency,
        maxUsers,
        maxSites,
        maxOfficers,
        sortOrder,
      });
      toast.success("Plan updated (session only until API is wired).");
    } else {
      addPlan({
        code: planForm.code,
        name: planForm.name,
        description: planForm.description,
        billingInterval: planForm.billingInterval,
        priceAmount,
        currency: planForm.currency,
        maxUsers,
        maxSites,
        maxOfficers,
        sortOrder,
        featureIds: [],
      });
      toast.success("Plan added (session only until API is wired).");
    }
    setPlanDialogOpen(false);
  };

  const editingPlan = editingPlanId ? sortedPlans.find((p) => p.id === editingPlanId) : null;

  return (
    <PlatformLayout
      title="Plans & features"
      subtitle="Define sellable tiers and product modules — persisted as subscription_plan & subscription_feature in PostgreSQL."
    >
      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="bg-slate-900/80 border border-white/10 p-1">
          <TabsTrigger
            value="plans"
            className="data-[state=active]:bg-violet-600/30 data-[state=active]:text-white text-slate-400"
          >
            Subscription plans
          </TabsTrigger>
          <TabsTrigger
            value="features"
            className="data-[state=active]:bg-violet-600/30 data-[state=active]:text-white text-slate-400"
          >
            Features
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <Card className="border-white/10 bg-slate-900/50 text-slate-200 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-white">Plans</CardTitle>
                <CardDescription className="text-slate-400">
                  Pricing, limits, and which features each plan includes (
                  <code className="text-xs">subscription_plan</code> +{" "}
                  <code className="text-xs">subscription_plan_feature</code>).
                </CardDescription>
              </div>
              <Button type="button" className="gradient-primary gap-2" onClick={openAddPlan}>
                <Plus className="h-4 w-4" />
                Add plan
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Limits (users / sites / officers)</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead className="w-[100px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPlans.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{p.code}</TableCell>
                      <TableCell>
                        {formatMoney(p.priceAmount, p.currency)}
                        <span className="text-muted-foreground text-sm"> / {p.billingInterval}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {p.maxUsers == null && p.maxSites == null && p.maxOfficers == null
                          ? "Unlimited"
                          : `${p.maxUsers ?? "—"} / ${p.maxSites ?? "—"} / ${p.maxOfficers ?? "—"}`}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[240px]">
                        {p.featureIds.length === 0 ? (
                          "—"
                        ) : (
                          <span className="line-clamp-2">
                            {p.featureIds
                              .map((fid) => getFeatureById(fid)?.name ?? fid)
                              .join(", ")}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Edit plan"
                            onClick={() => openEditPlan(p)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Delete plan"
                            onClick={() => setPlanDeleteId(p.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card className="border-white/10 bg-slate-900/50 text-slate-200 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-white">Features</CardTitle>
                <CardDescription className="text-slate-400">
                  Entitlements your app can gate on (
                  <code className="text-xs">subscription_feature</code>).
                </CardDescription>
              </div>
              <Button type="button" className="gradient-primary gap-2" onClick={openAddFeature}>
                <Plus className="h-4 w-4" />
                Add feature
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Sort</TableHead>
                    <TableHead className="w-[100px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedFeatures.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium">{f.name}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{f.code}</TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-md">{f.description}</TableCell>
                      <TableCell>{f.sortOrder}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Edit feature"
                            onClick={() => openEditFeature(f.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label="Delete feature"
                            onClick={() => setFeatureDeleteId(f.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={featureDialogOpen} onOpenChange={setFeatureDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingFeatureId ? "Edit feature" : "Add feature"}</DialogTitle>
            <DialogDescription>Stable codes work best for application checks (e.g. gating routes).</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label htmlFor="feat-code">Code</Label>
              <Input
                id="feat-code"
                value={featCode}
                onChange={(e) => setFeatCode(e.target.value)}
                placeholder="e.g. advanced_reporting"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feat-name">Display name</Label>
              <Input id="feat-name" value={featName} onChange={(e) => setFeatName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feat-desc">Description</Label>
              <Textarea id="feat-desc" value={featDesc} onChange={(e) => setFeatDesc(e.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feat-sort">Sort order</Label>
              <Input id="feat-sort" type="number" value={featSort} onChange={(e) => setFeatSort(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setFeatureDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="gradient-primary" onClick={saveFeature}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlanId ? "Edit plan" : "Add plan"}</DialogTitle>
            <DialogDescription>Match billing fields to your payment provider and database.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="plan-code">Code</Label>
                <Input id="plan-code" value={planForm.code} onChange={(e) => setPlanForm((f) => ({ ...f, code: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-sort">Sort order</Label>
                <Input
                  id="plan-sort"
                  type="number"
                  value={planForm.sortOrder}
                  onChange={(e) => setPlanForm((f) => ({ ...f, sortOrder: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-name">Name</Label>
              <Input id="plan-name" value={planForm.name} onChange={(e) => setPlanForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-desc">Description</Label>
              <Textarea
                id="plan-desc"
                value={planForm.description}
                onChange={(e) => setPlanForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Billing</Label>
                <Select
                  value={planForm.billingInterval}
                  onValueChange={(v) =>
                    setPlanForm((f) => ({ ...f, billingInterval: v as "monthly" | "yearly" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-price">Price</Label>
                <Input
                  id="plan-price"
                  type="number"
                  step="0.01"
                  min={0}
                  value={planForm.priceAmount}
                  onChange={(e) => setPlanForm((f) => ({ ...f, priceAmount: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan-currency">Currency (ISO 4217)</Label>
              <Input id="plan-currency" value={planForm.currency} onChange={(e) => setPlanForm((f) => ({ ...f, currency: e.target.value }))} maxLength={3} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label htmlFor="plan-mu">Max users</Label>
                <Input
                  id="plan-mu"
                  placeholder="empty = ∞"
                  value={planForm.maxUsers}
                  onChange={(e) => setPlanForm((f) => ({ ...f, maxUsers: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-ms">Max sites</Label>
                <Input
                  id="plan-ms"
                  placeholder="empty = ∞"
                  value={planForm.maxSites}
                  onChange={(e) => setPlanForm((f) => ({ ...f, maxSites: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-mo">Max officers</Label>
                <Input
                  id="plan-mo"
                  placeholder="empty = ∞"
                  value={planForm.maxOfficers}
                  onChange={(e) => setPlanForm((f) => ({ ...f, maxOfficers: e.target.value }))}
                />
              </div>
            </div>

            {editingPlan && (
              <div className="space-y-2 pt-2 border-t border-border">
                <Label>Included features</Label>
                <p className="text-xs text-muted-foreground mb-2">Toggle entitlements for this plan.</p>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {sortedFeatures.map((f) => (
                    <label key={f.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={editingPlan.featureIds.includes(f.id)}
                        onCheckedChange={(c) => togglePlanFeature(editingPlanId!, f.id, c === true)}
                      />
                      <span>{f.name}</span>
                      <span className="text-muted-foreground font-mono text-xs">({f.code})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPlanDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="gradient-primary" onClick={savePlan}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={featureDeleteId != null} onOpenChange={(o) => !o && setFeatureDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove feature?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the feature from the catalog and unchecks it on all plans. Demo only — not persisted to the API.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (featureDeleteId) {
                  removeFeature(featureDeleteId);
                  toast.success("Feature removed.");
                }
                setFeatureDeleteId(null);
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={planDeleteId != null} onOpenChange={(o) => !o && setPlanDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete plan?</AlertDialogTitle>
            <AlertDialogDescription>
              Tenants still referencing this plan in the database would need migrating. Demo session only.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (planDeleteId) {
                  removePlan(planDeleteId);
                  toast.success("Plan removed.");
                }
                setPlanDeleteId(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PlatformLayout>
  );
}
