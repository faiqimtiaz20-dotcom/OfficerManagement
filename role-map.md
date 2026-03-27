## Security Services CRM – Role Map (RBAC Overview)

This document defines the **role-based access control (RBAC)** for the Security Services CRM & Officer Management System (UK security industry – BS7858 & SIA compliant).

Roles:

- **Super Admin**
- **HR / Compliance**
- **Operations Manager**
- **Scheduler**
- **Finance**
- **Officer**

Permission legend (per module/feature):

- **R** – Read / View
- **C** – Create
- **U** – Update
- **D** – Delete
- **A** – Admin / Configure

---

## 1. HR & Compliance Management (BS7858, SIA, Documents)

Includes: officer master records, BS7858 workflow, identity & employment checks, references, right-to-work, SIA licence tracking, training & certifications, secure document storage, audit trail.

| Role              | Permissions                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| **Super Admin**   | **A, R, C, U, D** on all HR/compliance data and workflows; manage configuration & audit policies.     |
| **HR / Compliance** | **R, C, U** officer profiles, BS7858 workflow steps, SIA licences, training, documents; **R** audits. |
| **Operations Manager** | **R** officer profiles, compliance status, licences (for scheduling decisions).                      |
| **Scheduler**     | **R** officer basic profile, availability, compliance status flag only.                                |
| **Finance**       | **R** officer list and high-level compliance status (for rate & accounting context).                  |
| **Officer**       | **R** own profile & compliance summary; **C, U** own documents & personal info (where allowed).       |

Delete of officers / hard deletion is generally **restricted to Super Admin**; HR typically uses suspend/deactivate.

---

## 2. Officer Registration & Onboarding

Includes: self-registration, document upload, verification, compliance status tracking, activation/suspension.

| Role              | Permissions                                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Super Admin**   | **A, R, C, U, D** on all registration/onboarding records; define required fields, steps, and document types.       |
| **HR / Compliance** | **R, C, U** on registration forms, document verification, screening decisions, compliance status, activation.       |
| **Operations Manager** | **R** onboarding/compliance status of officers to plan staffing.                                                  |
| **Scheduler**     | **R** activation/compliance status to avoid scheduling non-compliant officers.                                      |
| **Finance**       | **R** active/inactive status of officers for rate setup and internal accounting.                                   |
| **Officer**       | **C, U** self-registration data and required onboarding documents; **R** onboarding progress & status.             |

---

## 3. Scheduling & Shift Management

Includes: sites & duty-type-based shifts, officer assignment, confirmations, web check-in/out, late arrival & no-show tracking, shift history & attendance logs.

| Role              | Permissions                                                                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Super Admin**   | **A, R, C, U, D** on all shift templates, rosters, and attendance records; configure global scheduling rules and constraints.               |
| **Operations Manager** | **R, C, U** shifts for assigned customers/sites; reassign officers; override certain rules; **R** late/no-show and attendance dashboards. |
| **Scheduler**     | **R, C, U** create/maintain rosters, assign officers, manage confirmations; **R** shift history and attendance.                             |
| **HR / Compliance** | **R** shift & attendance history for investigations and compliance checks.                                                                   |
| **Finance**       | **R** approved shifts & attendance for timesheets, costing, and invoicing.                                                                  |
| **Officer**       | **R** own upcoming and completed shifts, details, site instructions; **C, U** their own check-in/out, shift confirmations, and availability. |

Officers do **not** see other officers’ shifts or schedules (except optional anonymized aggregates if ever required).

---

## 4. Customer & Site Management (Internal Only)

Includes: customer profiles, site/location records, SOPs & instructions, notes, shift history per site. There is **no client/customer portal**.

| Role              | Permissions                                                                                                                        |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Super Admin**   | **A, R, C, U, D** all customers, sites, SOP templates, notes; manage site-level access rules and sharing.                        |
| **Operations Manager** | **R, C, U** customers & sites within their scope; manage SOPs & instructions; **R** site-level shift history and notes.          |
| **Scheduler**     | **R** customers & sites they schedule for; **R** site instructions required for shift creation.                                  |
| **HR / Compliance** | **R** customer/site context for compliance incidents or investigations.                                                           |
| **Finance**       | **R** customers & sites for billing context and invoice grouping.                                                                 |
| **Officer**       | **R** assigned site details & SOPs for their **own shifts only**; no access to full customer or site list.                      |

---

## 5. Officer Web Portal

Includes: officer login, officer dashboard, upcoming/completed shifts, job instructions, availability submission, notifications & announcements.

| Role              | Permissions                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| **Super Admin**   | **R** impersonate or view officer portal for support; **A** configure portal features and visibility.  |
| **HR / Compliance** | **R** limited views for support/troubleshooting (via admin UI, not direct officer impersonation by default). |
| **Operations Manager** | **R** officer portal behaviour & announcements (admin-side views).                                      |
| **Scheduler**     | **R** officer confirmations & availability inputs for scheduling.                                       |
| **Finance**       | **R** officer portal data like hours worked (via reports).                                             |
| **Officer**       | **A (self)** over their profile within portal; **R, C, U** for own shifts, availability, and messages. |

---

## 6. Internal Accounting & Timesheets

Includes: pay rates, charge rates, duty-type rates, shift cost calculation, timesheet approval workflow, manual adjustments with audit trail.

