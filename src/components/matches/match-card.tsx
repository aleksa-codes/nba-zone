import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Game } from "@/types"
import { format } from "date-fns"
import { Tv } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function MatchCard({ game }: { game: Game }) {
  const isLive = game.gameStatus === 2
  const isFinished = game.gameStatus === 3
  const isScheduled = game.gameStatus === 1

  const date = new Date(game.gameTimeUTC)

  return (
    <Card
      className="relative w-full flex-col overflow-hidden shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
      style={{
        background: `linear-gradient(135deg, #${game.awayTeam.color}10 0%, transparent 40%, transparent 60%, #${game.homeTeam.color}10 100%)`,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1 opacity-80"
        style={{
          background: `linear-gradient(to right, #${game.awayTeam.color}, #${game.homeTeam.color})`,
        }}
      />
      {isLive && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-destructive">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-destructive"></span>
          </span>
          LIVE
        </div>
      )}
      <CardContent className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 p-6">
        {/* Away Team */}
        <div className="flex flex-col items-center gap-3">
          <Link
            href={`/teams/${game.awayTeam.teamId}`}
            className="group/logo relative"
          >
            <div
              className="absolute inset-0 rounded-full opacity-20 blur-md transition-opacity group-hover/logo:opacity-50"
              style={{ backgroundColor: `#${game.awayTeam.color}` }}
            />
            {game.awayTeam.logo ? (
              <Image
                src={game.awayTeam.logo}
                alt={game.awayTeam.teamName}
                width={64}
                height={64}
                className="relative z-10 h-16 w-16 object-contain drop-shadow-sm"
              />
            ) : (
              <div className="relative z-10 h-16 w-16 rounded-full bg-muted" />
            )}
          </Link>
          <div className="text-center">
            <p className="text-base leading-tight font-bold">
              {game.awayTeam.teamTricode}
            </p>
            <p className="mt-0.5 hidden text-xs font-medium text-muted-foreground sm:block">
              {game.awayTeam.wins}-{game.awayTeam.losses}
            </p>
          </div>
        </div>

        {/* Center Status */}
        <div className="flex flex-col items-center justify-center text-center">
          {isScheduled ? (
            <div className="flex flex-col items-center">
              <span className="text-base font-semibold tracking-tight">
                {format(date, "h:mm a")}
              </span>
              {game.broadcasters?.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Tv className="h-3.5 w-3.5" />
                  <span>{game.broadcasters[0]}</span>
                </div>
              )}
              {game.odds && (
                <span className="mt-1 rounded-md bg-muted/40 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  O/U: {game.odds.overUnder} | {game.odds.details}
                </span>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 tabular-nums">
              <span
                className={`text-4xl font-extrabold ${game.awayTeam.score > game.homeTeam.score && isFinished ? "text-foreground" : isFinished ? "text-muted-foreground opacity-50" : "text-foreground"}`}
              >
                {game.awayTeam.score}
              </span>
              <span className="text-lg font-bold text-muted-foreground/30">
                -
              </span>
              <span
                className={`text-4xl font-extrabold ${game.homeTeam.score > game.awayTeam.score && isFinished ? "text-foreground" : isFinished ? "text-muted-foreground opacity-50" : "text-foreground"}`}
              >
                {game.homeTeam.score}
              </span>
            </div>
          )}

          {!isScheduled && (
            <div className="mt-3">
              <Badge
                variant={isLive ? "destructive" : "secondary"}
                className="h-6 px-2.5 text-xs font-semibold tracking-wider uppercase"
              >
                {game.gameStatusText}
              </Badge>
            </div>
          )}
        </div>

        {/* Home Team */}
        <div className="flex flex-col items-center gap-3">
          <Link
            href={`/teams/${game.homeTeam.teamId}`}
            className="group/logo relative"
          >
            <div
              className="absolute inset-0 rounded-full opacity-20 blur-md transition-opacity group-hover/logo:opacity-50"
              style={{ backgroundColor: `#${game.homeTeam.color}` }}
            />
            {game.homeTeam.logo ? (
              <Image
                src={game.homeTeam.logo}
                alt={game.homeTeam.teamName}
                width={64}
                height={64}
                className="relative z-10 h-16 w-16 object-contain drop-shadow-sm"
              />
            ) : (
              <div className="relative z-10 h-16 w-16 rounded-full bg-muted" />
            )}
          </Link>
          <div className="text-center">
            <p className="text-base leading-tight font-bold">
              {game.homeTeam.teamTricode}
            </p>
            <p className="mt-0.5 hidden text-xs font-medium text-muted-foreground sm:block">
              {game.homeTeam.wins}-{game.homeTeam.losses}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MatchCardSkeleton() {
  return (
    <Card className="w-full shadow-sm">
      <CardContent className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 p-6">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-16 w-16 rounded-full opacity-50" />
          <Skeleton className="h-4 w-12 opacity-50" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-12 w-24 opacity-50" />
          <Skeleton className="h-5 w-16 opacity-50" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-16 w-16 rounded-full opacity-50" />
          <Skeleton className="h-4 w-12 opacity-50" />
        </div>
      </CardContent>
    </Card>
  )
}
