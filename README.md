# 🏀 NBA Zone

A fast, modern NBA dashboard presenting live standings, in-depth team statistics, latest schedules, and up-to-date NBA news and videos. Configured as a Next.js App Router application optimized for React 19.

## 🚀 Tech Stack

- **Framework:** Next.js 16
- **Frontend library:** React 19.2 (React Compiler Enabled)
- **State & Data Fetching:** TanStack React Query v5
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Icons:** `lucide-react` & `@lucide/lab`
- **Package Manager:** Bun

## 📡 APIs & Data Providers

- **ESPN Unofficial API:** Fetches live standings, team details, records, and schedules (e.g. `https://site.api.espn.com/apis/v2/sports/basketball/nba/standings`). See `espn-api-docs.md` for full endpoint documentation.
- **YouTube RSS & XML:** Pulls the latest basketball videos across the internet with parsed `media:attributes` for view counts.
- **Caching & Revalidation:** Fetches strongly rely on Next.js Server Component ISR (Incremental Static Regeneration) via `revalidate: 3600`, with TanStack React Query handling interactive client-side fetching.

## 🏁 Getting Started

Ensure you have [Bun](https://bun.sh/) installed, as it is the package manager for this project.

```bash
# 1. Install dependencies
bun install

# 2. Fire up the development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in action.

## 🧰 Useful Commands

| Command                     | Action                                                      |
| :-------------------------- | :---------------------------------------------------------- |
| `bun dev`                   | Starts local dev server                                     |
| `bun build`                 | Builds app for production                                   |
| `bun lint`                  | Runs strict ESLint                                          |
| `bun format`                | Runs Prettier to auto-format code and sort Tailwind classes |
| `bun run shadcn add [name]` | Adds a new shadcn component                                 |

## 🤖 AI Context

If you are an AI agent analyzing this repo (Copilot, Cursor, etc.), refer to `AGENTS.md` for specific architectural styling and React 19 server-component fetching conventions.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
