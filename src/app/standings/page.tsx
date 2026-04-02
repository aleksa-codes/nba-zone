import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getStandings } from "@/lib/services/standingsService"
import { Trophy } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const metadata = {
  title: "NBA Standings",
  description: "Current NBA conference standings.",
}

export const revalidate = 3600

export default async function StandingsPage() {
  let standings = await getStandings()

  if (!standings || standings.length === 0) {
    return (
      <div className="container py-8 text-center text-muted-foreground">
        <h2>Unable to load standings. Please try again later.</h2>
      </div>
    )
  }

  // Ensure Western Conference is first, then Eastern Conference
  standings = standings.sort((a, b) => b.name.localeCompare(a.name))

  const defaultTab = standings[0]?.name || "Western Conference"

  return (
    <div className="container py-8">
      <div className="mb-10 max-w-2xl">
        <h1 className="flex items-center gap-3 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
          <span className="flex items-center justify-center rounded-xl bg-blue-500/10 p-3 shadow-inner">
            <Trophy className="h-8 w-8 text-blue-500" />
          </span>
          NBA Standings
        </h1>
        <p className="mt-4 text-lg font-medium text-muted-foreground">
          View the current regular season standings for the Eastern and Western
          conferences.
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-2 lg:w-[400px]">
          {standings.map((conf) => (
            <TabsTrigger key={conf.id} value={conf.name}>
              {conf.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {standings.map((conf) => (
          <TabsContent
            key={conf.id}
            value={conf.name}
            className="focus-visible:outline-none"
          >
            <div className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/50 whitespace-nowrap">
                    <TableRow>
                      <TableHead className="w-12 text-center font-bold">
                        #
                      </TableHead>
                      <TableHead className="font-bold">Team</TableHead>
                      <TableHead className="w-12 text-right font-bold">
                        W
                      </TableHead>
                      <TableHead className="w-12 text-right font-bold">
                        L
                      </TableHead>
                      <TableHead className="hidden text-right font-bold sm:table-cell">
                        PCT
                      </TableHead>
                      <TableHead className="hidden text-right font-bold sm:table-cell">
                        GB
                      </TableHead>
                      <TableHead className="hidden text-right font-bold md:table-cell">
                        Home
                      </TableHead>
                      <TableHead className="hidden text-right font-bold md:table-cell">
                        Away
                      </TableHead>
                      <TableHead className="hidden text-right font-bold lg:table-cell">
                        L10
                      </TableHead>
                      <TableHead className="hidden text-right font-bold lg:table-cell">
                        Strk
                      </TableHead>
                      <TableHead className="hidden text-right font-bold xl:table-cell">
                        PF
                      </TableHead>
                      <TableHead className="hidden text-right font-bold xl:table-cell">
                        PA
                      </TableHead>
                      <TableHead className="hidden text-right font-bold xl:table-cell">
                        DIFF
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conf.teams.map((team) => (
                      <TableRow
                        key={team.id}
                        className="whitespace-nowrap transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <TableCell className="text-center font-medium">
                          {team.seed}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/teams/${team.id}`}
                            className="group flex items-center gap-3"
                          >
                            <div className="relative h-8 w-8 shrink-0 transition-transform group-hover:scale-110">
                              {team.logo ? (
                                <Image
                                  src={team.logo}
                                  alt={team.displayName}
                                  fill
                                  sizes="32px"
                                  className="object-contain"
                                />
                              ) : (
                                <div className="h-full w-full rounded-full bg-muted" />
                              )}
                            </div>
                            <span className="font-semibold transition-colors group-hover:text-primary">
                              <span className="hidden sm:inline">
                                {team.displayName}
                              </span>
                              <span className="sm:hidden">
                                {team.abbreviation}
                              </span>
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {team.wins}
                        </TableCell>
                        <TableCell className="text-right">
                          {team.losses}
                        </TableCell>
                        <TableCell className="hidden text-right sm:table-cell">
                          {team.winPercent}
                        </TableCell>
                        <TableCell className="hidden text-right sm:table-cell">
                          {team.gamesBehind}
                        </TableCell>
                        <TableCell className="hidden text-right text-muted-foreground md:table-cell">
                          {team.homeRecord}
                        </TableCell>
                        <TableCell className="hidden text-right text-muted-foreground md:table-cell">
                          {team.awayRecord}
                        </TableCell>
                        <TableCell className="hidden text-right text-muted-foreground lg:table-cell">
                          {team.l10}
                        </TableCell>
                        <TableCell className="hidden text-right text-muted-foreground lg:table-cell">
                          {team.streak}
                        </TableCell>
                        <TableCell className="hidden text-right text-muted-foreground xl:table-cell">
                          {team.pointsFor}
                        </TableCell>
                        <TableCell className="hidden text-right text-muted-foreground xl:table-cell">
                          {team.pointsAgainst}
                        </TableCell>
                        <TableCell className="hidden text-right text-muted-foreground xl:table-cell">
                          {team.diff}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
