# CLAUDE.md — Expertis CRM SaaS

> Briefing for Claude Code. Read this entire file before writing a single line of code.
> This is the ground truth for architecture decisions, conventions, and constraints.

---

## 1. PRODUCT DESCRIPTION

### What this is

**Expertis CRM** is a B2B SaaS CRM built for medical sales teams (though the architecture must be generic enough to onboard any vertical). It is a full rewrite of an existing single-tenant Firebase/Electron app currently running in production for one client. That client's app must **not be touched** — it lives in a separate repo.

### Business model

- **Multi-tenant SaaS**: one deployment serves N organizations (`orgs`). Each org is fully isolated at the data layer via Row Level Security (RLS) in Supabase.
- **Subscription-based**: free trial → paid plans (implementation of billing/Stripe is a later phase, but the data model must accommodate it from day one).
- **Target users**: sales reps (`comercial`) and their managers (`admin`) within a company. Each org has one or more admins.

### Functional modules (derived from production app)

| Module                 | Description                                                    |
| ---------------------- | -------------------------------------------------------------- |
| **Dashboard**          | KPIs, pipeline metrics, recent activity                        |
| **Clients**            | Full CRM client management with notes, reminders, GDPR consent |
| **Offers**             | Quotes/proposals linked to clients, with PDF export            |
| **Products**           | Product/service catalog with stock tracking                    |
| **Invoices**           | Invoice generation, payment tracking, PDF export               |
| **Expenses**           | Expense management with categories and receipts                |
| **Reports**            | Charts and exports (Recharts, XLSX)                            |
| **Bulk Communication** | Mass email/message dispatch to client segments                 |
| **Admin Panel**        | User management, invitations, org settings                     |
| **Profile**            | User profile and preferences                                   |

---

## 2. TARGET TECH STACK

| Layer         | Technology                                          | Notes                                              |
| ------------- | --------------------------------------------------- | -------------------------------------------------- |
| Framework     | **Next.js 14** (App Router)                         | Server Components by default                       |
| Language      | **TypeScript** (strict mode, `noImplicitAny: true`) | No `any`, ever                                     |
| Database      | **Supabase** (Postgres + RLS)                       | All data access via service layer                  |
| Auth          | **Supabase Auth**                                   | Email/password + Google OAuth                      |
| Storage       | **Supabase Storage**                                | Avatars, attachments, receipts                     |
| Styling       | **Tailwind CSS**                                    | No inline styles, no CSS modules                   |
| State         | **Zustand**                                         | Global UI state only; server state via React Query |
| Server state  | **TanStack Query (React Query)**                    | Caching, refetching, mutations                     |
| Charts        | **Recharts**                                        | Already used in production                         |
| PDF           | **jsPDF + html2canvas**                             | Same as production app                             |
| Excel export  | **SheetJS (xlsx)**                                  | Same as production app                             |
| Forms         | **React Hook Form + Zod**                           | Validation at schema level                         |
| Icons         | **Lucide React**                                    | Consistent icon set                                |
| Notifications | **Sonner**                                          | Toast notifications                                |
| Testing       | **Vitest + Testing Library**                        | Unit + integration                                 |
| E2E           | **Playwright**                                      | Critical user flows only                           |

### What NOT to use

- No Redux, no Context API for global state (use Zustand)
- No class components
- No `fetch()` calls outside `/lib/services/`
- No direct Supabase client calls inside React components or pages
- No `any` type — use `unknown` and narrow it
- No Babel in the browser (this is a proper Next.js build)
- No CDN-loaded libraries (everything through npm)

---

