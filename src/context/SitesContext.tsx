import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type Site } from "@/data/sitesMock";
import { mockDb } from "@/data/mockDb";

type SitesContextValue = {
  sites: Site[];
  getSiteById: (id: string) => Site | undefined;
  getSitesByClientId: (clientId: string) => Site[];
  addSite: (site: Omit<Site, "id">) => Site;
  updateSite: (id: string, patch: Partial<Omit<Site, "id">>) => void;
  removeSite: (id: string) => void;
};

const SitesContext = createContext<SitesContextValue | null>(null);

export function SitesProvider({ children }: { children: ReactNode }) {
  const [sites, setSites] = useState<Site[]>(() => [...(mockDb.sitesList as unknown as Site[])]);

  const getSiteById = useCallback(
    (id: string) => sites.find((s) => s.id === id),
    [sites]
  );

  const getSitesByClientId = useCallback(
    (clientId: string) => sites.filter((s) => s.clientId === clientId),
    [sites]
  );

  const addSite = useCallback((site: Omit<Site, "id">) => {
    const newId = String(
      Math.max(...sites.map((s) => Number(s.id) || 0), 0) + 1
    );
    const newSite: Site = { ...site, id: newId };
    setSites((prev) => [...prev, newSite]);
    return newSite;
  }, [sites]);

  const updateSite = useCallback((id: string, patch: Partial<Omit<Site, "id">>) => {
    setSites((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
  }, []);

  const removeSite = useCallback((id: string) => {
    setSites((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const value: SitesContextValue = {
    sites,
    getSiteById,
    getSitesByClientId,
    addSite,
    updateSite,
    removeSite,
  };

  return (
    <SitesContext.Provider value={value}>{children}</SitesContext.Provider>
  );
}

export function useSites() {
  const ctx = useContext(SitesContext);
  if (!ctx) throw new Error("useSites must be used within SitesProvider");
  return ctx;
}
