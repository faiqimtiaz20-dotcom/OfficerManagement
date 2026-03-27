import { createContext, useCallback, useContext, useState } from "react";

interface ApprovedShiftsContextValue {
  approvedShiftIds: Set<string>;
  isApproved: (id: string) => boolean;
  setApproved: (id: string, approved: boolean) => void;
  setApprovedMany: (ids: string[], approved: boolean) => void;
}

const ApprovedShiftsContext = createContext<ApprovedShiftsContextValue | null>(null);

const STORAGE_KEY = "guardforce_approved_shift_ids";

function loadPersisted(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw) as string[];
      return new Set(Array.isArray(arr) ? arr : []);
    }
  } catch {
    // ignore
  }
  return new Set();
}

function persist(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // ignore
  }
}

export function ApprovedShiftsProvider({ children }: { children: React.ReactNode }) {
  const [approvedShiftIds, setApprovedShiftIds] = useState<Set<string>>(loadPersisted);

  const isApproved = useCallback(
    (id: string) => approvedShiftIds.has(id),
    [approvedShiftIds]
  );

  const setApproved = useCallback((id: string, approved: boolean) => {
    setApprovedShiftIds((prev) => {
      const next = new Set(prev);
      if (approved) next.add(id);
      else next.delete(id);
      persist(next);
      return next;
    });
  }, []);

  const setApprovedMany = useCallback((ids: string[], approved: boolean) => {
    setApprovedShiftIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => (approved ? next.add(id) : next.delete(id)));
      persist(next);
      return next;
    });
  }, []);

  return (
    <ApprovedShiftsContext.Provider
      value={{ approvedShiftIds, isApproved, setApproved, setApprovedMany }}
    >
      {children}
    </ApprovedShiftsContext.Provider>
  );
}

export function useApprovedShifts() {
  const ctx = useContext(ApprovedShiftsContext);
  if (!ctx) {
    throw new Error("useApprovedShifts must be used within ApprovedShiftsProvider");
  }
  return ctx;
}
