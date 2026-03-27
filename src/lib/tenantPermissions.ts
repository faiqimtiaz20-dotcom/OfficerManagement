import type { Role } from "@/context/AuthContext";

/** Software / platform operator — creates and manages tenant companies (not day-to-day CRM). */
export function isPlatformSuperAdmin(role: Role | undefined): boolean {
  return role === "SUPER_ADMIN";
}

/** Full administrator for the current tenant (company). */
export function isTenantCompanyAdmin(role: Role | undefined): boolean {
  return role === "ADMIN";
}

/** Tenant-level powers previously tied to a single “super admin” in the CRM. */
export function hasTenantFullAccess(role: Role | undefined): boolean {
  return role === "ADMIN";
}
