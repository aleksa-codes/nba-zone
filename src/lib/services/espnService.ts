import { getNBADate } from "@/lib/utils"
import {
  EspnCompetitor,
  EspnEvent,
  EspnRosterResponse,
  Game,
  NbaTeam,
  Team,
} from "@/types"

const ESPN_SCOREBOARD_API_URL =
  "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard"
const ESPN_ROSTER_API_BASE_URL =
  "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/"

const mapCompetitorToTeam = (competitor: EspnCompetitor): Team => {
  const overallRecord = competitor.records?.find((r) => r.name === "overall")
  let wins = 0
  let losses = 0
  if (overallRecord?.summary) {
    ;[wins, losses] = overallRecord.summary.split("-").map(Number)
  }

  const linescores = competitor.linescores?.map((ls) => ls.value) || []

  return {
    teamId: competitor.team.id,
    teamName: competitor.team.name,
    teamCity: competitor.team.location,
    teamTricode: competitor.team.abbreviation,
    wins: wins,
    losses: losses,
    score: parseInt(competitor.score, 10) || 0,
    logo: competitor.team.logo,
    color: competitor.team.color || "000000",
    alternateColor: competitor.team.alternateColor || "ffffff",
    injuries: [], // Will be populated later from Roster API
    linescores: linescores,
  }
}

const mapEventToGame = (event: EspnEvent): Game => {
  const competition = event.competitions[0]
  const homeCompetitor = competition.competitors.find(
    (c) => c.homeAway === "home"
  )
  const awayCompetitor = competition.competitors.find(
    (c) => c.homeAway === "away"
  )

  if (!homeCompetitor || !awayCompetitor) {
    throw new Error(`Could not find home or away team for game ${event.id}`)
  }

  let gameStatus: number
  const statusType = event.status.type.name

  if (statusType === "STATUS_SCHEDULED") {
    gameStatus = 1
  } else if (
    statusType === "STATUS_IN_PROGRESS" ||
    statusType === "STATUS_HALFTIME" ||
    statusType === "STATUS_END_PERIOD"
  ) {
    gameStatus = 2
  } else {
    gameStatus = 3
  }

  const gameStatusText = event.status.type.shortDetail

  // Extract Odds
  let odds = undefined
  if (competition.odds && competition.odds.length > 0) {
    odds = {
      details: competition.odds[0].details,
      overUnder: competition.odds[0].overUnder,
    }
  }

  // Extract Broadcasters (National TV usually)
  const broadcasters: string[] = []
  if (competition.broadcasts) {
    competition.broadcasts.forEach((b) => {
      if (b.names && b.names.length > 0) {
        broadcasters.push(...b.names)
      }
    })
  }

  return {
    gameId: event.id,
    gameStatus: gameStatus,
    gameStatusText: gameStatusText,
    gameTimeUTC: event.date,
    homeTeam: mapCompetitorToTeam(homeCompetitor),
    awayTeam: mapCompetitorToTeam(awayCompetitor),
    odds: odds,
    broadcasters: broadcasters,
  }
}

const fetchAndMapRosterInjuries = async (games: Game[]): Promise<Game[]> => {
  try {
    const teamMap = new Map<string, Team>()
    games.forEach((game) => {
      teamMap.set(game.homeTeam.teamId, game.homeTeam)
      teamMap.set(game.awayTeam.teamId, game.awayTeam)
    })

    const uniqueTeams = Array.from(teamMap.values())

    // Limit concurrency to avoid hitting rate limits too hard if scaling,
    // but for simple usage, Promise.all is fine.
    // We cache this if possible, but for now direct fetch.

    const rosterPromises = uniqueTeams.map((team) => {
      const url = `${ESPN_ROSTER_API_BASE_URL}${team.teamTricode}/roster`
      return fetch(url)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: EspnRosterResponse | null) => ({
          teamId: team.teamId,
          data,
        }))
    })

    const results = await Promise.all(rosterPromises)

    for (const result of results) {
      if (result && result.data) {
        const team = teamMap.get(result.teamId)
        if (team) {
          const injuries: string[] = []
          result.data.athletes.forEach((player) => {
            if (player.injuries && player.injuries.length > 0) {
              const injuryStatus = player.injuries[0].status
              // Filter for major statuses to keep UI clean if needed,
              // but for betting, all injuries matter.
              injuries.push(`${player.displayName} (${injuryStatus})`)
            }
          })
          team.injuries = injuries
        }
      }
    }

    return games
  } catch (error) {
    console.error("Failed to fetch or map roster injuries:", error)
    return games // Return original games on error
  }
}

export const getMatchesByDate = async (date: Date): Promise<Game[]> => {
  try {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const dateString = `${year}${month}${day}`

    const response = await fetch(
      `${ESPN_SCOREBOARD_API_URL}?dates=${dateString}&limit=100&cb=${new Date().getTime()}`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Quick typings hack since EspnResponse isn't fully exported maybe
    const data = await response.json()
    const espnGames = data.events.map(mapEventToGame)

    const isToday = date.toDateString() === new Date().toDateString()
    if (isToday) {
      return await fetchAndMapRosterInjuries(espnGames)
    }

    return espnGames
  } catch (error) {
    console.error("Failed to fetch matches from ESPN:", error)
    throw error
  }
}

export const getTodaysMatches = async (): Promise<Game[]> => {
  return getMatchesByDate(getNBADate(0))
}

export const getYesterdaysMatches = async (): Promise<Game[]> => {
  return getMatchesByDate(getNBADate(-1))
}

export const getAllTeams = async (): Promise<NbaTeam[]> => {
  try {
    const response = await fetch(
      "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams?limit=50",
      {
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    )
    if (!response.ok) throw new Error("Failed to fetch teams")
    const data = await response.json()
    return data.sports[0].leagues[0].teams.map((t: { team: NbaTeam }) => t.team)
  } catch (error) {
    console.error("Failed to fetch teams:", error)
    return []
  }
}

export const getTeamDetails = async (id: string): Promise<unknown> => {
  try {
    const response = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${id}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    )
    if (!response.ok) throw new Error(`Failed to fetch team ${id}`)
    const data = await response.json()
    return data.team
  } catch (error) {
    console.error(`Failed to fetch team ${id}:`, error)
    return null
  }
}
