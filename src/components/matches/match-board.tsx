"use client"

import { getTodaysMatches } from "@/lib/services/espnService"
import { Game } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { CalendarDays, RefreshCw } from "lucide-react"
import { useEffect } from "react"
import { Button } from "../ui/button"
import { MatchCard, MatchCardSkeleton } from "./match-card"

export function MatchBoard({ initialData }: { initialData: Game[] }) {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["todaysMatches"],
    queryFn: () => getTodaysMatches(),
    initialData: initialData,
    refetchInterval: (query) => {
      const hasLiveGames = query.state.data?.some((g) => g.gameStatus === 2)
      return hasLiveGames ? 30000 : false
    },
    refetchOnWindowFocus: true,
  })

  // Prevent hydration mismatch for date formatting without causing setState in effect warnings
  useEffect(() => {
    // Empty effect just to hydrate properly
  }, [])

  const games = data || []

  // Format current date visually
  const todayTitle = format(new Date(), "EEEE, MMMM do")

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            <span suppressHydrationWarning>{todayTitle}</span>
          </h2>
          <p className="mt-1.5 flex items-center gap-2 font-medium text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            Live scores and upcoming games
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2 self-start whitespace-nowrap shadow-sm sm:self-auto"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin text-primary" : ""}`}
          />
          Refresh Matches
        </Button>
      </div>

      {isLoading && !games.length ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MatchCardSkeleton />
          <MatchCardSkeleton />
          <MatchCardSkeleton />
          <MatchCardSkeleton />
        </div>
      ) : games.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/20 py-24 text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No games scheduled for today.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {games.map((game) => (
            <MatchCard key={game.gameId} game={game} />
          ))}
        </div>
      )}
    </div>
  )
}
