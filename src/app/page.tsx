import { MatchBoard } from "@/components/matches/match-board"
import {
  getTodaysMatches,
  getYesterdaysMatches,
} from "@/lib/services/espnService"
import { Game } from "@/types"
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"

export default async function Home() {
  const queryClient = new QueryClient()

  // Fetch both sets of data on the server
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["todaysMatches"],
      queryFn: getTodaysMatches,
    }),
    queryClient.prefetchQuery({
      queryKey: ["yesterdaysMatches"],
      queryFn: getYesterdaysMatches,
    }),
  ])

  const todaysMatches =
    queryClient.getQueryData<Game[]>(["todaysMatches"]) || []
  const yesterdaysMatches =
    queryClient.getQueryData<Game[]>(["yesterdaysMatches"]) || []

  return (
    <main className="container py-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MatchBoard
          initialData={todaysMatches}
          initialYesterdayData={yesterdaysMatches}
        />
      </HydrationBoundary>
    </main>
  )
}
