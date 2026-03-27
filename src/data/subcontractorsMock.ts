import { mockDb } from "@/data/mockDb";

export interface ContactPerson {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface SubcontractorDocument {
  id: string;
  name: string;
  file: string;
  date: string;
}

/** Read-only history of site coverage (user cannot add/delete from UI). */
export interface SiteCoverageHistoryEntry {
  siteId: string;
  siteName: string;
  from: string;
  to?: string;
}

export interface Subcontractor {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "pending";
  notes?: string;
  // Company details
  companyAddress?: string;
  companyRegNumber?: string;
  vatNumber?: string;
  // Contact persons (multiple)
  contactPersons?: ContactPerson[];
  // Officer IDs assigned to this subcontractor
  officerIds?: string[];
  // Site IDs this subcontractor currently covers (read-only display)
  siteIds?: string[];
  // History of sites covered (read-only)
  siteCoverageHistory?: SiteCoverageHistoryEntry[];
  // Documents
  documents?: SubcontractorDocument[];
}

/** Main/direct contractor – used for direct employees (not from a subcontractor). */
export const MAIN_CONTRACTOR_ID = "main";

export const subcontractorsList: Subcontractor[] = mockDb.subcontractorsList as unknown as Subcontractor[];

export function getSubcontractorById(id: string): Subcontractor | undefined {
  return subcontractorsList.find((s) => s.id === id);
}