## 3. ARCHITECTURE & FOLDER STRUCTURE

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group: unauthenticated
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── verify-email/page.tsx
│   ├── (dashboard)/              # Route group: authenticated + layout
│   │   ├── layout.tsx            # Shell: sidebar + header
│   │   ├── page.tsx              # Dashboard
│   │   ├── clients/
│   │   │   ├── page.tsx          # Client list
│   │   │   ├── [id]/page.tsx     # Client detail
│   │   │   └── new/page.tsx      # Create client
│   │   ├── offers/
│   │   ├── products/
│   │   ├── invoices/
│   │   ├── expenses/
│   │   ├── reports/
│   │   ├── communication/
│   │   ├── profile/
│   │   └── admin/
│   ├── api/                      # Route handlers (server-side only)
│   │   ├── invitations/route.ts
│   │   └── webhooks/route.ts
│   ├── layout.tsx                # Root layout
│   └── globals.css
│
├── components/
│   ├── ui/                       # Generic, reusable, zero business logic
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   ├── data-table.tsx
│   │   ├── stat-card.tsx
│   │   └── ...
│   ├── forms/                    # Form building blocks (RHF + Zod)
│   │   ├── form-field.tsx
│   │   └── form-select.tsx
│   └── [module]/                 # Module-specific components
│       ├── clients/
│       │   ├── client-card.tsx
│       │   ├── client-form.tsx
│       │   ├── client-notes.tsx
│       │   └── client-reminders.tsx
│       ├── offers/
│       ├── invoices/
│       └── ...
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client (singleton)
│   │   ├── server.ts             # Server Supabase client (createServerClient)
│   │   └── middleware.ts         # Session refresh middleware
│   ├── services/                 # ALL data access lives here
│   │   ├── clients.service.ts
│   │   ├── offers.service.ts
│   │   ├── invoices.service.ts
│   │   ├── products.service.ts
│   │   ├── expenses.service.ts
│   │   ├── users.service.ts
│   │   └── ...
│   ├── hooks/                    # Custom React hooks (wrap TanStack Query)
│   │   ├── use-clients.ts
│   │   ├── use-offers.ts
│   │   └── ...
│   ├── stores/                   # Zustand stores (UI state only)
│   │   ├── ui.store.ts           # Sidebar open, active modal, etc.
│   │   └── auth.store.ts         # Current user + org context
│   ├── utils/
│   │   ├── pdf.ts                # jsPDF helpers
│   │   ├── excel.ts              # SheetJS helpers
│   │   ├── format.ts             # Date, currency, number formatters
│   │   └── cn.ts                 # clsx + tailwind-merge helper
│   └── validations/              # Zod schemas (shared between client/server)
│       ├── client.schema.ts
│       ├── offer.schema.ts
│       └── ...
│
├── types/
│   ├── database.types.ts         # Auto-generated by Supabase CLI
│   ├── models.ts                 # Domain types derived from DB types
│   └── api.ts                    # Request/response types for API routes
│
└── middleware.ts                 # Auth guard + org context
```

### Naming conventions

- **Files**: `kebab-case.tsx` for components, `kebab-case.ts` for utilities/services
- **Components**: `PascalCase` named export (no default exports in components)
- **Hooks**: `useCamelCase`, always in `/lib/hooks/`
- **Services**: `camelCase` functions in `*.service.ts` files
- **Types/Interfaces**: `PascalCase`, prefix interfaces with `I` only when disambiguating
- **Zod schemas**: `camelCaseSchema` (e.g. `createClientSchema`)
- **Database types**: use the auto-generated `Tables<'clients'>` from `database.types.ts`

---

## 4. DATA MODEL

All tables include `org_id uuid NOT NULL REFERENCES organizations(id)` to enforce tenant isolation. RLS policies filter by `org_id = auth.jwt() -> 'org_id'` (stored in the JWT via a custom claim or via a user→org lookup).

### Core tables

```sql
-- Tenant root
CREATE TABLE organizations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,
  plan        text NOT NULL DEFAULT 'trial',   -- trial | starter | pro | enterprise
  settings    jsonb DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Users (maps 1:1 to auth.users)
CREATE TABLE users (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id        uuid NOT NULL REFERENCES organizations(id),
  email         text NOT NULL,
  name          text NOT NULL,
  role          text NOT NULL DEFAULT 'comercial',  -- admin | comercial | superadmin
  avatar_url    text,
  active        boolean NOT NULL DEFAULT true,
  provider      text,                               -- email | google
  preferences   jsonb DEFAULT '{"language":"es","timezone":"Europe/Madrid","theme":"light"}',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  created_by    uuid REFERENCES users(id)
);

-- Clients
CREATE TABLE clients (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES organizations(id),
  name            text NOT NULL,
  company         text,
  email           text,
  phone           text,
  address         jsonb,                            -- {street, city, postal_code, country}
  tax_id          text,
  assigned_to     uuid REFERENCES users(id),
  status          text DEFAULT 'active',            -- active | inactive | lead
  tags            text[],
  custom_fields   jsonb DEFAULT '{}',
  consent_given   boolean DEFAULT false,
  consent_date    timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  created_by      uuid REFERENCES users(id)
);

-- Client notes
CREATE TABLE client_notes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES organizations(id),
  client_id   uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  content     text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  created_by  uuid REFERENCES users(id)
);

-- Reminders (for both clients and users)
CREATE TABLE reminders (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organizations(id),
  client_id     uuid REFERENCES clients(id) ON DELETE CASCADE,
  assigned_to   uuid REFERENCES users(id),
  title         text NOT NULL,
  description   text,
  due_date      timestamptz NOT NULL,
  completed     boolean DEFAULT false,
  completed_at  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  created_by    uuid REFERENCES users(id)
);