| Role              | Permissions                                                                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Super Admin**   | **A, R, C, U, D** on all rate structures and timesheet records; configure financial rules and access boundaries.                                   |
| **Finance**       | **R, C, U** rates (pay, charge, duty-type); **R, C, U** timesheet approval workflow; **C, U** manual adjustments with reason + full audit trail.   |
| **Operations Manager** | **R, C, U** approve timesheets and adjust hours for sites they manage (subject to finance rules); **R** cost summaries for their operations.      |
| **Scheduler**     | **R** attendance and provisional hours; **C** suggest corrections (if feature provided); no direct rate editing.                                   |
| **HR / Compliance** | **R** timesheets and attendance (for conduct / disciplinary purposes).                                                                              |
| **Officer**       | **R** their own timesheets and calculated hours; **C** submit notes/disputes regarding their timesheets (if feature is enabled).                  |

---

## 7. Invoice Management

Includes: manual or shift-based invoice generation, invoice grouping (customer/site/date range), editable drafts, invoice numbering, PDFs, emailing, statuses, credit notes, exports.

| Role              | Permissions                                                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Super Admin**   | **A, R, C, U, D** on invoice configuration (numbering, templates), and all invoices & credit notes across the system.                 |
| **Finance**       | **R, C, U** create/edit draft invoices; **C** issue invoices and change status (Draft / Issued / Paid / Cancelled); **C** credit notes; **R** exports. |
| **Operations Manager** | **R** invoices and financial summaries for customers/sites in their remit (read-only).                                                 |
| **Scheduler**     | **R** high-level view of which shifts are billed (if needed); no invoice editing.                                                     |
| **HR / Compliance** | Generally **no direct invoice permissions**, except **R** on specific financial information if required by policy.                       |
| **Officer**       | **No direct access** to invoice data (this is an internal accounting module).                                                         |

External accounting integrations and online payments are **explicitly out of scope** for this phase.

---

## 8. Notifications & Job Broadcast

Includes: shift assignment alerts, shift reminders, compliance & SIA expiry alerts, job broadcast emails, system announcements.

| Role              | Permissions                                                                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Super Admin**   | **A, R, C, U, D** notification templates, channels (email, SMS, in-app), and system-wide announcements.                                   |
| **Operations Manager** | **C, U** broadcast open shifts/jobs to eligible officers; **C** announcements to officers under their management; **R** notification logs. |
| **Scheduler**     | **C** shift assignment alerts and reminders to officers; **R** delivery status (where available).                                         |
| **HR / Compliance** | **C** compliance & SIA expiry alerts to officers and admins; **R** logs of compliance notifications.                                      |
| **Finance**       | **C** invoice/payment-related notifications (if configured); **R** history of those notifications.                                       |
| **Officer**       | **R** notifications targeted to them (assignments, reminders, compliance alerts, announcements); manage notification preferences.        |

---

## 9. Dashboards & Reports

Includes: compliance status dashboard, BS7858 overview, shift fulfilment & attendance metrics, cost vs charge summaries, and exportable reports (PDF/Excel).

| Role              | Permissions                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Super Admin**   | **R** all dashboards and reports across tenants/organisations; **A** configure which widgets and KPIs are available.           |
| **HR / Compliance** | **R** compliance dashboards, BS7858 and SIA status overviews; **R** exportable compliance reports.                               |
| **Operations Manager** | **R** shift fulfilment, attendance, performance, and cost vs charge summaries for their customers/sites.                       |
| **Scheduler**     | **R** roster coverage, unfilled shifts, overtime views, and basic fulfilment metrics.                                           |
| **Finance**       | **R** financial summaries (invoice status, revenue, costs, margins), exports (Excel/PDF).                                       |
| **Officer**       | **R** personal dashboards only (e.g. upcoming/completed shifts, hours worked), no global or team-level analytics.              |

---

## 10. User & Role Management

Includes: user accounts, role definitions, role assignments, site-level access restrictions, and (for SaaS) tenant/organisation boundaries.

| Role              | Permissions                                                                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Super Admin**   | **A, R, C, U, D** organisation/tenant records (for SaaS), all users, roles, and permissions; manage site-level access & role mappings.     |
| **HR / Compliance** | **C, U** create/update officers and some internal users (e.g. HR staff) within their organisation; cannot change global roles.             |
| **Operations Manager** | **C, U** assign staff to specific sites/customers within their organisation (if delegated); **R** user lists in their scope.              |
| **Scheduler**     | **R** user and role info needed for scheduling (e.g. which users are officers and their sites).                                            |
| **Finance**       | **R** user and role info needed for financial workflows (e.g. who can approve).                                                             |
| **Officer**       | **R, U** own account details (profile, password, MFA, contact info); no access to other users’ accounts or role management.                |

---

## 11. Implementation Notes (For Developers)

- Recommended core entities for RBAC:
  - `roles` – Super Admin, HR_Compliance, Operations_Manager, Scheduler, Finance, Officer.
  - `permissions` – granular actions (e.g. `officer.read`, `shift.create`, `invoice.issue`).
  - `role_permissions` – mapping between roles and permissions.
  - `users` – system users (including officers).
  - `user_roles` – many-to-many between users and roles (if a user can hold multiple roles).
- For SaaS:
  - Add `organisations` (tenants) and link `users`, `sites`, `customers`, `shifts`, etc. to an organisation.
  - Ensure all queries are filtered by `organisation_id` and applicable site-level restrictions.
- Audit trail should be enabled on all compliance-, financial-, and scheduling-critical actions (especially HR/Compliance and Finance modules).

