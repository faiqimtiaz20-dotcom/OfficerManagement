import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { mockDb } from "@/data/mockDb";

export type SubscriptionFeatureDef = {
  id: string;
  code: string;
  name: string;
  description: string;
  sortOrder: number;
};

export type SubscriptionPlanEditable = {
  id: string;
  code: string;
  name: string;
  description: string;
  billingInterval: "monthly" | "yearly";
  priceAmount: number;
  currency: string;
  maxUsers: number | null;
  maxSites: number | null;
  maxOfficers: number | null;
  sortOrder: number;
  featureIds: string[];
};

function normalizeCode(raw: string) {
  return raw.trim().toLowerCase().replace(/\s+/g, "_");
}

function cloneFromMock(): { features: SubscriptionFeatureDef[]; plans: SubscriptionPlanEditable[] } {
  return {
    features: mockDb.subscriptionFeaturesList.map((f) => ({ ...f })),
    plans: mockDb.subscriptionPlansList.map((p) => ({
      id: p.id,
      code: p.code,
      name: p.name,
      description: p.description,
      billingInterval: p.billingInterval,
      priceAmount: p.priceAmount,
      currency: p.currency,
      maxUsers: p.maxUsers,
      maxSites: p.maxSites,
      maxOfficers: p.maxOfficers,
      sortOrder: p.sortOrder,
      featureIds: [...p.featureIds],
    })),
  };
}

export type AddPlanInput = {
  code: string;
  name: string;
  description: string;
  billingInterval: "monthly" | "yearly";
  priceAmount: number;
  currency: string;
  maxUsers: number | null;
  maxSites: number | null;
  maxOfficers: number | null;
  sortOrder: number;
  featureIds?: string[];
};

type PlatformCatalogContextValue = {
  features: SubscriptionFeatureDef[];
  plans: SubscriptionPlanEditable[];
  sortedFeatures: SubscriptionFeatureDef[];
  sortedPlans: SubscriptionPlanEditable[];
  getPlanById: (id: string) => SubscriptionPlanEditable | undefined;
  getFeatureById: (id: string) => SubscriptionFeatureDef | undefined;
  addFeature: (input: { code: string; name: string; description: string; sortOrder: number }) => void;
  updateFeature: (id: string, patch: Partial<Omit<SubscriptionFeatureDef, "id">>) => void;
  removeFeature: (id: string) => void;
  addPlan: (input: AddPlanInput) => void;
  updatePlan: (id: string, patch: Partial<SubscriptionPlanEditable>) => void;
  removePlan: (id: string) => void;
  setPlanFeatures: (planId: string, featureIds: string[]) => void;
  togglePlanFeature: (planId: string, featureId: string, enabled: boolean) => void;
};

const PlatformCatalogContext = createContext<PlatformCatalogContextValue | undefined>(undefined);

