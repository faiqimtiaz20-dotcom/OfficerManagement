import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface OfficerTypeOption {
  id: string;
  name: string;
  requiresLicence: boolean;
}

const defaultOfficerTypes: OfficerTypeOption[] = [
  { id: "1", name: "CCTV OPERATOR", requiresLicence: true },
  { id: "2", name: "CLEANERS", requiresLicence: false },
  { id: "3", name: "CLOSE PROTECTION", requiresLicence: true },
  { id: "4", name: "CONSTRUCTION", requiresLicence: false },
  { id: "5", name: "Dog Handler", requiresLicence: true },
  { id: "6", name: "DOOR SUPERVISOR", requiresLicence: true },
  { id: "7", name: "FIRE MARSHALL", requiresLicence: false },
  { id: "8", name: "LFT Tester", requiresLicence: false },
  { id: "9", name: "PERSONAL LICENCE", requiresLicence: false },
  { id: "10", name: "SECURITY GUARD", requiresLicence: true },
  { id: "11", name: "STEWARD", requiresLicence: true },
];

interface OfficerTypesContextValue {
  officerTypes: OfficerTypeOption[];
  addOfficerType: (name: string, requiresLicence: boolean) => void;
  updateOfficerType: (id: string, name: string, requiresLicence: boolean) => void;
  removeOfficerType: (id: string) => void;
  getById: (id: string) => OfficerTypeOption | undefined;
  getRequiresLicence: (nameOrId: string) => boolean;
}

const OfficerTypesContext = createContext<OfficerTypesContextValue | null>(null);

export function OfficerTypesProvider({ children }: { children: ReactNode }) {
  const [officerTypes, setOfficerTypes] = useState<OfficerTypeOption[]>(defaultOfficerTypes);

  const addOfficerType = useCallback((name: string, requiresLicence: boolean) => {
    setOfficerTypes((prev) => [
      ...prev,
      { id: String(Date.now()), name: name.trim(), requiresLicence },
    ]);
  }, []);

  const updateOfficerType = useCallback((id: string, name: string, requiresLicence: boolean) => {
    setOfficerTypes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name: name.trim(), requiresLicence } : t))
    );
  }, []);

  const removeOfficerType = useCallback((id: string) => {
    setOfficerTypes((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getById = useCallback(
    (id: string) => officerTypes.find((t) => t.id === id),
    [officerTypes]
  );

  const getRequiresLicence = useCallback(
    (nameOrId: string) => {
      const byId = officerTypes.find((t) => t.id === nameOrId);
      if (byId) return byId.requiresLicence;
      const byName = officerTypes.find(
        (t) => t.name.toLowerCase() === nameOrId.toLowerCase()
      );
      return byName?.requiresLicence ?? false;
    },
    [officerTypes]
  );

  const value: OfficerTypesContextValue = {
    officerTypes,
    addOfficerType,
    updateOfficerType,
    removeOfficerType,
    getById,
    getRequiresLicence,
  };

  return (
    <OfficerTypesContext.Provider value={value}>
      {children}
    </OfficerTypesContext.Provider>
  );
}

export function useOfficerTypes() {
  const ctx = useContext(OfficerTypesContext);
  if (!ctx) throw new Error("useOfficerTypes must be used within OfficerTypesProvider");
  return ctx;
}
