import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTeamDetails } from "@/lib/services/espnService"
import {
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  Globe,
  MapPin,
  Percent,
  Trophy,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function TeamPage({
  params,
}: {
  params: Promise<{ teamId: string }>
}) {
  const { teamId } = await params
  const teamInfo = await getTeamDetails(teamId)
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
              <span className="flex items-center gap-1">
                <Trophy className="h-5 w-5" />{" "}
                {team.record?.items?.[0]?.summary || "0-0"}
              </span>
              <span className="opacity-50">•</span>
              <span>{team.standingSummary || "N/A"}</span>
              {team.franchise?.venue?.fullName && (
                <>
                  <span className="opacity-50">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-5 w-5" />{" "}
                    {team.franchise.venue.fullName}
                  </span>
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/50 bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" /> Franchise Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Location
                </p>
                <p className="text-lg font-medium">{team.location}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Abbreviation
                </p>
                <p className="text-lg font-medium">{team.abbreviation}</p>
              </div>
            </div>
            {team.franchise?.venue?.fullName && (
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  Arena
                </p>
                <p className="text-lg font-medium">
                  {team.franchise.venue.fullName}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

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

        {team.nextEvent && team.nextEvent[0] && (
          <Card className="border-border/50 bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-primary">
                  <Calendar className="h-5 w-5" /> Next Game
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {team.nextEvent?.[0] ? (
                <div className="flex flex-col gap-3">
                  <div className="rounded-xl border bg-muted/30 p-4">
                    <h4 className="flex items-center gap-2 text-lg font-bold">
                      {team.nextEvent[0].shortName}
                    </h4>
                    <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(team.nextEvent[0].date).toLocaleString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  <Badge variant="secondary" className="w-fit">
                    Upcoming Match
                  </Badge>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Schedule complete.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
