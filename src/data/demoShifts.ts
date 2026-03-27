import { mockDb } from "@/data/mockDb";

/** Shift shape shared by Scheduling, Timesheet Reconciliation, and Create Invoice */
export interface DemoShift {
  id: string;
  clientId: string;
  clientName: string;
  managerName: string;
  site: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  guardId: string;
  guardName: string;
  branch: string;
  hours: number;
  status: "confirmed" | "pending" | "unassigned";
  createdBy: string;
  dutyTypeName?: string;
  breakMinutes?: number | string;
  chargeRate?: number | string;
  payRate?: number | string;
  currency?: string;
  precheckDue?: string;
  bookOnWindow?: string;
  checkCallSummary?: string;
}

/** Build demo shifts from sites, clients, and officers (single source for reconciliation & invoice) */
export function buildDemoShifts(): DemoShift[] {
  return (mockDb.demoShifts as unknown as DemoShift[]).map((s) => ({ ...s }));
}
