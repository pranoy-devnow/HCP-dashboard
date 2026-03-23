# HCP Dashboard – Project Context

Important context for developers and AI assistants: tech stack, structure, config, and operational details.

---

## 1. Project overview

- **Name:** HCP Dashboard  
- **Purpose:** Healthcare Professional (HCP) dashboard for **Medela** – manage case files, notifications, learning, and documents in one place.  
- **Type:** Next.js web app (App Router), single frontend codebase.  
- **Workspace:** Project root is `HCP dasboard`; the Next.js app lives at the **repo root** (no `hcpdashboard/` subfolder).

---

## 2. Tech stack

| Category        | Technologies |
|----------------|--------------|
| **Framework**  | Next.js 16.1.6 (App Router) |
| **UI / React** | React 19.2.3, React DOM 19.2.3 |
| **Styling**    | Tailwind CSS 4, PostCSS 4, tw-animate-css, class-variance-authority, clsx, tailwind-merge |
| **Components** | shadcn/ui, Radix UI, Vaul (drawer) |
| **Data / tables** | TanStack React Table 8.x, Recharts |
| **Interactions**  | @dnd-kit (core, sortable, modifiers, utilities) – drag and drop |
| **Icons**      | Lucide React, Tabler Icons React |
| **Utilities**  | Zod 4.x (validation), Sonner (toasts) |
| **Language**   | TypeScript 5.x |
| **Linting**    | ESLint 9, eslint-config-next 16.1.6 |

---

## 3. Key versions (reference)

- **Node.js:** v18+ recommended  
- **Next.js:** 16.1.6  
- **React:** 19.2.3  
- **TypeScript:** ^5  
- **Tailwind:** ^4  

---

## 4. Project structure

```
<repo root>/
├── app/
│   ├── (main)/              # Main app layout group
│   │   ├── dashboard/       # Main dashboard
│   │   ├── learning/       # Learning module
│   │   ├── documents/      # Documents
│   │   ├── case-files/     # Case files (list + [id] detail)
│   │   └── notifications/  # Notifications
│   ├── layout.tsx          # Root layout, fonts (Geist, Geist Mono)
│   ├── page.tsx            # Entry / landing
│   └── globals.css
├── components/              # App-specific components
│   ├── ui/                  # shadcn-style primitives (button, card, table, etc.)
│   ├── app-sidebar.tsx, site-header.tsx, nav-*.tsx, etc.
│   ├── data-table.tsx, chart-area-interactive.tsx
│   └── login-form.tsx, notification-timeline.tsx, section-cards.tsx
├── lib/                     # Utilities and data helpers
│   ├── utils.ts
│   ├── auth-session.ts
│   ├── case-files-data.ts
│   ├── notifications-data.ts
│   └── time-since-birth.ts
├── next.config.ts
├── tsconfig.json            # Path alias: @/* → ./*
├── eslint.config.mjs
├── postcss.config.mjs
└── package.json
```

---

## 5. Configuration

- **Path alias:** `@/*` → `./*` (e.g. `@/components/...`, `@/lib/...`).  
- **Next.js:** `next.config.ts` – minimal config.  
- **TypeScript:** `target` ES2017, `strict`, `moduleResolution: "bundler"`.  
- **ESLint:** Next.js core-web-vitals + TypeScript rules.  
- **Fonts:** Geist, Geist Mono (next/font/google).  

---

## 6. Scripts (from package.json)

| Command           | Description              |
|-------------------|--------------------------|
| `npm run dev`     | Start dev server (Next.js, default port 3000) |
| `npm run build`   | Production build         |
| `npm run start`   | Run production server    |
| `npm run lint`    | Run ESLint               |

---

## 7. Environment / deployment

- **Base URL:**  
  - Production: `https://${process.env.VERCEL_URL}` (when on Vercel).  
  - Else: `process.env.NEXT_PUBLIC_APP_URL` or `http://localhost:3000`.  
- **Relevant env vars:** `VERCEL_URL`, `NEXT_PUBLIC_APP_URL`.  
- **Deployment:** Layout references Vercel; app is suitable for Vercel deployment.

No `.env` or `.env.example` files are present in the repo; add them as needed for local secrets and `NEXT_PUBLIC_*` overrides.

---

## 8. GitHub & version control

- **Current state:** Project is in a Git repository (default branch `main`).  
- **Remote `origin` (canonical):** `git@github.com:pranoy-devnow/HCP-dashboard.git`  
  - HTTPS equivalent: `https://github.com/pranoy-devnow/HCP-dashboard.git`
- **Default branch:** `main`  
- **Branch strategy / CI:** Use feature branches as needed; Vercel or GitHub Actions can run build/lint on push.

**First-time setup** (if `origin` is not set yet), from the project root (`HCP dasboard`):

```bash
git remote add origin git@github.com:pranoy-devnow/HCP-dashboard.git
git push -u origin main
```

**Push updates to `main`:**

```bash
git push origin main
```

---

## 9. Prerequisites & getting started

- **Prerequisites:** Node.js v18+, npm / yarn / pnpm / bun.  
- **Install:** From the repo root: `npm install` (or equivalent).  
- **Run dev:** `npm run dev` → [http://localhost:3000](http://localhost:3000).  

---

## 10. Quick reference

- **App entry:** `app/page.tsx`, `app/layout.tsx`.  
- **Main layout/shell:** `app/(main)/layout.tsx`, sidebar/header in `components/`.  
- **Shared UI:** `components/ui/`.  
- **Data/helpers:** `lib/`. **API layer:** `services/`, **types:** `types/`.  
- **Metadata:** Title “HCP Dashboard”, description and OpenGraph set in root `app/layout.tsx`.

---

## 11. Cursor Coding Rules

Rules for all agents and developers coding in this project.

### 1. Write Code for Humans

Code must be easy to read and understand.
Prefer clarity over clever or complex solutions.

---

### 2. Use Clear Naming

Use meaningful names.

* Components → `PascalCase`
* Functions → `camelCase`
* Constants → `UPPER_CASE`

Example: `getEmployeeInsights()` not `getEI()`.

---

### 3. Keep Files Small

Each file should have **one responsibility**.
Avoid large files with mixed logic.

---

### 4. Separate UI, Logic, and Data

* **Components** → UI
* **Hooks / utils** → logic
* **Services** → API calls

Never mix everything in one component.

---

### 5. Do Not Call APIs in Components

All backend communication must go through **service files**.

Example: `services/insightService.ts`

---

### 6. Avoid Deep Nesting

Use early returns instead of nested conditions.

**Bad:** multiple `if` levels.

**Good:** return early when conditions fail.

---

### 7. Reusable Components

If something appears **more than twice**, create a reusable component.

Example: `<Button />`, `<Card />`

---

### 8. Use TypeScript Properly

Define types for:

* props
* API responses
* data models

---

### 9. Handle Errors Properly

Always use `try / catch` and log meaningful errors.

---

### 10. Keep Folder Structure Clean

```
/app
/components
/hooks
/services
/types
/lib
```

---

### 11. No Hardcoded Values

Use environment variables for configs and URLs.

Example: `process.env.API_URL`

---

### 12. Comment the Why

Explain **why something exists**, not what the code does.

---

### 13. Prefer Simple Solutions

Choose the **simplest solution that works**.
