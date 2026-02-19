# HCP Dashboard

A Next.js dashboard application for healthcare professionals (HCP), with modules for learning, documents, case files, and notifications.

## Overview

HCP Dashboard is a modern web app built with the Next.js App Router. It provides a main layout with navigation to Dashboard, Learning, Documents, Case Files, and Notifications. The UI uses Tailwind CSS and component libraries for data tables, charts, drag-and-drop, and accessible primitives.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **UI:** [React 19](https://react.dev), [Tailwind CSS 4](https://tailwindcss.com), [shadcn](https://ui.shadcn.com)
- **Data & tables:** [TanStack Table](https://tanstack.com/table), [Recharts](https://recharts.org)
- **Interactions:** [dnd-kit](https://dndkit.com) (drag and drop), [Radix UI](https://radix-ui.com), [Vaul](https://vaul.emilkowal.ski)
- **Icons:** [Lucide React](https://lucide.dev), [Tabler Icons](https://tabler.io/icons)
- **Utilities:** [Zod](https://zod.dev), [clsx](https://github.com/lukeed/clsx) / [tailwind-merge](https://github.com/dcastil/tailwind-merge), [Sonner](https://sonner.emilkowal.ski) (toasts)

## Project Structure

```
app/
├── (main)/              # Main app layout group
│   ├── dashboard/       # Main dashboard view
│   ├── learning/       # Learning module
│   ├── documents/      # Documents management
│   ├── case-files/     # Case files list and detail ([id])
│   └── notifications/  # Notifications
├── layout.tsx          # Root layout and fonts
├── page.tsx            # Entry / landing
└── globals.css
```

## Prerequisites

- [Node.js](https://nodejs.org) (v18+ recommended)
- npm, yarn, pnpm, or bun

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

2. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser. The app will hot-reload as you edit files under `app/` and `components/`.

## Available Scripts

| Command        | Description                    |
|----------------|--------------------------------|
| `npm run dev`  | Start dev server (port 3000)   |
| `npm run build`| Build for production           |
| `npm run start`| Run production server          |
| `npm run lint` | Run ESLint                     |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) — routing, data fetching, and deployment
- [Learn Next.js](https://nextjs.org/learn) — interactive tutorial
- [Next.js GitHub repository](https://github.com/vercel/next.js) — feedback and contributions
