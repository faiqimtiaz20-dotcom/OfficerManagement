import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface DutyTypeOption {
  id: string;
  name: string;
}

const defaultDutyTypes: DutyTypeOption[] = [
  { id: "1", name: "Security" },
  { id: "2", name: "Cleaning" },
  { id: "3", name: "Site supervisor" },
  { id: "4", name: "Site manager" },
  { id: "5", name: "Fire marshal" },
  { id: "6", name: "Receptionist" },
  { id: "7", name: "CCTV operator" },
  { id: "8", name: "Mobile patrolling" },
  { id: "9", name: "Dog handling" },
  { id: "10", name: "Other" },
];

interface DutyTypesContextValue {
  dutyTypes: DutyTypeOption[];
  addDutyType: (name: string) => void;
  updateDutyType: (id: string, name: string) => void;
  removeDutyType: (id: string) => void;
  getById: (id: string) => DutyTypeOption | undefined;
}

const DutyTypesContext = createContext<DutyTypesContextValue | null>(null);

export function DutyTypesProvider({ children }: { children: ReactNode }) {
  const [dutyTypes, setDutyTypes] = useState<DutyTypeOption[]>(defaultDutyTypes);

  const addDutyType = useCallback((name: string) => {
    setDutyTypes((prev) => [
      ...prev,
      { id: String(Date.now()), name: name.trim() },
    ]);
  }, []);

  const updateDutyType = useCallback((id: string, name: string) => {
    setDutyTypes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name: name.trim() } : t))
    );
  }, []);

  const removeDutyType = useCallback((id: string) => {
    setDutyTypes((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getById = useCallback(
    (id: string) => dutyTypes.find((t) => t.id === id),
    [dutyTypes]
  );

  const value: DutyTypesContextValue = {
    dutyTypes,
    addDutyType,
    updateDutyType,
    removeDutyType,
    getById,
  };

  return (
    <DutyTypesContext.Provider value={value}>
      {children}
    </DutyTypesContext.Provider>
  );
}

export function useDutyTypes() {
  const ctx = useContext(DutyTypesContext);
  if (!ctx) throw new Error("useDutyTypes must be used within DutyTypesProvider");
  return ctx;
}
