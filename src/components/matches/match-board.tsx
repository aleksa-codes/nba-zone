"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getTodaysMatches,
  getYesterdaysMatches,
} from "@/lib/services/espnService"
import { getNBADate } from "@/lib/utils"
import { Game } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { CalendarDays, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import { MatchCard, MatchCardSkeleton } from "./match-card"

export function MatchBoard({
  initialData,
  initialYesterdayData,
}: {
  initialData: Game[]
  initialYesterdayData: Game[]
}) {
  const [activeTab, setActiveTab] = useState("today")

  const {
    data: todaysData,
    isLoading: isLoadingToday,
    isFetching: isFetchingToday,
    refetch: refetchToday,
  } = useQuery({
    queryKey: ["todaysMatches"],
    queryFn: () => getTodaysMatches(),
    initialData: initialData,
    refetchInterval: (query) => {
      const hasLiveGames = query.state.data?.some((g) => g.gameStatus === 2)
      return hasLiveGames ? 30000 : false
    },
    refetchOnWindowFocus: true,
  })

  // Yesterdays data doesn't securely need polling since games are finished,
  // but standard staleTime is nice to have
  const {
    data: yesterdaysData,
    isLoading: isLoadingYesterday,
    isFetching: isFetchingYesterday,
    refetch: refetchYesterday,
  } = useQuery({
    queryKey: ["yesterdaysMatches"],
    queryFn: () => getYesterdaysMatches(),
    initialData: initialYesterdayData,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours since it's the past
    refetchOnWindowFocus: false,
  })

  // Prevent hydration mismatch for date formatting
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  const isToday = activeTab === "today"
  const games = isToday ? todaysData || [] : yesterdaysData || []
  const isLoading = isToday ? isLoadingToday : isLoadingYesterday
  const isFetching = isToday ? isFetchingToday : isFetchingYesterday

  const handleRefetch = () => {
    if (isToday) refetchToday()
    else refetchYesterday()
  }

  // Format dates visually safely
  const titleDate = isToday ? getNBADate(0) : getNBADate(-1)
  const displayTitle = mounted ? format(titleDate, "EEEE, MMMM do") : ""

  // Extra specific descriptors
  const subtitle = isToday
    ? "Live scores and upcoming games"
    : "Final scores and past results"

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="min-h-[40px] text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            {mounted ? displayTitle : ""}
          </h2>
          <p className="mt-1.5 flex items-center gap-2 font-medium text-muted-foreground transition-all duration-200">
            <CalendarDays className="h-4 w-4" />
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row sm:items-center">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="max-w-fit">
              <TabsTrigger
                value="yesterday"
                className="px-5 text-sm font-medium"
              >
                {mounted ? format(getNBADate(-1), "MMM d") : "Yday"}
              </TabsTrigger>
              <TabsTrigger value="today" className="px-5 text-sm font-medium">
                {mounted ? format(getNBADate(0), "MMM d") : "Today"}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            onClick={handleRefetch}
            disabled={isFetching}
            className="gap-2 self-start px-4 whitespace-nowrap shadow-sm sm:self-auto"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin text-primary" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      <div className="min-h-[400px]">
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
              {isToday
                ? "No games scheduled for today."
                : "No games were played yesterday."}
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
    </div>
  )
}
