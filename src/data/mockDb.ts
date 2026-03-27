export type MockAuthRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "HR"
  | "OPS"
  | "SCHEDULER"
  | "FINANCE"
  | "OFFICER";

export type MockAuthAccount = {
  role: MockAuthRole;
  id: string;
  name: string;
  email: string;
  username: string | null;
  /** Demo only — production APIs must verify `app_user.password_hash`. */
  demoPassword: string;
};

const AUTH_ACCOUNTS: MockAuthAccount[] = [
  {
    role: "SUPER_ADMIN",
    id: "1",
    name: "Super Administrator",
    email: "platform.admin@guardforce.local",
    username: "platformadmin",
    demoPassword: "password",
  },
  {
    role: "ADMIN",
    id: "7",
    name: "Company Admin",
    email: "admin@guardforce.local",
    username: "companyadmin",
    demoPassword: "password",
  },
  { role: "HR", id: "2", name: "HR Manager", email: "hr.manager@guardforce.local", username: "hrmanager", demoPassword: "password" },
  { role: "OPS", id: "3", name: "Operations Manager", email: "ops.manager@guardforce.local", username: "opsmanager", demoPassword: "password" },
  { role: "SCHEDULER", id: "4", name: "Scheduler", email: "scheduler@guardforce.local", username: "scheduler", demoPassword: "password" },
  { role: "FINANCE", id: "5", name: "Finance User", email: "finance@guardforce.local", username: "finance", demoPassword: "password" },
  { role: "OFFICER", id: "6", name: "Officer", email: "officer@guardforce.local", username: null, demoPassword: "password" },
];

function normalizeLoginIdentifier(raw: string): string {
  return raw.trim().toLowerCase();
}

/** Resolves demo login by email or username (case-insensitive). */
export function resolveDemoLogin(
  identifier: string,
  password: string
): { id: string; name: string; role: MockAuthRole } | null {
  const idNorm = normalizeLoginIdentifier(identifier);
  if (!idNorm || !password) return null;
  const acct = AUTH_ACCOUNTS.find(
    (a) =>
      normalizeLoginIdentifier(a.email) === idNorm ||
      (a.username != null && normalizeLoginIdentifier(a.username) === idNorm)
  );
  if (!acct || acct.demoPassword !== password) return null;
  return { id: acct.id, name: acct.name, role: acct.role };
}

const authUsersRecord = Object.fromEntries(
  AUTH_ACCOUNTS.map((a) => [a.role, { id: a.id, name: a.name, role: a.role }])
) as Record<MockAuthRole, { id: string; name: string; role: MockAuthRole }>;