-- Products
CREATE TABLE products (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organizations(id),
  name          text NOT NULL,
  description   text,
  sku           text,
  price         numeric(10,2) NOT NULL DEFAULT 0,
  tax_rate      numeric(5,2) NOT NULL DEFAULT 21,   -- % IVA
  stock         integer DEFAULT 0,
  unit          text DEFAULT 'ud',
  image_url     text,
  active        boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  created_by    uuid REFERENCES users(id)
);

-- Stock movements
CREATE TABLE stock_movements (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organizations(id),
  product_id    uuid NOT NULL REFERENCES products(id),
  quantity      integer NOT NULL,                   -- positive = in, negative = out
  reason        text,                               -- sale | purchase | adjustment
  reference_id  uuid,                               -- offer_id or invoice_id
  created_at    timestamptz NOT NULL DEFAULT now(),
  created_by    uuid REFERENCES users(id)
);

-- Offers (quotes/proposals)
CREATE TABLE offers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES organizations(id),
  number          text NOT NULL,                    -- ORG-prefixed sequential: EXP-2024-0001
  client_id       uuid REFERENCES clients(id),
  status          text NOT NULL DEFAULT 'draft',   -- draft | sent | accepted | rejected | expired
  lines           jsonb NOT NULL DEFAULT '[]',     -- [{product_id, name, qty, unit_price, tax_rate, discount}]
  subtotal        numeric(10,2) NOT NULL DEFAULT 0,
  tax_amount      numeric(10,2) NOT NULL DEFAULT 0,
  total           numeric(10,2) NOT NULL DEFAULT 0,
  discount        numeric(5,2) DEFAULT 0,
  notes           text,
  valid_until     date,
  sent_at         timestamptz,
  accepted_at     timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  created_by      uuid REFERENCES users(id)
);

-- Invoices
CREATE TABLE invoices (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES organizations(id),
  number          text NOT NULL,                    -- EXP-FAC-2024-0001
  offer_id        uuid REFERENCES offers(id),
  client_id       uuid REFERENCES clients(id),
  status          text NOT NULL DEFAULT 'draft',   -- draft | sent | paid | partial | overdue | cancelled
  lines           jsonb NOT NULL DEFAULT '[]',
  subtotal        numeric(10,2) NOT NULL DEFAULT 0,
  tax_amount      numeric(10,2) NOT NULL DEFAULT 0,
  total           numeric(10,2) NOT NULL DEFAULT 0,
  paid_amount     numeric(10,2) NOT NULL DEFAULT 0,
  due_date        date,
  issued_at       date NOT NULL DEFAULT CURRENT_DATE,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  created_by      uuid REFERENCES users(id)
);

-- Invoice payments
CREATE TABLE invoice_payments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid NOT NULL REFERENCES organizations(id),
  invoice_id    uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount        numeric(10,2) NOT NULL,
  method        text,                               -- transfer | card | cash | check
  reference     text,
  paid_at       date NOT NULL DEFAULT CURRENT_DATE,
  notes         text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  created_by    uuid REFERENCES users(id)
);

-- Expenses
CREATE TABLE expenses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES organizations(id),
  title           text NOT NULL,
  amount          numeric(10,2) NOT NULL,
  tax_amount      numeric(10,2) DEFAULT 0,
  category        text,
  date            date NOT NULL DEFAULT CURRENT_DATE,
  receipt_url     text,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  created_by      uuid REFERENCES users(id)
);

-- Invitations
CREATE TABLE invitations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES organizations(id),
  email       text NOT NULL,
  role        text NOT NULL DEFAULT 'comercial',
  token       text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  accepted    boolean DEFAULT false,
  accepted_at timestamptz,
  expires_at  timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at  timestamptz NOT NULL DEFAULT now(),
  created_by  uuid REFERENCES users(id)
);

-- Counters (sequential numbering per org)
CREATE TABLE counters (
  org_id    uuid NOT NULL REFERENCES organizations(id),
  type      text NOT NULL,                          -- offer | invoice
  value     integer NOT NULL DEFAULT 0,
  PRIMARY KEY (org_id, type)
);

