export interface NbaTeamStanding {
  id: string
  uid: string
  name: string
  abbreviation: string
  displayName: string
  logo: string
  color: string
  alternateColor: string
  seed: number
  wins: number
  losses: number
  winPercent: string
  gamesBehind: string
  homeRecord: string
  awayRecord: string
  streak: string
  l10: string
  pointsFor: string
  pointsAgainst: string
  diff: string
}

export interface NbaConferenceStandings {
  id: string
  name: string
  abbreviation: string
  teams: NbaTeamStanding[]
}

// Helper types for the ESPN response
type EspnStat = {
  name: string
  displayValue?: string
  value?: number
}

type EspnTeam = {
  id: string
  uid: string
  name: string
  abbreviation: string
  displayName: string
  logos?: { href: string }[]
  color?: string
  alternateColor?: string
}

type EspnEntry = {
  team: EspnTeam
  stats: EspnStat[]
}

type EspnConference = {
  id: string
  name: string
  abbreviation: string
  standings: {
    entries: EspnEntry[]
  }
}

export const getStandings = async (): Promise<NbaConferenceStandings[]> => {
  try {
    const response = await fetch(
      "https://site.api.espn.com/apis/v2/sports/basketball/nba/standings",
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) throw new Error("Failed to fetch standings")

    const data = await response.json()

    return data.children.map((conf: EspnConference) => ({
      id: conf.id,
      name: conf.name,
      abbreviation: conf.abbreviation,
      teams: conf.standings.entries
        .map((entry: EspnEntry) => {
          const team = entry.team
          const stats = entry.stats

          const getStat = (name: string, fallback = "0") => {
            const stat = stats.find((s) => s.name === name)
            return stat
              ? stat.displayValue || stat.value?.toString() || fallback
              : fallback
          }

          return {
            id: team.id,
            uid: team.uid,
            name: team.name,
            abbreviation: team.abbreviation,
            displayName: team.displayName,
            logo: team.logos?.[0]?.href || "",
            color: team.color || "",
            alternateColor: team.alternateColor || "",
            seed: Number(getStat("playoffSeed", "0")),
            wins: Number(getStat("wins", "0")),
            losses: Number(getStat("losses", "0")),
            winPercent: getStat("winPercent", ".000"),
            gamesBehind: getStat("gamesBehind", "-"),
            homeRecord: getStat("Home", "0-0"),
            awayRecord: getStat("Road", "0-0"),
            streak: getStat("streak", "-"),
            l10: getStat("Last Ten Games", "0-0"),
            pointsFor: getStat("avgPointsFor", "0.0"),
            pointsAgainst: getStat("avgPointsAgainst", "0.0"),
            diff: getStat("pointDifferential", "+0.0"),
          }
        })
        .sort((a, b) => a.seed - b.seed),
    }))
  } catch (error) {
    console.error("Standings service error:", error)
    return []
  }
}
