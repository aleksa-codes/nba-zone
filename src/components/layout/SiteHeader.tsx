"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { basketball } from "@lucide/lab"
import { Icon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_LINKS = [
  { href: "/", label: "Live" },
  { href: "/teams", label: "Teams" },
  { href: "/standings", label: "Standings" },
  { href: "/news", label: "News" },
  { href: "/chaz-nba", label: "Chaz NBA" },
]

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-8 hidden md:flex">
          <Link href="/" className="flex items-center space-x-2">
            <Icon iconNode={basketball} color="orange" className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">NBA Hub</span>
          </Link>
        </div>
        <nav className="no-scrollbar flex flex-1 items-center space-x-4 overflow-x-auto md:space-x-6">
          <Link
            href="/"
            className="mr-2 flex shrink-0 items-center space-x-2 md:hidden"
          >
            <Icon iconNode={basketball} color="orange" className="h-6 w-6" />
            <span className="font-bold text-primary">NBA Hub</span>
          </Link>
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "shrink-0 text-sm font-medium transition-colors hover:text-foreground/80",
                pathname === href ? "text-foreground" : "text-foreground/60"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