-- System settings per org (replaces system_settings/main in Firestore)
CREATE TABLE org_settings (
  org_id          uuid PRIMARY KEY REFERENCES organizations(id),
  company_name    text,
  company_tax_id  text,
  company_address jsonb,
  logo_url        text,
  invoice_prefix  text DEFAULT 'FAC',
  offer_prefix    text DEFAULT 'OFR',
  default_tax     numeric(5,2) DEFAULT 21,
  currency        text DEFAULT 'EUR',
  settings        jsonb DEFAULT '{}',
  updated_at      timestamptz NOT NULL DEFAULT now(),
  updated_by      uuid REFERENCES users(id)
);
```

### Relationships diagram (simplified)

```
organizations
  ├── users (org_id)
  ├── clients (org_id)
  │     ├── client_notes (client_id)
  │     └── reminders (client_id)
  ├── products (org_id)
  │     └── stock_movements (product_id)
  ├── offers (org_id → client_id)
  ├── invoices (org_id → client_id, offer_id)
  │     └── invoice_payments (invoice_id)
  ├── expenses (org_id)
  ├── invitations (org_id)
  ├── counters (org_id)
  └── org_settings (org_id)
```

### RLS policy pattern (apply to every table)

```sql
-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Org isolation policy
CREATE POLICY "org_isolation" ON clients
  FOR ALL
  USING (org_id = (
    SELECT org_id FROM users WHERE id = auth.uid()
  ));
```

---

## 5. DEVELOPMENT RULES

These are non-negotiable. Follow them on every task.

### What you MUST do

**Typing**

- Every function must have explicit return types
- Use `Tables<'table_name'>` from `database.types.ts` for raw DB rows
- Define domain model types in `types/models.ts` (mapped from DB types, with camelCase)
- Zod schemas live in `lib/validations/` and are the single source of truth for form validation AND API input validation

**Components**

- Server Components by default. Add `'use client'` only when you need hooks, event handlers, or browser APIs
- Props interfaces must be defined inline above the component (`interface Props { ... }`)
- No business logic inside components. Components call hooks, hooks call services
- No direct Supabase calls in components — ever
- Keep components under 150 lines. Extract sub-components aggressively

**Services (`lib/services/`)**

- Every Supabase query lives here, nowhere else
- Services return typed results: `Promise<{ data: T | null; error: string | null }>`
- Never throw from a service — return the error as a string
- Always include `org_id` in every query (enforced by RLS, but explicit as defense-in-depth)

**Hooks (`lib/hooks/`)**

- All data fetching hooks wrap TanStack Query (`useQuery`, `useMutation`)
- Mutation hooks invalidate the relevant query keys on success
- Hooks must not contain business logic — that belongs in services

**State (Zustand)**

- Zustand stores are for UI state only: sidebar open/closed, active modal, drawer state, etc.
- Server/async data is managed by TanStack Query, not Zustand
- Auth store holds the current user and org context (set after session hydration)

**Error handling**

- Use a consistent `Result<T>` pattern: `{ data: T; error: null } | { data: null; error: string }`
- Surface errors with Sonner toasts (`toast.error(...)`) in mutation `onError` callbacks
- Log unexpected errors to console in development; in production use a proper logger
- Never swallow errors silently

**Forms**

- All forms use React Hook Form with a Zod resolver
- The Zod schema is defined in `lib/validations/`, imported into the component
- `<FormField>` and `<FormSelect>` components from `components/forms/` must be used consistently

**PDF generation**

- PDF logic lives in `lib/utils/pdf.ts`
- Components trigger PDF generation by calling a utility function — no jsPDF calls inside components

**Multi-tenancy**

- Every DB operation must be scoped to the current `org_id`
- `org_id` is retrieved from the Zustand auth store (populated from the session)
- Never trust `org_id` from client-side input — always use the session-derived value

### What is FORBIDDEN

```
❌ Direct Supabase calls inside React components or page files
❌ Using `any` type (use `unknown` and narrow with type guards)
❌ Business logic inside components (extract to services or hooks)
❌ Default exports for components (named exports only)
❌ Inline styles (use Tailwind classes only)
❌ useEffect for data fetching (use TanStack Query)
❌ Storing sensitive data in Zustand (use session/cookies)
❌ Sharing the Supabase server client between requests (create per-request)
❌ Skipping RLS — always filter by org_id even when RLS is set up
❌ console.log with user data in production-ready code
❌ Magic strings for roles — use a const enum or literal union type
❌ Fetching all records without pagination (always use .range() or cursor)
```

### Role type definition (single source of truth)

```typescript
// types/models.ts
export type UserRole = "superadmin" | "admin" | "comercial";

export const USER_ROLES: Record<UserRole, string> = {
  superadmin: "Super Admin",
  admin: "Administrador",
  comercial: "Comercial",
};
```

### Standard service function signature

```typescript
// lib/services/clients.service.ts
import { createClient } from "@/lib/supabase/server";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";

