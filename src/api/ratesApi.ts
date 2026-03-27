import type { Site } from "@/data/sitesMock";
import { getClientById } from "@/data/mockDb";

/**
 * Response from backend for shift rates (charge = what we charge client, pay = what we pay officer).
 * Replace this with a real API call when backend is ready.
 */
export interface ShiftRates {
  chargeRate: number;
  payRate: number;
  currency: string;
}

/**
 * Fetches charge rate and pay rate for a shift at a given site and duty type.
 * In production this would call the backend; for now it uses site rate card and client defaults.
 */
export async function fetchRatesForShift(
  site: Site | undefined,
  dutyTypeId: string
): Promise<ShiftRates> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 200));

  const chargeRate =
    site?.rateCard?.ratesByDutyType?.[dutyTypeId] ??
    getClientById(site?.clientId ?? "")?.defaultBaseRate ??
    14.5;
  // Pay rate: in production from backend; for now use ~75% of charge as mock pay
  const payRate = chargeRate * 0.75;

  return {
    chargeRate: Number(chargeRate),
    payRate: Number(payRate),
    currency: site?.rateCard?.currency ?? "GBP",
  };
}