export const mockDb = {
  clientsList: [
    {
      id: "1",
      name: "Westfield Corporation",
      email: "security@westfield.co.uk",
      phone: "+44 20 7946 0123",
      address: "Westfield Ave, London E20 1EJ",
      companyRegNumber: "01234567",
      vatNumber: "GB 123 4567 89",
      companyRegisteredAddress: "Westfield House, 1 Ariel Way, London W12 7SL",
      website: "https://www.westfield.com",
      industry: "Retail",
      sites: 3,
      activeShifts: 24,
      status: "active",
      since: "2023-01-15",
      contactPersons: [
        { id: "c1", name: "John Manager", role: "Security Lead", email: "john.m@westfield.co.uk", phone: "+44 20 7946 0124" },
        { id: "c2", name: "Sarah Lee", role: "Facilities", email: "sarah.lee@westfield.co.uk", phone: "+44 20 7946 0125" },
      ],
      documents: [
        { id: "d1", name: "Contract", file: "Westfield_Contract_2023.pdf", date: "2023-01-15" },
        { id: "d2", name: "SLA", file: "SLA_Westfield.pdf", date: "2023-02-01" },
      ],
      notes: ["Primary contact: John Manager (Security).", "Contract renewed until Dec 2026."],
      siteNames: ["Westfield Shopping Centre", "Westfield Stratford", "Westfield London"],
      defaultBaseRate: 14.5,
    },
    { id: "2", name: "HSBC Holdings", email: "facilities@hsbc.com", phone: "+44 20 7991 8888", address: "8 Canada Square, London E14 5HQ", companyRegNumber: "00012465", vatNumber: "GB 888 8888 88", companyRegisteredAddress: "8 Canada Square, London E14 5HQ", website: "https://www.hsbc.com", industry: "Corporate & Office", sites: 5, activeShifts: 48, status: "active", since: "2022-06-01", contactPersons: [{ id: "c1", name: "Mike Roberts", role: "Head of Security", email: "mike.roberts@hsbc.com", phone: "+44 20 7991 8889" }], documents: [{ id: "d1", name: "Contract", file: "HSBC_Security_Contract.pdf", date: "2022-06-01" }], notes: ["24/7 coverage required at main building."], siteNames: ["HSBC Tower", "Canada Square East", "Canada Square West", "Canary Wharf Hub", "Data Centre"], defaultBaseRate: 15.0 },
    { id: "3", name: "NHS Trust", email: "estates@nhs.uk", phone: "+44 111 234 5678", address: "Wellington Road, London NW8 9LE", companyRegNumber: "NHS Trust", vatNumber: "GB 123 4567 89", companyRegisteredAddress: "Wellington House, 133-155 Waterloo Road, London SE1 8UG", website: "https://www.nhs.uk", industry: "Healthcare", sites: 4, activeShifts: 36, status: "active", since: "2022-09-20", contactPersons: [{ id: "c1", name: "Dr. Emma Watson", role: "Estates Manager", email: "emma.watson@nhs.uk", phone: "+44 111 234 5679" }], documents: [], notes: ["BS7858 vetting required for all officers."], siteNames: ["Royal Hospital", "Community Clinic A", "Community Clinic B", "Admin Building"] },
    { id: "4", name: "TechCorp Ltd", email: "reception@techcorp.com", phone: "+44 161 555 0100", address: "1 Science Park, Manchester M15 6JA", companyRegNumber: "09876543", vatNumber: "GB 987 6543 21", companyRegisteredAddress: "1 Science Park, Manchester M15 6JA", website: "https://www.techcorp.com", industry: "Corporate & Office", sites: 2, activeShifts: 12, status: "active", since: "2024-03-10", contactPersons: [{ id: "c1", name: "James Chen", role: "Office Manager", email: "james.chen@techcorp.com", phone: "+44 161 555 0101" }], documents: [{ id: "d1", name: "Contract", file: "TechCorp_2024.pdf", date: "2024-03-10" }], notes: [], siteNames: ["Science Park HQ", "R&D Building"] },
    { id: "5", name: "Transport for London", email: "security@tfl.gov.uk", phone: "+44 343 222 1234", address: "Windsor House, 42-50 Victoria St, London SW1H 0TL", companyRegNumber: "Public body", vatNumber: "GB 123 4567 89", companyRegisteredAddress: "Windsor House, 42-50 Victoria Street, London SW1H 0TL", website: "https://tfl.gov.uk", industry: "Transport & Logistics", sites: 8, activeShifts: 64, status: "active", since: "2021-11-01", contactPersons: [{ id: "c1", name: "David Brown", role: "Security Manager", email: "david.brown@tfl.gov.uk", phone: "+44 343 222 1235" }], documents: [{ id: "d1", name: "Framework Agreement", file: "TfL_Framework.pdf", date: "2021-11-01" }], notes: ["Multiple station coverage. Shift patterns vary by site."], siteNames: ["Metro Station Central", "Victoria Station", "King's Cross", "Paddington", "Liverpool Street", "Waterloo", "London Bridge", "Euston"] },
    { id: "6", name: "Property Holdings", email: "enquiries@propertyholdings.com", phone: "+44 20 7123 4567", address: "12 Commercial Rd, London E1 1LY", companyRegNumber: "11223344", vatNumber: "GB 112 2334 45", companyRegisteredAddress: "12 Commercial Road, London E1 1LY", website: "https://www.propertyholdings.com", industry: "Construction", sites: 1, activeShifts: 0, status: "inactive", since: "2024-01-05", contactPersons: [], documents: [], notes: ["Contract on hold from Jan 2024."], siteNames: ["Old Warehouse"] },
  ],
  sitesList: [
    { id: "1", name: "Westfield Shopping Centre", address: "Ariel Way, London W12 7GF", clientId: "1", status: "active", currentShifts: 6, bookonEmail: "bookon@westfield.com", contact: { name: "John Manager", phone: "+44 20 7123 4567", email: "security@westfield.com" }, contactPersons: [{ id: "sc1-1", name: "John Manager", role: "Security Lead", email: "john.m@westfield.co.uk", phone: "+44 20 7946 0124" }, { id: "sc1-2", name: "Kate Reception", role: "Reception", email: "kate@westfield.com", phone: "+44 20 7123 4568" }], notes: ["Key holder: John Manager – collect from reception.", "Access code for side gate: 4521."], rateCard: { dayRate: 14.5, nightRate: 16.0, weekendRate: 17.0, bankHolidayRate: 20.0, currency: "GBP" }, sop: "1. Report to control room on arrival.\n2. Complete handover with outgoing officer.\n3. Conduct hourly patrols of zones A–C.\n4. Log all incidents in the daily report.\n5. Emergency contact: Control 020 7123 4567.", documents: [{ id: "sd1-1", name: "Site plan", file: "Westfield_Site_Plan.pdf", date: "2023-01-15" }, { id: "sd1-2", name: "Risk assessment", file: "Westfield_RA.pdf", date: "2023-06-01" }], preferredOfficerIds: ["1", "2", "5"], checkCallEnabled: true, checkCallIntervalMinutes: 60 },
    { id: "2", name: "HSBC Tower", address: "8 Canada Square, London E14 5HQ", clientId: "2", status: "active", currentShifts: 12, bookonEmail: "bookon@hsbc.com", contact: { name: "Sarah Admin", phone: "+44 20 7456 7890", email: "facilities@hsbc.com" }, contactPersons: [{ id: "sc2-1", name: "Sarah Admin", role: "Facilities", email: "sarah.admin@hsbc.com", phone: "+44 20 7456 7890" }], notes: ["Badge collection at reception. Return at end of shift."], rateCard: { dayRate: 15.0, nightRate: 17.0, weekendRate: 18.0, currency: "GBP" }, sop: "1. Sign in at security desk.\n2. Collect access badge.\n3. Patrol floors as per rota.\n4. Report any incidents to control room.", documents: [{ id: "sd2-1", name: "Site plan", file: "HSBC_Site_Plan.pdf", date: "2023-02-01" }], preferredOfficerIds: ["3", "4"], checkCallEnabled: false, checkCallIntervalMinutes: 60 },
    { id: "3", name: "Royal Hospital", address: "Royal Hospital Road, London SW3 4SR", clientId: "3", status: "active", currentShifts: 5, bookonEmail: "bookon@royalhospital.nhs.uk", contact: { name: "Dr. Williams", phone: "+44 20 7891 2345", email: "security@royalhospital.nhs.uk" }, contactPersons: [{ id: "sc3-1", name: "Dr. Williams", role: "Security Lead", email: "security@royalhospital.nhs.uk", phone: "+44 20 7891 2345" }], notes: ["NHS site – DBS required. Uniform provided on site."], rateCard: { dayRate: 13.75, nightRate: 15.25, weekendRate: 16.5, bankHolidayRate: 19.0, currency: "GBP" }, sop: "1. Report to main security office.\n2. Collect radio and keys.\n3. Hourly patrols of designated areas.\n4. Escort duties as requested.", documents: [], preferredOfficerIds: ["1", "6"] },
    { id: "4", name: "Tech Park Building A", address: "Cambridge Science Park, CB4 0WS", clientId: "4", status: "active", currentShifts: 3, bookonEmail: "bookon@techcorp.com", contact: { name: "Mike Tech", phone: "+44 1223 456789", email: "admin@techcorp.com" } },
    { id: "5", name: "Metro Station Central", address: "King's Cross, London N1 9AL", clientId: "5", status: "active", currentShifts: 10, bookonEmail: "bookon@tfl.gov.uk", contact: { name: "TfL Security", phone: "+44 343 222 1234", email: "security@tfl.gov.uk" } },
    { id: "6", name: "Old Warehouse", address: "Dock Street, London E1 8JH", clientId: "6", status: "inactive", currentShifts: 0, bookonEmail: "bookon@property.com", contact: { name: "Admin", phone: "+44 20 7000 0000", email: "info@property.com" } },
  ],
  officersList: [
    { id: "1", name: "James Wilson", email: "james.wilson@email.com", phone: "+44 7700 900123", siaLicense: "1234567890123456", siaExpiry: "2027-03-15", status: "active", complianceStatus: "compliant", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", officerTypeId: "10", position: "Security Officer", previousSides: [{ sideName: "North Gate", clientName: "ABC Retail Ltd", totalHours: 124, lastShiftDate: "2025-01-28" }, { sideName: "Main Entrance", clientName: "ABC Retail Ltd", totalHours: 86, lastShiftDate: "2025-01-25" }, { sideName: "Loading Bay", clientName: "XYZ Logistics", totalHours: 42, lastShiftDate: "2024-12-15" }, { sideName: "Car Park A", clientName: "Metro Centre", totalHours: 68, lastShiftDate: "2025-01-20" }], dateOfBirth: "1985-03-12", address: "24 Oak Lane, London E1 4AB", niNumber: "AB 12 34 56 C" },
    { id: "2", name: "Sarah Connor", email: "sarah.connor@email.com", phone: "+44 7700 900456", officerTypeId: "6", position: "Door Supervisor", previousSides: [{ sideName: "Main Entrance", clientName: "Grand Hotel", totalHours: 96, lastShiftDate: "2025-01-30" }, { sideName: "VIP Lounge", clientName: "Grand Hotel", totalHours: 52, lastShiftDate: "2025-01-22" }], dateOfBirth: "1990-07-22", address: "8 Park Road, Birmingham B2 1AA", niNumber: "CD 78 90 12 E", siaLicense: "2345678901234567", siaExpiry: "2026-08-20", status: "active", complianceStatus: "compliant", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
    { id: "3", name: "Michael Brown", email: "michael.brown@email.com", phone: "+44 7700 900789", previousSides: [{ sideName: "Reception", clientName: "Tech Park", totalHours: 78, lastShiftDate: "2025-01-18" }, { sideName: "North Gate", clientName: "ABC Retail Ltd", totalHours: 34, lastShiftDate: "2024-11-10" }], siaLicense: "3456789012345678", siaExpiry: "2026-02-28", status: "active", complianceStatus: "pending" },
    { id: "4", name: "Emma Davis", email: "emma.davis@email.com", phone: "+44 7700 900321", siaLicense: "4567890123456789", siaExpiry: "2026-01-10", status: "suspended", complianceStatus: "expired", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
    { id: "5", name: "Robert Taylor", email: "robert.taylor@email.com", phone: "+44 7700 900654", siaLicense: "5678901234567890", siaExpiry: "2027-06-01", status: "active", complianceStatus: "compliant", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
    { id: "6", name: "Lucy Martinez", email: "lucy.martinez@email.com", phone: "+44 7700 900987", siaLicense: "6789012345678901", siaExpiry: "2026-12-15", status: "pending", complianceStatus: "pending" },
  ],
  subcontractorsList: [
    { id: "main", companyName: "Main (direct officers)", contactName: "", email: "", phone: "", status: "active" },
    { id: "1", companyName: "SecureGuard Solutions Ltd", contactName: "David Moore", email: "david.moore@secureguard.co.uk", phone: "+44 7700 901234", status: "active", notes: "CCTV and static guard provision", companyAddress: "12 Security House, London E1 6AN", companyRegNumber: "09876543", vatNumber: "GB 987654321", contactPersons: [{ id: "c1", name: "David Moore", role: "Director", email: "david.moore@secureguard.co.uk", phone: "+44 7700 901234" }, { id: "c2", name: "Emma Clark", role: "Operations", email: "emma@secureguard.co.uk", phone: "+44 7700 901235" }], officerIds: ["1", "2"], siteIds: ["1", "2"], siteCoverageHistory: [{ siteId: "1", siteName: "Westfield Shopping Centre", from: "2024-01-15", to: "2025-02-01" }, { siteId: "2", siteName: "HSBC Tower", from: "2024-03-01" }, { siteId: "3", siteName: "Royal Hospital", from: "2023-06-01", to: "2024-12-31" }], documents: [{ id: "d1", name: "Insurance certificate", file: "Insurance_2025.pdf", date: "2025-01-15" }, { id: "d2", name: "Contract", file: "Contract_SecureGuard.pdf", date: "2024-06-01" }] },
    { id: "2", companyName: "NightWatch Security", contactName: "Lisa Patel", email: "lisa.patel@nightwatch.co.uk", phone: "+44 7700 902345", status: "active", companyAddress: "5 Night Watch Lane, Birmingham B1 1AA", companyRegNumber: "11223344", contactPersons: [{ id: "c3", name: "Lisa Patel", role: "Managing Director", email: "lisa.patel@nightwatch.co.uk", phone: "+44 7700 902345" }], officerIds: ["3"], siteIds: ["3"], siteCoverageHistory: [{ siteId: "3", siteName: "Royal Hospital", from: "2025-01-01" }], documents: [{ id: "d3", name: "Public liability", file: "PL_NightWatch.pdf", date: "2025-02-01" }] },
    { id: "3", companyName: "EventShield Ltd", contactName: "Mark Stevens", email: "mark@eventshield.co.uk", phone: "+44 7700 903456", status: "pending", notes: "Event stewarding only", companyAddress: "Unit 4, Event Park, Manchester M2 3AB", contactPersons: [{ id: "c4", name: "Mark Stevens", role: "Director", email: "mark@eventshield.co.uk", phone: "+44 7700 903456" }], siteIds: [], documents: [] },
  ],
  invoiceClientOptions: [
    { id: "1", name: "Westfield Corporation" },
    { id: "2", name: "HSBC Holdings" },
    { id: "3", name: "NHS Trust" },
    { id: "4", name: "TechCorp Ltd" },
    { id: "5", name: "Transport for London" },
  ],
  invoiceSiteOptions: {
    "1": ["Westfield Shopping Centre", "Westfield Stratford"],
    "2": ["HSBC Tower", "HSBC Canary Wharf"],
    "3": ["Royal Hospital", "Site B"],
    "4": ["Tech Park Building A"],
    "5": ["Metro Station Central", "Site X", "Site Y"],
  } as Record<string, string[]>,
  invoiceApprovedShifts: [
    { id: "s1", date: "2026-02-01", site: "HSBC Tower", officer: "James Wilson", hours: 8, chargeRate: 18, amount: 144 },
    { id: "s2", date: "2026-02-01", site: "HSBC Tower", officer: "Sarah Connor", hours: 8, chargeRate: 18, amount: 144 },
    { id: "s3", date: "2026-02-02", site: "HSBC Tower", officer: "James Wilson", hours: 8, chargeRate: 18, amount: 144 },
    { id: "s4", date: "2026-02-02", site: "HSBC Tower", officer: "Michael Brown", hours: 8, chargeRate: 18, amount: 144 },
    { id: "s5", date: "2026-02-03", site: "HSBC Canary Wharf", officer: "Sarah Connor", hours: 10, chargeRate: 18, amount: 180 },
  ],
  shiftMonitorShifts: [
    { id: "1", officer: "James Wilson", officerId: "1", site: "Westfield Shopping Centre", siteId: "1", date: "2026-02-05", plannedStart: "06:00", plannedEnd: "14:00", actualStart: "06:00", actualEnd: "14:00", status: "on-time", approved: true, precheck: { dueBy: "2026-02-05T04:30:00", completedAt: "2026-02-05T04:25:00" }, bookOn: { windowStart: "2026-02-05T05:45:00", windowEnd: "2026-02-05T06:30:00", completedAt: "2026-02-05T05:58:00" }, checkCalls: [{ windowStart: "2026-02-05T06:00:00", windowEnd: "2026-02-05T07:00:00", completedAt: "2026-02-05T06:15:00" }, { windowStart: "2026-02-05T07:00:00", windowEnd: "2026-02-05T08:00:00", completedAt: "2026-02-05T07:10:00" }, { windowStart: "2026-02-05T08:00:00", windowEnd: "2026-02-05T09:00:00" }] },
    { id: "2", officer: "Sarah Connor", officerId: "2", site: "HSBC Tower", siteId: "2", date: "2026-02-05", plannedStart: "08:00", plannedEnd: "16:00", actualStart: "08:15", actualEnd: "16:00", status: "late", approved: false, precheck: { dueBy: "2026-02-05T06:30:00", completedAt: "2026-02-05T06:00:00" }, bookOn: { windowStart: "2026-02-05T07:45:00", windowEnd: "2026-02-05T08:30:00", completedAt: "2026-02-05T08:12:00" } },
    { id: "3", officer: "Michael Brown", officerId: "3", site: "Royal Hospital", siteId: "3", date: "2026-02-05", plannedStart: "14:00", plannedEnd: "22:00", actualStart: "14:00", actualEnd: "22:00", status: "on-time", approved: true, precheck: { dueBy: "2026-02-05T12:30:00", completedAt: "2026-02-05T12:10:00" }, bookOn: { windowStart: "2026-02-05T13:45:00", windowEnd: "2026-02-05T14:30:00", completedAt: "2026-02-05T13:50:00" } },
    { id: "4", officer: "Robert Taylor", officerId: "5", site: "Metro Station Central", siteId: "5", date: "2026-02-04", plannedStart: "00:00", plannedEnd: "08:00", actualStart: "", actualEnd: "", status: "no-show", approved: false, precheck: { dueBy: "2026-02-03T22:30:00" }, bookOn: { windowStart: "2026-02-03T23:45:00", windowEnd: "2026-02-04T00:30:00" }, checkCalls: [{ windowStart: "2026-02-04T00:00:00", windowEnd: "2026-02-04T01:00:00" }, { windowStart: "2026-02-04T01:00:00", windowEnd: "2026-02-04T02:00:00" }] },
    { id: "5", officer: "Lucy Martinez", officerId: "6", site: "Tech Park Building A", siteId: "4", date: "2026-02-04", plannedStart: "22:00", plannedEnd: "06:00", actualStart: "22:00", actualEnd: "06:00", status: "on-time", approved: true, precheck: { dueBy: "2026-02-04T20:30:00", completedAt: "2026-02-04T20:05:00" }, bookOn: { windowStart: "2026-02-04T21:45:00", windowEnd: "2026-02-04T22:30:00", completedAt: "2026-02-04T21:57:00" }, checkCalls: [{ windowStart: "2026-02-04T22:00:00", windowEnd: "2026-02-04T23:00:00", completedAt: "2026-02-04T22:20:00" }, { windowStart: "2026-02-04T23:00:00", windowEnd: "2026-02-05T00:00:00", completedAt: "2026-02-04T23:10:00" }] },
  ],
  demoShifts: [
    { id: "1", clientId: "1", clientName: "Westfield Corporation", managerName: "John Manager", site: "Westfield Shopping Centre", shiftDate: "07-12-2025", startTime: "07:00", endTime: "19:00", guardId: "1", guardName: "James Wilson", branch: "LON", hours: 12, status: "confirmed", createdBy: "saad.saif", dutyTypeName: "Static Guard", breakMinutes: 30, chargeRate: 14.5, payRate: 12.0, currency: "GBP", precheckDue: "90 min before start (05:30)", bookOnWindow: "15 min before – 30 min after start", checkCallSummary: "Every 60 min during shift" },
    { id: "2", clientId: "1", clientName: "Westfield Corporation", managerName: "John Manager", site: "Westfield Shopping Centre", shiftDate: "07-12-2025", startTime: "19:00", endTime: "07:00", guardId: "5", guardName: "Robert Taylor", branch: "LON", hours: 12, status: "confirmed", createdBy: "saad.saif", dutyTypeName: "Static Guard", breakMinutes: 0, chargeRate: 16.0, payRate: 12.0, currency: "GBP" },
    { id: "3", clientId: "2", clientName: "HSBC Holdings", managerName: "Sarah Admin", site: "HSBC Tower", shiftDate: "07-12-2025", startTime: "08:00", endTime: "16:00", guardId: "2", guardName: "Sarah Connor", branch: "LON", hours: 8, status: "confirmed", createdBy: "saad.saif", dutyTypeName: "Corporate Security", chargeRate: 15.0, payRate: 12.0, currency: "GBP" },
    { id: "4", clientId: "2", clientName: "HSBC Holdings", managerName: "Sarah Admin", site: "HSBC Tower", shiftDate: "07-12-2025", startTime: "06:00", endTime: "14:00", guardId: "3", guardName: "Michael Brown", branch: "LON", hours: 8, status: "confirmed", createdBy: "saad.saif" },
    { id: "5", clientId: "2", clientName: "HSBC Holdings", managerName: "Sarah Admin", site: "HSBC Tower", shiftDate: "07-12-2025", startTime: "00:00", endTime: "08:00", guardId: "", guardName: "", branch: "LON", hours: 8, status: "unassigned", createdBy: "saad.saif" },
    { id: "6", clientId: "3", clientName: "NHS Trust", managerName: "Dr. Williams", site: "Royal Hospital", shiftDate: "07-12-2025", startTime: "07:00", endTime: "19:00", guardId: "1", guardName: "James Wilson", branch: "LON", hours: 12, status: "pending", createdBy: "saad.saif", dutyTypeName: "Healthcare Security", chargeRate: 13.75, payRate: 11.5, currency: "GBP" },
    { id: "7", clientId: "4", clientName: "TechCorp Ltd", managerName: "Mike Tech", site: "Tech Park Building A", shiftDate: "07-12-2025", startTime: "09:00", endTime: "17:00", guardId: "5", guardName: "Robert Taylor", branch: "MAN", hours: 8, status: "confirmed", createdBy: "saad.saif" },
    { id: "8", clientId: "5", clientName: "Transport for London", managerName: "TfL Security", site: "Metro Station Central", shiftDate: "07-12-2025", startTime: "06:00", endTime: "14:00", guardId: "2", guardName: "Sarah Connor", branch: "LON", hours: 8, status: "confirmed", createdBy: "saad.saif" },
  ],
  authAccounts: AUTH_ACCOUNTS,
  authUsers: authUsersRecord,
  subscriptionFeaturesList: [
    {
      id: "b0000000-0000-0000-0000-000000000001",
      code: "core_crm",
      name: "Core CRM",
      description: "Clients, sites, officers, documents",
      sortOrder: 10,
    },
    {
      id: "b0000000-0000-0000-0000-000000000002",
      code: "scheduling",
      name: "Scheduling",
      description: "Roster, shifts, assignments",
      sortOrder: 20,
    },
    {
      id: "b0000000-0000-0000-0000-000000000003",
      code: "shift_monitor",
      name: "Shift monitor",
      description: "Book-on, precheck, check calls",
      sortOrder: 30,
    },
    {
      id: "b0000000-0000-0000-0000-000000000004",
      code: "invoicing",
      name: "Invoicing",
      description: "Invoices, billing, finance exports",
      sortOrder: 40,
    },
    {
      id: "b0000000-0000-0000-0000-000000000005",
      code: "api_access",
      name: "API access",
      description: "REST webhooks and integrations",
      sortOrder: 50,
    },
    {
      id: "b0000000-0000-0000-0000-000000000006",
      code: "sso",
      name: "SSO / SAML",
      description: "Enterprise single sign-on",
      sortOrder: 60,
    },
    {
      id: "b0000000-0000-0000-0000-000000000007",
      code: "priority_support",
      name: "Priority support",
      description: "Named CSM & SLA",
      sortOrder: 70,
    },
  ],
  subscriptionPlansList: [
    {
      id: "a0000000-0000-0000-0000-000000000001",
      code: "starter",
      name: "Starter",
      description: "Core CRM, smaller teams",
      billingInterval: "monthly",
      priceAmount: 99,
      currency: "GBP",
      maxUsers: 10,
      maxSites: 15,
      maxOfficers: 25,
      sortOrder: 1,
      featureIds: ["b0000000-0000-0000-0000-000000000001", "b0000000-0000-0000-0000-000000000003"],
    },
    {
      id: "a0000000-0000-0000-0000-000000000002",
      code: "professional",
      name: "Professional",
      description: "Advanced scheduling and reporting",
      billingInterval: "monthly",
      priceAmount: 249,
      currency: "GBP",
      maxUsers: 50,
      maxSites: 50,
      maxOfficers: 150,
      sortOrder: 2,
      featureIds: [
        "b0000000-0000-0000-0000-000000000001",
        "b0000000-0000-0000-0000-000000000002",
        "b0000000-0000-0000-0000-000000000003",
        "b0000000-0000-0000-0000-000000000004",
      ],
    },
    {
      id: "a0000000-0000-0000-0000-000000000003",
      code: "enterprise",
      name: "Enterprise",
      description: "High volume, unlimited caps, priority support",
      billingInterval: "yearly",
      priceAmount: 4999,
      currency: "GBP",
      maxUsers: null,
      maxSites: null,
      maxOfficers: null,
      sortOrder: 3,
      featureIds: [
        "b0000000-0000-0000-0000-000000000001",
        "b0000000-0000-0000-0000-000000000002",
        "b0000000-0000-0000-0000-000000000003",
        "b0000000-0000-0000-0000-000000000004",
        "b0000000-0000-0000-0000-000000000005",
        "b0000000-0000-0000-0000-000000000006",
        "b0000000-0000-0000-0000-000000000007",
      ],
    },
  ],
  platformTenantsList: [
    {
      id: "90000000-0000-0000-0000-000000000001",
      name: "GuardForce Demo Ltd",
      slug: "guardforce-demo",
      status: "active",
      subscriptionPlanId: "a0000000-0000-0000-0000-000000000002",
      subscriptionStatus: "active",
      subscriptionStartedAt: "2025-01-01T00:00:00.000Z",
      subscriptionCurrentPeriodEnd: "2026-04-01T00:00:00.000Z",
    },
  ],
  officerDetailDefaults: {
    bs7858Steps: [
      { id: "file", label: "Screening file created", done: true, completedDate: "2026-01-04", phase: "initial" },
      { id: "application", label: "Application form received", done: true, completedDate: "2026-01-04", phase: "initial" },
      { id: "id", label: "Identity verified", done: true, completedDate: "2026-01-05", phase: "initial" },
      { id: "address", label: "Address verified", done: true, completedDate: "2026-01-05", phase: "initial" },
      { id: "sia", label: "SIA licence validated", done: true, completedDate: "2026-01-06", phase: "initial" },
      { id: "public_domain", label: "Public domain checks", done: true, completedDate: "2026-01-06", phase: "initial" },
      { id: "rtw", label: "Right to work (UK)", done: true, completedDate: "2026-01-05", phase: "full_screening" },
      { id: "employment", label: "5-year occupational history", done: true, completedDate: "2026-01-08", phase: "full_screening" },
      { id: "gaps", label: "Employment gaps >31 days explained", done: true, completedDate: "2026-01-08", phase: "full_screening" },
      { id: "references", label: "Employment references received & verified", done: true, completedDate: "2026-01-12", phase: "full_screening" },
      { id: "financial", label: "Financial checks (bankruptcy, IVA, CCJs)", done: true, completedDate: "2026-01-14", phase: "full_screening" },
      { id: "dbs", label: "DBS check (basic) completed", done: true, completedDate: "2026-01-15", phase: "full_screening" },
      { id: "pep", label: "PEP & sanctions / watchlist check", done: true, completedDate: "2026-01-15", phase: "full_screening" },
    ],
    employmentRefs: [
      { id: "1", requestedDate: "2026-01-08", noOfRequests: 1, company: "Melting Flowers", phone: "7981745300", email: "farheen@meltingflowers.com", from: "1999-09-03", to: "2021-03-20", confirmedDatesFrom: "", confirmedDatesTo: "", comments: "", status: "pending" },
    ],
    vettingLog: [
      { id: "1", date: "2026-01-15", action: "DBS check completed", outcome: "Clear", by: "HR Manager" },
      { id: "2", date: "2026-01-12", action: "References requested (email)", outcome: "Sent", by: "HR Manager" },
      { id: "3", date: "2026-01-08", action: "Employment reference added", outcome: "Pending screening", by: "HR Manager" },
    ],
    bankDetails: { accountName: "", sortCode: "", accountNumber: "" },
    healthInfo: {},
    appearanceInfo: {},
    healthFields: [
      { key: "canBeExamined", label: "Can Be Examined" },
      { key: "hasCondition", label: "Has a Condition" },
      { key: "needsCarer", label: "Needs Carer" },
      { key: "disabledNo", label: "Disabled no" },
      { key: "absentDays", label: "Absent Days in Last 2 Years" },
      { key: "additionalComment", label: "Additional Comment" },
      { key: "heartDisease", label: "Heart Disease" },
      { key: "diabetes", label: "Diabetes" },
      { key: "glassesOrContacts", label: "Glasses or contact lenses" },
      { key: "otherSeriousIllness", label: "Any other serious illness" },
    ],
    appearanceFields: [
      { key: "trousersSize", label: "Trousers Size" },
      { key: "skirtSize", label: "Skirt Size" },
      { key: "hips", label: "Hips" },
      { key: "hairColour", label: "Hair Colour" },
      { key: "jacketSize", label: "Jacket Size" },
      { key: "height", label: "Height" },
      { key: "bust", label: "Bust" },
      { key: "chest", label: "Chest" },
      { key: "collar", label: "Collar" },
      { key: "waist", label: "Waist" },
      { key: "insideLeg", label: "Inside Leg" },
      { key: "eyeColour", label: "Eye Colour" },
      { key: "shoeSize", label: "Shoe Size" },
      { key: "hatSize", label: "Hat Size" },
      { key: "weight", label: "Weight" },
    ],
    screeningPeriodYears: 5,
    passportNumber: "",
    passportCountry: "",
    passportIssueDate: "",
    passportExpiryDate: "",
    visaType: "",
    visaNumber: "",
    visaExpiryDate: "",
    rightToWorkUk: "",
    rightToWorkShareCode: "",
    shareCodeExpiry: "",
    documents: [
      { id: "1", name: "Proof of identity", file: "Passport.pdf", date: "2025-01-10" },
      { id: "2", name: "Proof of address", file: "Utility_bill.pdf", date: "2025-01-10" },
      { id: "3", name: "Right to work", file: "Right_to_work.pdf", date: "2025-01-10" },
      { id: "4", name: "DBS certificate", file: "DBS_certificate.pdf", date: "2024-08-22" },
    ],
    educationHistory: [{ id: "1", institution: "City College London", qualification: "NVQ Level 2 Security", from: "2018", to: "2019" }],
    emergencyContacts: [{ id: "1", name: "Jane Wilson", relationship: "Spouse", phone: "+44 7700 900124" }],
    siaLicenceType: "front_line",
    trainingCertifications: [
      { id: "1", name: "SIA Front Line", expiryDate: "2027-03-15" },
      { id: "2", name: "First Aid at Work", expiryDate: "2026-06-01" },
    ],
    documentTypes: ["Proof of identity", "Proof of address", "Right to work", "DBS certificate", "Other"],
  },
  officerDetailById: {
    "1": {
      passportCountry: "United Kingdom",
      rightToWorkUk: "yes",
      rightToWorkShareCode: "JMSWIL12345",
      shareCodeExpiry: "2026-08-01",
      bankDetails: { accountName: "James Wilson", sortCode: "11-22-33", accountNumber: "12345678" },
    },
  } as Record<string, Record<string, unknown>>,
} as const;

export const MAIN_CONTRACTOR_ID = "main";

export function getClientById(id: string) {
  return mockDb.clientsList.find((c) => c.id === id);
}

export function getSiteById(id: string) {
  return mockDb.sitesList.find((s) => s.id === id);
}

export function getSitesByClientId(clientId: string) {
  return mockDb.sitesList.filter((s) => s.clientId === clientId);
}

export function getOfficerById(id: string) {
  return mockDb.officersList.find((o) => o.id === id);
}

export function getSubcontractorById(id: string) {
  return mockDb.subcontractorsList.find((s) => s.id === id);
}

export function getOfficerDetailExtras(id: string) {
  const base = mockDb.officerDetailDefaults as Record<string, unknown>;
  const override = (mockDb.officerDetailById as Record<string, Record<string, unknown>>)[id] ?? {};
  return { ...base, ...override };
}

