import { MatchBoard } from "@/components/matches/MatchBoard"
import { getTodaysMatches } from "@/lib/services/espnService"
import { Game } from "@/types"
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"

export default async function Home() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["todaysMatches"],
    queryFn: getTodaysMatches,
  })

  const matches = queryClient.getQueryData<Game[]>(["todaysMatches"]) || []

  return (
    <main className="container py-8">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MatchBoard initialData={matches} />
      </HydrationBoundary>
    </main>
  )
}
