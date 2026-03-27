-- GuardForce CRM seed data (minimal, aligned with current mockDb)
-- Run after 001_init.sql
-- psql -d <db_name> -f db/migrations/002_seed.sql

BEGIN;

-- Subscription plans (catalog; each tenant links via tenant.subscription_plan_id)
INSERT INTO subscription_plan (
  id, code, name, description, billing_interval, price_amount, currency,
  max_users, max_sites, max_officers, sort_order
) VALUES
(
  1,
  'starter',
  'Starter',
  'Core CRM, smaller teams',
  'monthly',
  99.00,
  'GBP',
  10,
  15,
  25,
  1
),
(
  2,
  'professional',
  'Professional',
  'Advanced scheduling and reporting',
  'monthly',
  249.00,
  'GBP',
  50,
  50,
  150,
  2
),
(
  3,
  'enterprise',
  'Enterprise',
  'High volume, unlimited caps, priority support',
  'yearly',
  4999.00,
  'GBP',
  NULL,
  NULL,
  NULL,
  3
)
ON CONFLICT (code) DO NOTHING;

-- Subscription features (platform catalog; super admin manages; plans link via subscription_plan_feature)
INSERT INTO subscription_feature (id, code, name, description, sort_order) VALUES
(1,'core_crm','Core CRM','Clients, sites, officers, documents',10),
(2,'scheduling','Scheduling','Roster, shifts, assignments',20),
(3,'shift_monitor','Shift monitor','Book-on, precheck, check calls',30),
(4,'invoicing','Invoicing','Invoices, billing, finance exports',40),
(5,'api_access','API access','REST webhooks and integrations',50),
(6,'sso','SSO / SAML','Enterprise single sign-on',60),
(7,'priority_support','Priority support','Named CSM & SLA',70)
ON CONFLICT (code) DO NOTHING;

INSERT INTO subscription_plan_feature (subscription_plan_id, subscription_feature_id) VALUES
(1,1),
(1,3),
(2,1),
(2,2),
(2,3),
(2,4),
(3,1),
(3,2),
(3,3),
(3,4),
(3,5),
(3,6),
(3,7)
ON CONFLICT DO NOTHING;

-- Tenant (single default account for local/dev)
INSERT INTO tenant (
  id,
  name,
  slug,
  status,
  subscription_plan_id,
  subscription_status,
  subscription_started_at,
  subscription_current_period_end
) VALUES
(
  1,
  'GuardForce Demo Ltd',
  'guardforce-demo',
  'active',
  2,
  'active',
  '2025-01-01 00:00:00+00',
  '2026-04-01 00:00:00+00'
)
ON CONFLICT (id) DO NOTHING;

-- Site SOP sample text
UPDATE site
SET sop = CASE id
  WHEN 1 THEN 'Westfield SOP: Hourly patrols, loading-bay lock checks, and incident escalation to control room.'
  WHEN 2 THEN 'HSBC SOP: Reception coverage, badge verification, and perimeter checks every 2 hours.'
  WHEN 3 THEN 'Royal Hospital SOP: Ward-entry control, visitor checks, and emergency response support.'
  ELSE sop
END
WHERE id IN (
  1,
  2,
  3
);

-- Roles (SUPER_ADMIN = platform/software operator; ADMIN = company/tenant admin)
INSERT INTO role (code, name) VALUES
('SUPER_ADMIN','Super Administrator'),
('ADMIN','Company Admin'),
('HR','HR'),
('OPS','Operations'),
('SCHEDULER','Scheduler'),
('FINANCE','Finance'),
('OFFICER','Officer')
ON CONFLICT (code) DO NOTHING;

-- Branches
INSERT INTO branch (id, tenant_id, code, name) VALUES
(1, 1, 'LON', 'London'),
(2, 1, 'MAN', 'Manchester')
ON CONFLICT (tenant_id, code) DO NOTHING;

