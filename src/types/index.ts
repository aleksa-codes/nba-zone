export interface Team {
  teamId: string
  teamName: string
  teamCity: string
  teamTricode: string
  wins: number
  losses: number
  score: number
  logo: string
  color: string
  alternateColor: string
  injuries: string[]
  linescores: number[]
}

export interface Game {
  gameId: string
  gameStatus: number
  gameStatusText: string
  gameTimeUTC: string
  homeTeam: Team
  awayTeam: Team
  odds?: {
    details: string
    overUnder: number
  }
  broadcasters: string[]
}

export interface EspnResponse {
  events: EspnEvent[]
}

export interface EspnEvent {
  id: string
  date: string
  status: {
    type: {
      name: string
      shortDetail: string
    }
  }
  competitions: EspnCompetition[]
}

export interface EspnCompetition {
  competitors: EspnCompetitor[]
  odds?: {
    details: string
    overUnder: number
  }[]
  broadcasts?: {
    names: string[]
  }[]
}

export interface EspnCompetitor {
  homeAway: string
  score: string
  team: {
    id: string
    name: string
    location: string
    abbreviation: string
    logo: string
    color: string
    alternateColor: string
  }
  records?: {
    name: string
    summary: string
  }[]
  linescores?: {
    value: number
  }[]
}

export interface EspnRosterResponse {
  athletes: {
    displayName: string
    injuries?: {
      status: string
    }[]
  }[]
}

export interface NbaTeam {
  id: string
  uid: string
  slug: string
  abbreviation: string
  displayName: string
  shortDisplayName: string
  name: string
  nickname: string
  location: string
  color: string
  alternateColor: string
  isActive: boolean
  logos: {
    href: string
    alt: string
    rel: string[]
    width: number
    height: number
  }[]
  links: {
    language: string
    rel: string[]
    href: string
    text: string
    shortText: string
    isExternal: boolean
    isPremium: boolean
  }[]
}
