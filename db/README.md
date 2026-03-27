# PostgreSQL Database Setup

This folder contains SQL migrations for a normalized GuardForce CRM database.

## Files

- `migrations/001_init.sql` - Full schema (tables, constraints, indexes)
- `migrations/002_seed.sql` - Initial seed data aligned with current mock data

## Run

```bash
psql -d <your_database> -f db/migrations/001_init.sql
psql -d <your_database> -f db/migrations/002_seed.sql
```

## Notes

- Uses `pgcrypto` for `gen_random_uuid()`.
- UUID constants in seed are deterministic for easy local development.
- You can extend seed data safely with additional inserts.

## Multi-tenant users and login

- Each **tenant** has many users via `tenant_user` (same `app_user` can appear in more than one tenant).
- **Authentication** is against `app_user`: sign in with **email** or **username** (case-insensitive for username) plus **password**, verified using `password_hash` (store Argon2id or bcrypt hashes only; never plain text).
- After authentication, load allowed tenants with `SELECT ... FROM tenant_user JOIN tenant ... WHERE user_id = ? AND tenant_user.is_active` and let the user pick a tenant (or infer from URL slug) for the session.
- **Roles**: `SUPER_ADMIN` is the **platform** operator (manages tenant companies; typically no `tenant_user` rows). `ADMIN` is **company/tenant admin** (full admin inside one tenant). Other roles are scoped via `tenant_user_role`.
- **Subscriptions**: `subscription_plan` holds the plan catalog (price, billing interval, optional caps). Each `tenant` references a plan with `subscription_plan_id` plus `subscription_status`, `subscription_started_at`, and `subscription_current_period_end`. Status `none` means no plan assigned (`subscription_plan_id` must be null).
- **Plan features**: `subscription_feature` lists entitlement modules (code + name). `subscription_plan_feature` is the many-to-many link of which features are included in each plan. Platform super admins manage these in the app UI (`/platform/subscription-plans`); the optional `features` jsonb on `subscription_plan` remains for ad-hoc metadata if needed.
- Seed users share demo password `password` (bcrypt hash in `002_seed.sql`); change before any real deployment.