-- Users (demo password for all: "password" — bcrypt; replace in production)
-- Hash is standard test vector for bcrypt "password" (cost 10).
INSERT INTO app_user (id, full_name, email, username, password_hash, phone) VALUES
(1,'Super Administrator','platform.admin@guardforce.local','platformadmin','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',NULL),
(7,'Company Admin','admin@guardforce.local','companyadmin','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',NULL),
(2,'HR Manager','hr.manager@guardforce.local','hrmanager','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',NULL),
(3,'Operations Manager','ops.manager@guardforce.local','opsmanager','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',NULL),
(4,'Scheduler','scheduler@guardforce.local','scheduler','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',NULL),
(5,'Finance User','finance@guardforce.local','finance','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',NULL),
(6,'Officer','officer@guardforce.local',NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',NULL)
ON CONFLICT (id) DO NOTHING;

-- Officer profile fields used by CRM detail UI
UPDATE officer
SET
  position = CASE id
    WHEN 1 THEN 'Senior Security Officer'
    WHEN 2 THEN 'Door Supervisor'
    ELSE position
  END,
  avatar_url = CASE id
    WHEN 1 THEN 'https://images.example.com/officers/off-001.jpg'
    WHEN 2 THEN 'https://images.example.com/officers/off-002.jpg'
    ELSE avatar_url
  END,
  nationality = CASE id
    WHEN 1 THEN 'British'
    WHEN 2 THEN 'British'
    ELSE nationality
  END
WHERE id IN (
  1,
  2
);

-- Site preferred officers (priority order per site)
INSERT INTO site_preferred_officer (tenant_id, site_id, officer_id, sort_order) VALUES
(1,1,1,1),
(1,1,2,2),
(1,2,2,1)
ON CONFLICT (tenant_id, site_id, officer_id) DO NOTHING;

-- Officer extension objects used by the profile page sections
INSERT INTO officer_health (tenant_id, officer_id, details) VALUES
(
  1,
  1,
  '{"heightCm":180,"weightKg":82,"bloodGroup":"O+","medicalNotes":"No known conditions","allergies":[]}'::jsonb
),
(
  1,
  2,
  '{"heightCm":168,"weightKg":61,"bloodGroup":"A+","medicalNotes":"Carries inhaler","allergies":["Dust"]}'::jsonb
)
ON CONFLICT (officer_id) DO NOTHING;

INSERT INTO officer_appearance (tenant_id, officer_id, details) VALUES
(
  1,
  1,
  '{"eyeColor":"Brown","hairColor":"Black","build":"Athletic","uniformSize":"L","identifyingMarks":"Scar above left eyebrow"}'::jsonb
),
(
  1,
  2,
  '{"eyeColor":"Green","hairColor":"Brown","build":"Slim","uniformSize":"M","identifyingMarks":"None"}'::jsonb
)
ON CONFLICT (officer_id) DO NOTHING;

-- Tenant users (platform super admin is not a member of customer tenants)
INSERT INTO tenant_user (tenant_id, user_id, is_owner, is_active) VALUES
(1,7,true,true),
(1,2,false,true),
(1,3,false,true),
(1,4,false,true),
(1,5,false,true),
(1,6,false,true)
ON CONFLICT DO NOTHING;

-- Tenant user roles
INSERT INTO tenant_user_role (tenant_id, user_id, role_id)
SELECT 1, 7, id FROM role WHERE code='ADMIN'
ON CONFLICT DO NOTHING;
INSERT INTO tenant_user_role (tenant_id, user_id, role_id)
SELECT 1, 2, id FROM role WHERE code='HR'
ON CONFLICT DO NOTHING;
INSERT INTO tenant_user_role (tenant_id, user_id, role_id)
SELECT 1, 3, id FROM role WHERE code='OPS'
ON CONFLICT DO NOTHING;
INSERT INTO tenant_user_role (tenant_id, user_id, role_id)
SELECT 1, 4, id FROM role WHERE code='SCHEDULER'
ON CONFLICT DO NOTHING;
INSERT INTO tenant_user_role (tenant_id, user_id, role_id)
SELECT 1, 5, id FROM role WHERE code='FINANCE'
ON CONFLICT DO NOTHING;
INSERT INTO tenant_user_role (tenant_id, user_id, role_id)
SELECT 1, 6, id FROM role WHERE code='OFFICER'
ON CONFLICT DO NOTHING;

-- Clients (using fixed numeric IDs for easy references)
INSERT INTO client (
  id, tenant_id, name, industry, status, email, phone, address,
  company_reg_number, vat_number, company_registered_address, website, default_base_rate, started_on
) VALUES
(1,1,'Westfield Corporation','Retail','active','security@westfield.co.uk','+44 20 7946 0123','Westfield Ave, London E20 1EJ','01234567','GB 123 4567 89','Westfield House, 1 Ariel Way, London W12 7SL','https://www.westfield.com',14.50,'2023-01-15'),
(2,1,'HSBC Holdings','Corporate & Office','active','facilities@hsbc.com','+44 20 7991 8888','8 Canada Square, London E14 5HQ','00012465','GB 888 8888 88','8 Canada Square, London E14 5HQ','https://www.hsbc.com',15.00,'2022-06-01'),
(3,1,'NHS Trust','Healthcare','active','estates@nhs.uk','+44 111 234 5678','Wellington Road, London NW8 9LE','NHS Trust','GB 123 4567 89','Wellington House, 133-155 Waterloo Road, London SE1 8UG','https://www.nhs.uk',NULL,'2022-09-20')
ON CONFLICT (id) DO NOTHING;

-- Client contacts
INSERT INTO client_contact (tenant_id, client_id, full_name, role_title, email, phone, is_primary) VALUES
(1,1,'John Manager','Security Lead','john.m@westfield.co.uk','+44 20 7946 0124',true),
(1,2,'Mike Roberts','Head of Security','mike.roberts@hsbc.com','+44 20 7991 8889',true)
ON CONFLICT DO NOTHING;

-- Sites
INSERT INTO site (
  id, tenant_id, client_id, branch_id, name, address, status, bookon_email,
  check_call_enabled, check_call_interval_minutes
) VALUES
(
  1,
  1,
  1,
  1,
  'Westfield Shopping Centre',
  'Ariel Way, London W12 7GF',
  'active',
  'bookon@westfield.com',
  true,
  60
),
(
  2,
  1,
  2,
  1,
  'HSBC Tower',
  '8 Canada Square, London E14 5HQ',
  'active',
  'bookon@hsbc.com',
  false,
  60
),
(
  3,
  1,
  3,
  1,
  'Royal Hospital',
  'Royal Hospital Road, London SW3 4SR',
  'active',
  'bookon@royalhospital.nhs.uk',
  true,
  60
)
ON CONFLICT (id) DO NOTHING;

-- Duty types
INSERT INTO duty_type (id, tenant_id, code, name, is_active) VALUES
(1,1,'STATIC_GUARD','Static Guard',true),
(2,1,'CORPORATE_SECURITY','Corporate Security',true),
(3,1,'HEALTHCARE_SECURITY','Healthcare Security',true)
ON CONFLICT (id) DO NOTHING;

-- Site rates
INSERT INTO site_duty_rate (tenant_id, site_id, duty_type_id, charge_rate, pay_rate, currency_code) VALUES
(1,1,1,14.50,12.00,'GBP'),
(1,2,2,15.00,12.00,'GBP'),
(1,3,3,13.75,11.50,'GBP')
ON CONFLICT DO NOTHING;

-- Subcontractors
INSERT INTO subcontractor (id, tenant_id, company_name, status, contact_name, email, phone, company_address, company_reg_number, vat_number, notes) VALUES
(1,1,'Main (direct officers)','active','','','','',NULL,NULL,NULL),
(2,1,'SecureGuard Solutions Ltd','active','David Moore','david.moore@secureguard.co.uk','+44 7700 901234','12 Security House, London E1 6AN','09876543','GB 987654321','CCTV and static guard provision')
ON CONFLICT (id) DO NOTHING;

-- Officer types
INSERT INTO officer_type (id, tenant_id, code, name, requires_sia_licence, is_active) VALUES
(1,1,'SECURITY_GUARD','Security Guard',true,true),
(2,1,'DOOR_SUPERVISOR','Door Supervisor',true,true)
ON CONFLICT (id) DO NOTHING;

-- Officers
INSERT INTO officer (
  id, tenant_id, officer_code, full_name, email, phone, status, compliance_status,
  officer_type_id, subcontractor_id, date_of_birth, address, ni_number,
  sia_licence_number, sia_licence_expiry, right_to_work_status, share_code, share_code_expiry
) VALUES
(
  1,
  1,
  'OFF-001',
  'James Wilson',
  'james.wilson@email.com',
  '+44 7700 900123',
  'active',
  'compliant',
  1,
  1,
  '1985-03-12',
  '24 Oak Lane, London E1 4AB',
  'AB 12 34 56 C',
  '1234567890123456',
  '2027-03-15',
  'yes',
  'JMSWIL12345',
  '2026-08-01'
),
(
  2,
  1,
  'OFF-002',
  'Sarah Connor',
  'sarah.connor@email.com',
  '+44 7700 900456',
  'active',
  'compliant',
  2,
  2,
  '1990-07-22',
  '8 Park Road, Birmingham B2 1AA',
  'CD 78 90 12 E',
  '2345678901234567',
  '2026-08-20',
  'yes',
  NULL,
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- Sample shifts (from current demo model)
INSERT INTO shift (
  id, tenant_id, client_id, site_id, duty_type_id, branch_id, officer_id, shift_date, start_time, end_time,
  break_minutes, planned_hours, charge_rate, pay_rate, currency_code, status, created_by
) VALUES
(
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  '2026-02-05',
  '06:00',
  '14:00',
  30,
  8.00,
  14.50,
  12.00,
  'GBP',
  'confirmed',
  4
),
(
  2,
  1,
  2,
  2,
  2,
  1,
  2,
  '2026-02-05',
  '08:00',
  '16:00',
  0,
  8.00,
  15.00,
  12.00,
  'GBP',
  'confirmed',
  4
)
ON CONFLICT (id) DO NOTHING;

-- Call plans
INSERT INTO shift_call_plan (
  tenant_id, shift_id, precheck_due_at, bookon_window_start, bookon_window_end, check_call_enabled, check_call_interval_minutes
) VALUES
(
  1,
  1,
  '2026-02-05 04:30:00+00',
  '2026-02-05 05:45:00+00',
  '2026-02-05 06:30:00+00',
  true,
  60
),
(
  1,
  2,
  '2026-02-05 06:30:00+00',
  '2026-02-05 07:45:00+00',
  '2026-02-05 08:30:00+00',
  false,
  60
)
ON CONFLICT (shift_id) DO NOTHING;

-- Timesheet reconciliation
INSERT INTO shift_timesheet (
  tenant_id, shift_id, actual_start, actual_end, worked_hours, attendance_status, reconciled, reconciled_at, reconciled_by
) VALUES
(
  1,
  1,
  '2026-02-05 06:00:00+00',
  '2026-02-05 14:00:00+00',
  8.00,
  'on-time',
  true,
  now(),
  3
),
(
  1,
  2,
  '2026-02-05 08:15:00+00',
  '2026-02-05 16:00:00+00',
  7.75,
  'late',
  false,
  NULL,
  NULL
)
ON CONFLICT (shift_id) DO NOTHING;

COMMIT;
