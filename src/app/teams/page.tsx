import { TeamCard } from "@/components/teams/team-card"
import { getAllTeams } from "@/lib/services/espnService"
import { Trophy } from "lucide-react"

export const metadata = {
  title: "NBA Teams | NBA Hub",
  description: "View all NBA teams and their current stats.",
}

export default async function TeamsPage() {
  const teams = await getAllTeams()

  // Sort alphabetically by team full name
  const sortedTeams = teams.sort((a, b) =>
    a.displayName.localeCompare(b.displayName)
  )

  return (
    <div className="container py-8">
      <div className="mb-10 max-w-2xl">
        <h1 className="flex items-center gap-3 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
          <span className="flex items-center justify-center rounded-xl bg-orange-500/10 p-3 shadow-inner">
            <Trophy className="h-8 w-8 text-orange-500" />
          </span>
          NBA Teams
        </h1>
        <p className="mt-4 text-lg font-medium text-muted-foreground">
          Explore all franchises in the National Basketball Association. Select
          a team to view their roster, season stats, and upcoming schedule.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-6">
        {sortedTeams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  )
}
