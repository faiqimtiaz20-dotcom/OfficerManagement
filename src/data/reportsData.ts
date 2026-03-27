import {
  Calendar,
  FileText,
  PieChart,
  Shield,
  TrendingUp,
  Users,
  PoundSterling,
  type LucideIcon,
} from "lucide-react";

export type ReportCategory = "Operational" | "Compliance" | "Financial";

export const REPORT_IDS = {
  SHIFT_ATTENDANCE: "shift-attendance",
  SITE_COVERAGE: "site-coverage",
  OFFICER_PERFORMANCE: "officer-performance",
  COMPLIANCE_SUMMARY: "compliance-summary",
  BS7858_OVERVIEW: "bs7858-overview",
  REVENUE_BY_CLIENT: "revenue-by-client",
  COST_VS_CHARGE: "cost-vs-charge",
} as const;

export type ReportId = (typeof REPORT_IDS)[keyof typeof REPORT_IDS];

export const reportsList: {
  id: ReportId;
  title: string;
  description: string;
  icon: LucideIcon;
  type: ReportCategory;
}[] = [
  {
    id: REPORT_IDS.SHIFT_ATTENDANCE,
    title: "Shift Attendance Report",
    description: "Weekly attendance, late arrivals, and no-shows",
    icon: Calendar,
    type: "Operational",
  },
  {
    id: REPORT_IDS.SITE_COVERAGE,
    title: "Site Coverage Report",
    description: "Shift coverage and staffing levels",
    icon: PieChart,
    type: "Operational",
  },
  {
    id: REPORT_IDS.OFFICER_PERFORMANCE,
    title: "Officer Performance",
    description: "Individual officer metrics and ratings",
    icon: Users,
    type: "Operational",
  },
  {
    id: REPORT_IDS.COMPLIANCE_SUMMARY,
    title: "Compliance Summary",
    description: "BS7858 and SIA compliance status overview",
    icon: FileText,
    type: "Compliance",
  },
  {
    id: REPORT_IDS.BS7858_OVERVIEW,
    title: "BS7858 Overview",
    description: "Screening and vetting progress by phase",
    icon: Shield,
    type: "Compliance",
  },
  {
    id: REPORT_IDS.REVENUE_BY_CLIENT,
    title: "Revenue by Client",
    description: "Monthly revenue breakdown by client",
    icon: PoundSterling,
    type: "Financial",
  },
  {
    id: REPORT_IDS.COST_VS_CHARGE,
    title: "Cost vs Charge Analysis",
    description: "Margin analysis by site and duty type",
    icon: TrendingUp,
    type: "Financial",
  },
];

export function canSeeReportCategory(role: string | undefined, category: ReportCategory): boolean {
  if (!role) return false;
  if (role === "ADMIN") return true;
  if (category === "Operational") return role === "OPS" || role === "SCHEDULER";
  if (category === "Compliance") return role === "HR";
  if (category === "Financial") return role === "FINANCE";
  return false;
}

export function getReportById(id: string) {
  return reportsList.find((r) => r.id === id);
}

export const mockAttendanceRows = [
  { week: "Week of 27 Jan", totalShifts: 312, onTime: 298, late: 10, noShow: 4, rate: "95.5%" },
  { week: "Week of 3 Feb", totalShifts: 308, onTime: 299, late: 6, noShow: 3, rate: "97.1%" },
  { week: "Week of 10 Feb", totalShifts: 315, onTime: 306, late: 5, noShow: 4, rate: "97.1%" },
];

export const mockSiteCoverageRows = [
  { site: "Westfield Shopping Centre", required: 6, filled: 6, coverage: "100%" },
  { site: "HSBC Tower", required: 12, filled: 11, coverage: "92%" },
  { site: "Royal Hospital", required: 5, filled: 5, coverage: "100%" },
  { site: "Tech Park Building A", required: 3, filled: 2, coverage: "67%" },
];

export const mockOfficerPerfRows = [
  { officer: "James Wilson", shifts: 22, onTime: 22, rating: "Excellent" },
  { officer: "Sarah Connor", shifts: 20, onTime: 19, rating: "Good" },
  { officer: "Michael Brown", shifts: 18, onTime: 17, rating: "Good" },
];

export const mockComplianceRows = [
  { status: "Compliant", count: 128, percentage: "82%" },
  { status: "Pending screening", count: 18, percentage: "12%" },
  { status: "Expired / Action needed", count: 10, percentage: "6%" },
];

export const mockBS7858Rows = [
  { phase: "Initial screening", complete: 145, inProgress: 8, pending: 3 },
  { phase: "Full screening", complete: 128, inProgress: 12, pending: 16 },
];

export const mockRevenueRows = [
  { client: "Westfield Corporation", revenue: "£48,200", shifts: 312 },
  { client: "HSBC Holdings", revenue: "£62,100", shifts: 408 },
  { client: "NHS Trust", revenue: "£38,500", shifts: 280 },
];

export const mockCostChargeRows = [
  { site: "Westfield", charge: "£14.50", cost: "£11.20", margin: "23%" },
  { site: "HSBC Tower", charge: "£15.00", cost: "£11.50", margin: "23%" },
];
