import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getTeamDetails, getTeamRoster } from "@/lib/services/espnService"
import {
  Activity,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  Globe,
  MapPin,
  Percent,
  Trophy,
} from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ teamId: string }>
}): Promise<Metadata> {
  const { teamId } = await params
  const team = (await getTeamDetails(teamId)) as any

  if (!team) {
    return {
      title: "Team Not Found",
    }
  }

  return {
    title: `${team.displayName || team.name || "Team"} stats, schedule & news`,
    description: `View ${team.displayName || team.name || "Team"} roster, season stats, and upcoming schedule.`,
  }
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ teamId: string }>
}) {
  const { teamId } = await params
  const [teamInfo, roster] = await Promise.all([
    getTeamDetails(teamId),
    getTeamRoster(teamId),
  ])

  const team = teamInfo as
    | Record<string, unknown>
    | null
    | ReturnType<typeof JSON.parse>

  if (!team) {
    notFound()
  }

  const logo = team.logos?.[0]?.href

  return (
    <div className="container mx-auto flex flex-col gap-8 py-8">
      {/* Premium Hero Section */}
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-xl"
        style={{
          background: `linear-gradient(135deg, #${team.color} 0%, #${team.alternateColor || "111"} 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />

        <div className="relative z-10 flex flex-col items-center gap-8 p-8 text-white md:flex-row md:items-center md:p-12">
          <Link
            href="/teams"
            className="absolute top-4 left-4 z-20 hidden md:block"
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </Link>

          <Link
            href="/teams"
            className="mb-2 flex items-center justify-center gap-1 text-sm text-white/80 hover:text-white md:hidden"
          >
            <ChevronLeft className="h-4 w-4" /> Back to teams
          </Link>

          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md md:h-48 md:w-48">
            {logo && (
              <Image
                src={logo}
                alt={team.displayName}
                fill
                className="object-contain p-4 drop-shadow-2xl"
              />
            )}
          </div>

          <div className="flex flex-1 flex-col gap-3 text-center drop-shadow-lg md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
              {team.displayName}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-3 text-lg font-medium text-white/90 md:justify-start">
              {team.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-5 w-5" /> {team.location}{" "}
                  {team.abbreviation && (
                    <span className="ml-1 text-sm opacity-75">
                      ({team.abbreviation})
                    </span>
                  )}
                </span>
              )}
              {team.location && <span className="opacity-50">•</span>}
              <span className="flex items-center gap-1">
                <Trophy className="h-5 w-5" />{" "}
                {team.record?.items?.[0]?.summary || "0-0"}
              </span>
              <span className="opacity-50">•</span>
              <span>{team.standingSummary || "N/A"}</span>
              {team.franchise?.venue?.fullName && (
                <>
                  <span className="opacity-50">•</span>
                  <span>{team.franchise.venue.fullName}</span>
                </>
              )}
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
              {team.links?.map((link: { text: string; href: string }) => (
                <Link
                  key={link.text}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-9 gap-2 border-none bg-white/20 font-semibold text-white shadow-sm hover:bg-white/30"
                  >
                    {link.text === "Website" ? (
                      <Globe className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                    {link.text}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="border-border/50 bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-primary" /> Season Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            {team.record?.items?.[0]?.stats ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                {team.record.items[0].stats
                  .filter((s: { name: string; value: number }) =>
                    [
                      "avgPointsFor",
                      "avgPointsAgainst",
                      "pointDifferential",
                      "winPercent",
                      "playoffSeed",
                      "streak",
                    ].includes(s.name)
                  )
                  .map((s: { name: string; value: number }) => {
                    const labelMap: Record<string, string> = {
                      avgPointsFor: "Points/G",
                      avgPointsAgainst: "Opp Points/G",
                      pointDifferential: "Differential",
                      winPercent: "Win %",
                      playoffSeed: "Conf. Seed",
                      streak: "Current Streak",
                    }
                    const formattedName =
                      labelMap[s.name] ||
                      s.name.replace(/([A-Z])/g, " $1").trim()

                    return (
                      <div key={s.name}>
                        <p className="mb-1 text-sm leading-none font-semibold text-muted-foreground capitalize">
                          {formattedName}
                        </p>
                        <p className="text-xl font-bold tabular-nums">
                          {s.name === "winPercent"
                            ? s.value.toFixed(3).replace(/^0+/, "")
                            : typeof s.value === "number" && s.value % 1 !== 0
                              ? s.value.toFixed(1)
                              : s.value}
                        </p>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No advanced stats available.
              </p>
            )}
          </CardContent>
        </Card>

        {team.nextEvent &&
          team.nextEvent[0] &&
          (() => {
            const evt = team.nextEvent[0]
            const isHome =
              evt.competitions[0].competitors.find(
                (c: { id: string; homeAway?: string }) => c.id === team.id
              )?.homeAway === "home"
            const opponent = evt.competitions[0].competitors.find(
              (c: { id: string; team?: Record<string, unknown> }) =>
                c.id !== team.id
            )?.team as Record<string, string | { href: string }[]> | undefined

            return (
              <Card
                className="relative flex flex-col overflow-hidden border-border/50 bg-card shadow-sm"
                style={{
                  background: opponent?.color
                    ? `linear-gradient(135deg, #${team.color}15 0%, transparent 40%, transparent 60%, #${opponent.color}15 100%)`
                    : undefined,
                }}
              >
                <div
                  className="absolute inset-x-0 top-0 h-1 opacity-80"
                  style={{
                    background: opponent?.color
                      ? `linear-gradient(to right, #${team.color}, #${opponent.color})`
                      : undefined,
                  }}
                />
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-bold text-primary">
                      <Calendar className="h-5 w-5" /> Next Game
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-background/50 font-mono text-[10px] tracking-wider uppercase backdrop-blur-sm"
                    >
                      {isHome ? "HOME" : "AWAY"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-center">
                  <div className="flex items-center justify-between gap-4">
                    {/* Home Team / Current Team setup */}
                    <div className="flex w-1/3 flex-col items-center gap-2 text-center">
                      <div className="relative h-16 w-16 drop-shadow-md">
                        <Image
                          src={
                            isHome
                              ? `https://a.espncdn.com/i/teamlogos/nba/500/${team.abbreviation.toLowerCase()}.png`
                              : typeof opponent?.logos?.[0] === "string"
                                ? opponent?.logos?.[0]
                                : opponent?.logos?.[0]?.href || ""
                          }
                          alt="Team Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="w-full truncate text-xs font-bold text-muted-foreground">
                        {isHome
                          ? team.abbreviation
                          : opponent?.abbreviation || opponent?.displayName}
                      </span>
                    </div>

                    {/* VS Info & Date */}
                    <div className="flex w-1/3 flex-col items-center justify-center text-center">
                      <span className="mb-2 text-xl font-bold text-muted-foreground/30">
                        VS
                      </span>
                      <div className="flex flex-col items-center">
                        <span className="text-base font-semibold tracking-tight text-foreground">
                          {new Date(evt.date).toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="mt-0.5 text-xs font-medium whitespace-nowrap text-muted-foreground">
                          {new Date(evt.date).toLocaleString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Away Team / Opponent setup */}
                    <div className="flex w-1/3 flex-col items-center gap-2 text-center">
                      <div className="relative h-16 w-16 drop-shadow-md">
                        <Image
                          src={
                            !isHome
                              ? `https://a.espncdn.com/i/teamlogos/nba/500/${team.abbreviation.toLowerCase()}.png`
                              : typeof opponent?.logos?.[0] === "string"
                                ? opponent?.logos?.[0]
                                : opponent?.logos?.[0]?.href || ""
                          }
                          alt="Team Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="w-full truncate text-xs font-bold text-muted-foreground">
                        {!isHome
                          ? team.abbreviation
                          : opponent?.abbreviation || opponent?.displayName}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })()}
      </div>

      <div className="mt-8">
        <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Activity className="h-6 w-6 text-primary" /> Active Roster
        </h3>
        {roster?.length ? (
          <div className="overflow-hidden rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-62.5">Player</TableHead>
                  <TableHead>PTS</TableHead>
                  <TableHead>REB</TableHead>
                  <TableHead>AST</TableHead>
                  <TableHead>Pos</TableHead>
                  <TableHead>Height</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...roster]
                  .sort((a, b) => {
                    const activeA = a.injuries && a.injuries.length > 0 ? 0 : 1
                    const activeB = b.injuries && b.injuries.length > 0 ? 0 : 1
                    if (activeA !== activeB) return activeB - activeA

                    const ptsA = parseFloat(a.stats?.pts || "0") || 0
                    const ptsB = parseFloat(b.stats?.pts || "0") || 0
                    return ptsB - ptsA
                  })
                  .map((player) => {
                    const isInjured =
                      player.injuries && player.injuries.length > 0
                    const injuryText = isInjured
                      ? player.injuries![0].status
                      : "Active"

                    return (
                      <TableRow key={player.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted/20">
                              {player.headshot?.href ? (
                                <Image
                                  src={player.headshot.href}
                                  alt={player.fullName}
                                  fill
                                  sizes="128px"
                                  className="scale-125 object-cover object-top"
                                />
                              ) : (
                                <span className="font-bold text-muted-foreground/50">
                                  {player.jersey || "?"}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold whitespace-nowrap">
                                {player.fullName}
                              </span>
                              {player.jersey && (
                                <span className="text-xs text-muted-foreground">
                                  #{player.jersey}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold whitespace-nowrap">
                          {player.stats?.pts || "-"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {player.stats?.reb || "-"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {player.stats?.ast || "-"}
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap text-muted-foreground">
                          {player.position?.name || "-"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {player.displayHeight || "-"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {player.displayWeight || "-"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {player.age || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          {isInjured ? (
                            <Badge
                              variant="destructive"
                              className="ml-auto flex w-fit items-center gap-1.5 text-[10px] uppercase"
                            >
                              <Activity className="h-3 w-3" /> {injuryText}
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="ml-auto w-fit bg-emerald-500/10 text-[10px] font-bold text-emerald-600 uppercase hover:bg-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400"
                            >
                              Active
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-muted/20 py-12 text-center text-muted-foreground">
            No active roster data available.
          </div>
        )}
      </div>
    </div>
  )
}
