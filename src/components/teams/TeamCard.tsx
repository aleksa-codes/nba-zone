import { Card, CardContent } from "@/components/ui/card"
import { NbaTeam } from "@/types"
import Image from "next/image"
import Link from "next/link"

export function TeamCard({ team }: { team: NbaTeam }) {
  const logo = team.logos?.[0]?.href

  return (
    <Link
      href={`/teams/${team.id}`}
      className="group block h-full focus-visible:outline-none"
    >
      <Card
        className="relative h-full cursor-pointer overflow-hidden border border-border shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg sm:p-2"
        style={{
          background: `linear-gradient(180deg, #${team.color}15 0%, transparent 80%)`,
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-1 opacity-80"
          style={{
            background: `linear-gradient(to right, #${team.color}, #${team.alternateColor || team.color})`,
          }}
        />
        <CardContent className="relative flex h-full flex-col items-center justify-center gap-5 p-6 text-center">
          <div
            className="absolute inset-0 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-40"
            style={{ backgroundColor: `#${team.color}` }}
          />

          {logo ? (
            <div className="relative z-10 h-24 w-24 drop-shadow-md transition-transform duration-300 group-hover:scale-110">
              <Image
                src={logo}
                alt={team.displayName}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
              />
            </div>
          ) : (
            <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <span className="text-2xl font-extrabold text-muted-foreground">
                {team.abbreviation}
              </span>
            </div>
          )}
          <div className="z-10 mt-auto">
            <h3 className="text-lg font-extrabold tracking-tight">
              {team.name}
            </h3>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {team.location}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
