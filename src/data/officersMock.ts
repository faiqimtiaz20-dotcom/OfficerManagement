import { mockDb } from "@/data/mockDb";

export interface Officer {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** Officer type id from settings (e.g. SECURITY GUARD, DOOR SUPERVISOR). */
  officerTypeId?: string;
  /** Subcontractor id if officer is supplied by a subcontractor. */
  subcontractorId?: string;
  /** Job title / position (e.g. Security Officer, Door Supervisor). */
  position?: string;
  /** Sides this officer has previously worked (for preferred side). */
  previousSides?: OfficerPreviousSide[];
  siaLicense: string;
  siaExpiry: string;
  status: "active" | "pending" | "suspended";
  complianceStatus: "compliant" | "pending" | "expired";
  avatar?: string;
  /** Basic info (BS7858 / profile). */
  dateOfBirth?: string;
  address?: string;
  niNumber?: string;
}

/** BS7858 screening checklist item (editable per officer) */
export interface BS7858Step {
  id: string;
  label: string;
  done: boolean;
  completedDate?: string;
  /** Phase per BS7858: initial (before limited screening) or full_screening */
  phase: "initial" | "full_screening";
}

/** Employment reference status for screening workflow */
export type EmploymentReferenceStatus = "pending" | "contacted" | "screening_completed" | "verified";

/** Employment reference for background check */
export interface EmploymentReference {
  id: string;
  requestedDate: string;
  noOfRequests: number;
  company: string;
  phone: string;
  email: string;
  from: string;
  to: string;
  confirmedDatesFrom: string;
  confirmedDatesTo: string;
  comments: string;
  status: EmploymentReferenceStatus;
}

/** Vetting log entry */
export interface VettingLogEntry {
  id: string;
  date: string;
  action: string;
  outcome: string;
  by: string;
}

/** Bank details for payroll */
export interface BankDetails {
  accountName: string;
  sortCode: string;
  accountNumber: string;
}

/** Previous side worked by an officer (for preferred side). */
export interface OfficerPreviousSide {
  sideName: string;
  clientName: string;
  totalHours: number;
  lastShiftDate: string;
}

export const officersList: Officer[] = mockDb.officersList as unknown as Officer[];

export function getOfficerById(id: string): Officer | undefined {
  return officersList.find((o) => o.id === id);
}