export type Client = Tables<"clients">;

export async function getClients(
  orgId: string,
  options?: { page?: number; pageSize?: number; search?: string },
): Promise<{
  data: Client[] | null;
  count: number | null;
  error: string | null;
}> {
  const supabase = createClient();
  const { page = 1, pageSize = 20, search } = options ?? {};

  let query = supabase
    .from("clients")
    .select("*", { count: "exact" })
    .eq("org_id", orgId)
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, count, error } = await query;

  if (error) return { data: null, count: null, error: error.message };
  return { data, count, error: null };
}
```

---

## 6. BUSINESS CONTEXT

### The existing production app

- Running at `expertiacrm-7e7eb` on Firebase Hosting
- Used by **one client** (Expertia Medical Solutions SL)
- Built as a single HTML monolith (~18k lines), React via Babel CDN, no bundler
- **Do not touch this repo**. It is a completely separate codebase

### This new project

- Greenfield Next.js app, clean architecture from day one
- The first customer will be migrated from Firebase to this app when it's ready
- Every subsequent customer onboards as a new `organization` row — no code changes needed
- Designed to be self-serve eventually (org creation, invitations, billing)

### Data migration strategy (when the time comes)

- Firebase collections map 1:1 to Supabase tables (see Section 4)
- Sequential counters (facturas, ofertas) must be seeded with current Firebase values to avoid number collision
- Passwords cannot be migrated — users will receive invitation emails to set new passwords
- Firebase Auth UIDs will not match Supabase UUIDs — migration script must handle the mapping

### Feature parity checklist (build in this order)

1. Auth (email + Google) + org creation + invitations
2. Clients CRUD + notes + reminders
3. Products CRUD
4. Offers with PDF export
5. Invoices with PDF export + payment tracking
6. Expenses
7. Dashboard with KPIs
8. Reports + Excel export
9. Bulk communication
10. Admin panel (user management, org settings)

---

## 7. USEFUL COMMANDS

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type-check without building
npm run type-check

# Lint
npm run lint

# Run unit tests (watch mode)
npm run test

# Run E2E tests
npm run test:e2e
```

### Supabase local development

```bash
# Start local Supabase stack (requires Docker)
npx supabase start

# Stop local stack
npx supabase stop

# Generate TypeScript types from local DB
npx supabase gen types typescript --local > src/types/database.types.ts

# Generate types from remote (production)
npx supabase gen types typescript --project-id <PROJECT_ID> > src/types/database.types.ts

# Apply pending migrations
npx supabase db push

# Create a new migration
npx supabase migration new <migration_name>

# Reset local DB (applies all migrations from scratch)
npx supabase db reset
```

### Build & Deploy

```bash
# Production build
npm run build

# Start production server locally
npm run start

# Deploy to Vercel (assumes Vercel CLI installed and project linked)
vercel --prod
```

### Database scripts

```bash
# Seed local database with demo org + users
npm run db:seed

# Verify RLS policies are working
npm run db:verify-rls
```

---

## 8. ENVIRONMENT VARIABLES

## Testing / QA (local only)

- **Credenciales de usuarios de prueba**: guardar/leer en `.local/test-users.json` (archivo **ignorado por git**).
- **Regla**: nunca escribir contraseñas en documentación versionada. Solo referencia al fichero local.

Required in `.env.local` (never commit this file):

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>   # Server-side only, never expose to client

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Expertis CRM"

# Optional: email provider for invitations
RESEND_API_KEY=<resend_key>
```

Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. The service role key must **never** be referenced from client components.

---

## 9. ARCHITECTURE DECISION LOG

| Decision                             | Rationale                                                                                       |
| ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Next.js App Router over Pages Router | RSC reduces client bundle; server actions simplify mutations                                    |
| Supabase over Firebase               | SQL + RLS is simpler for multi-tenant than Firestore security rules; Postgres is more queryable |
| TanStack Query for server state      | Separation of concerns; cache invalidation is explicit; no over-fetching                        |
| Zustand over Context API             | No re-render cascades; simpler API; DevTools support                                            |
| Named exports only                   | Enables refactoring tools to work reliably; avoids ambiguous import aliases                     |
| Result pattern over throw            | Services never throw — callers always handle errors explicitly                                  |
| Zod for validation                   | Single schema definition used for both TS types and runtime validation                          |
| `org_id` on every table              | Defense in depth alongside RLS; makes queries debuggable without relying on policy magic        |

---

_Last updated: April 2026. If you are an AI agent reading this — follow these rules precisely. When in doubt, ask before assuming._
