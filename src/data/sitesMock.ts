import { mockDb } from "@/data/mockDb";

export interface SiteContactPerson {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface SiteDocument {
  id: string;
  name: string;
  file: string;
  date: string;
}

export interface SiteRateCard {
  dayRate?: number;
  nightRate?: number;
  weekendRate?: number;
  bankHolidayRate?: number;
  currency?: string;
  /** Rate per hour by duty type id (from Settings > Duty / Shifts types). */
  ratesByDutyType?: Record<string, number>;
}

export interface Site {
  id: string;
  name: string;
  address: string;
  /** Client id from clientsMock – site belongs to this client. */
  clientId: string;
  status: "active" | "inactive";
  currentShifts: number;
  /** Email for book-on (e.g. booking on to a shift). */
  bookonEmail?: string;
  /** Primary site contact (legacy single contact). */
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  /** Additional contact persons at this site. */
  contactPersons?: SiteContactPerson[];
  notes?: string[];
  rateCard?: SiteRateCard;
  sop?: string;
  documents?: SiteDocument[];
  /** Officer ids preferred for this site. */
  preferredOfficerIds?: string[];
  /** Require check calls during shift (call tracking). */
  checkCallEnabled?: boolean;
  /** Minutes between check calls when checkCallEnabled is true. */
  checkCallIntervalMinutes?: number;
}

export const sitesList: Site[] = mockDb.sitesList as unknown as Site[];

export function getSiteById(id: string): Site | undefined {
  return sitesList.find((s) => s.id === id);
}

export function getSitesByClientId(clientId: string): Site[] {
  return sitesList.filter((s) => s.clientId === clientId);
}
