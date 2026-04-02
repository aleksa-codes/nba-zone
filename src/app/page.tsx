import { MatchBoard } from "@/components/matches/match-board"
import {
  getTodaysMatches,
  getYesterdaysMatches,
} from "@/lib/services/espnService"
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"

export const revalidate = 3600 // Revalidate every hour on the server

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

  return (
    <main className="container py-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MatchBoard />
      </HydrationBoundary>
    </main>
  )
}