export function PlatformCatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(cloneFromMock);

  const sortedFeatures = useMemo(
    () => [...state.features].sort((a, b) => a.sortOrder - b.sortOrder),
    [state.features]
  );
  const sortedPlans = useMemo(
    () => [...state.plans].sort((a, b) => a.sortOrder - b.sortOrder),
    [state.plans]
  );

  const getPlanById = useCallback(
    (id: string) => state.plans.find((p) => p.id === id),
    [state.plans]
  );
  const getFeatureById = useCallback(
    (id: string) => state.features.find((f) => f.id === id),
    [state.features]
  );

  const addFeature = useCallback((input: { code: string; name: string; description: string; sortOrder: number }) => {
    const id = crypto.randomUUID();
    setState((s) => ({
      ...s,
      features: [
        ...s.features,
        {
          id,
          code: normalizeCode(input.code),
          name: input.name.trim(),
          description: input.description.trim(),
          sortOrder: input.sortOrder,
        },
      ],
    }));
  }, []);

  const updateFeature = useCallback((id: string, patch: Partial<Omit<SubscriptionFeatureDef, "id">>) => {
    setState((s) => ({
      ...s,
      features: s.features.map((f) => {
        if (f.id !== id) return f;
        return {
          ...f,
          ...patch,
          ...(patch.code != null ? { code: normalizeCode(patch.code) } : {}),
          ...(patch.name != null ? { name: patch.name.trim() } : {}),
          ...(patch.description != null ? { description: patch.description.trim() } : {}),
        };
      }),
    }));
  }, []);

  const removeFeature = useCallback((id: string) => {
    setState((s) => ({
      features: s.features.filter((f) => f.id !== id),
      plans: s.plans.map((p) => ({ ...p, featureIds: p.featureIds.filter((fid) => fid !== id) })),
    }));
  }, []);

  const addPlan = useCallback((input: AddPlanInput) => {
    const id = crypto.randomUUID();
    const currency = input.currency.trim().toUpperCase().slice(0, 3) || "GBP";
    setState((s) => ({
      ...s,
      plans: [
        ...s.plans,
        {
          id,
          code: normalizeCode(input.code),
          name: input.name.trim(),
          description: input.description.trim(),
          billingInterval: input.billingInterval,
          priceAmount: input.priceAmount,
          currency,
          maxUsers: input.maxUsers,
          maxSites: input.maxSites,
          maxOfficers: input.maxOfficers,
          sortOrder: input.sortOrder,
          featureIds: [...(input.featureIds ?? [])],
        },
      ],
    }));
  }, []);

  const updatePlan = useCallback((id: string, patch: Partial<SubscriptionPlanEditable>) => {
    setState((s) => ({
      ...s,
      plans: s.plans.map((p) => {
        if (p.id !== id) return p;
        const next = { ...p, ...patch };
        if (patch.code != null) next.code = normalizeCode(patch.code);
        if (patch.name != null) next.name = patch.name.trim();
        if (patch.description != null) next.description = patch.description.trim();
        if (patch.currency != null) {
          next.currency = patch.currency.trim().toUpperCase().slice(0, 3) || "GBP";
        }
        return next;
      }),
    }));
  }, []);

  const removePlan = useCallback((planId: string) => {
    setState((s) => ({
      ...s,
      plans: s.plans.filter((p) => p.id !== planId),
    }));
  }, []);

  const setPlanFeatures = useCallback((planId: string, featureIds: string[]) => {
    setState((s) => ({
      ...s,
      plans: s.plans.map((p) => (p.id === planId ? { ...p, featureIds } : p)),
    }));
  }, []);

  const togglePlanFeature = useCallback((planId: string, featureId: string, enabled: boolean) => {
    setState((s) => ({
      ...s,
      plans: s.plans.map((p) => {
        if (p.id !== planId) return p;
        const set = new Set(p.featureIds);
        if (enabled) set.add(featureId);
        else set.delete(featureId);
        return { ...p, featureIds: [...set] };
      }),
    }));
  }, []);

  const value = useMemo(
    () => ({
      features: state.features,
      plans: state.plans,
      sortedFeatures,
      sortedPlans,
      getPlanById,
      getFeatureById,
      addFeature,
      updateFeature,
      removeFeature,
      addPlan,
      updatePlan,
      removePlan,
      setPlanFeatures,
      togglePlanFeature,
    }),
    [
      state.features,
      state.plans,
      sortedFeatures,
      sortedPlans,
      getPlanById,
      getFeatureById,
      addFeature,
      updateFeature,
      removeFeature,
      addPlan,
      updatePlan,
      removePlan,
      setPlanFeatures,
      togglePlanFeature,
    ]
  );

  return (
    <PlatformCatalogContext.Provider value={value}>{children}</PlatformCatalogContext.Provider>
  );
}

export function usePlatformCatalog() {
  const ctx = useContext(PlatformCatalogContext);
  if (!ctx) {
    throw new Error("usePlatformCatalog must be used within PlatformCatalogProvider");
  }
  return ctx;
}
