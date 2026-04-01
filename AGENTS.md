# AI Coding Agent Instructions (NBA Hub)

## Project Context

**NBA Hub** is a modern Next.js dashboard that displays live NBA standings, detailed team profiles (stats, schedules), and the latest NBA news/videos.

## Tech Stack & Environment

- **Next.js 16** (App Router, React Server Components)
- **React 19.2** (React Compiler enabled via `next.config.ts`)
- **TanStack React Query v5** (Client-side data fetching and caching)
- **Tailwind CSS v4** (OKLCH, CSS variables, no more tailwind.config.js)
- **TypeScript** (Strict mode)
- **Bun** (Package manager - use `bun add`, NOT `npm install`)
- **Path Alias:** `@/*` → `./src/*`

## Project Structure & Architecture

```text
src/
├── app/              # App Router pages (standings, teams/[teamId], news)
│   ├── globals.css   # Tailwind v4 imports + theme CSS variables
│   └── layout.tsx    # Root layout with next-themes ThemeProvider
├── components/       # Custom components (e.g., layout/site-header.tsx)
│   └── ui/           # Auto-generated shadcn components (DO NOT MODIFY DIRECTLY)
└── lib/
    ├── services/     # Data fetching services (standingsService.ts, youtubeService.ts, etc.)
    └── utils.ts      # cn() utility for className merging
```

## Data Sources & APIs (Crucial for Agents)

- **ESPN Unofficial API**: Used for fetching structured JSON data.
  - `https://site.api.espn.com/apis/v2/sports/basketball/nba/standings`
  - `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/[id]`
  - Always map complex ESPN stats properties directly into strictly typed interfaces (e.g. `NbaTeamStanding`, `NbaTeamDetail`) in the `src/lib/services/` directory before passing to components.
- **YouTube RSS Feeds**: Used for fetching latest NBA videos.
  - We use standard `xml2js` to parse these XML feeds, targeting `media:statistics` for formatted view counts.

## Strict AI Rules & Best Practices

### React & Next.js

- **Default to Server Components:** Omit `'use client'` unless the component requires interactivity, hooks, or browser APIs. All server-side data fetching must happen in Server Components using `await fetch(..., { next: { revalidate: 3600 } })` (Incremental Static Regeneration). Use TanStack React Query for complex client-side data fetching, polling, or mutations.
- **AVOID `useEffect`:** Do NOT use `useEffect` unless absolutely necessary (e.g., syncing with non-React external systems). Prefer derived state, event handlers, or React 19 features.
- **React Compiler is ENABLED:** Do NOT manually use `useMemo` or `useCallback` unless specifically required for bypassing a compiler limitation. The compiler handles memoization.
- **File Naming Conventions:** Use **kebab-case** for all component files (e.g., `site-header.tsx`, `team-card.tsx`). Services and utilities should remain `camelCase`.

### Styling & Theming

- **Tailwind Only:** Use utility classes and `@/lib/utils` `cn()` for merging.
- **Use CSS Variables:** Always use theme tokens (e.g., `text-muted-foreground`, `bg-background`). NEVER use hardcoded HEX/RGB values.
- **Dark Mode:** Managed by `next-themes`. Use the `dark:*` variant for specific overrides, but rely on CSS variables for primary theming.
- **Icons:** We use `lucide-react` and `@lucide/lab`.

## Commands

```bash
bun dev                              # Dev server
bun build                            # Production build
bun lint && bun format               # ESLint and Prettier
bun run shadcn add <component_name>  # Add a shadcn component
```

## UI Components (shadcn/ui)

Always prefer using pre-built components over creating new ones.
**Available:** Accordion, Alert, Alert Dialog, Aspect Ratio, Avatar, Badge, Breadcrumb, Button, Button Group, Chart, Calendar, Card, Carousel, Checkbox, Collapsible, Combobox, Command, Context Menu, Data Table, Date Picker, Dialog, Drawer, Dropdown Menu, Empty, Field, Form, Hover Card, Input, Input Group, Input OTP, Item, Kbd, Label, Menubar, Native Select, Navigation Menu, Pagination, Popover, Progress, Radio Group, Resizable, Scroll Area, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Spinner, Switch, Table, Tabs, Textarea, Toast, Toggle, Toggle Group, Tooltip, Icon.

### Component Composition Rule

**Do NOT modify shadcn/ui components in `src/components/ui/` directly.** Instead, compose and extend them in `src/components/`.
