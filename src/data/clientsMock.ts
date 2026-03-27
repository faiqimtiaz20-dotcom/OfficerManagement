import { mockDb } from "@/data/mockDb";

export interface ClientContactPerson {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface ClientDocument {
  id: string;
  name: string;
  file: string;
  date: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  industry: string;
  sites: number;
  activeShifts: number;
  status: "active" | "inactive";
  since: string;
  /** Company registration number (e.g. Companies House). */
  companyRegNumber?: string;
  /** VAT registration number. */
  vatNumber?: string;
  /** Company registered address (e.g. at Companies House). */
  companyRegisteredAddress?: string;
  /** Company website URL. */
  website?: string;
  /** Default base rate for this client (e.g. per hour, in GBP). */
  defaultBaseRate?: number;
  contactPersons?: ClientContactPerson[];
  documents?: ClientDocument[];
  notes?: string[];
  siteNames?: string[];
}

export const clientsList: Client[] = mockDb.clientsList as unknown as Client[];

export function getClientById(id: string): Client | undefined {
  return clientsList.find((c) => c.id === id);
}
