import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30 py-8 pb-12 md:bg-muted/20 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose font-medium text-muted-foreground md:text-left md:leading-normal">
          Built by{" "}
          <Link
            href="https://github.com/aleksa-codes"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline decoration-primary/50 underline-offset-4 transition-colors hover:text-primary"
          >
            aleksa.codes
          </Link>
          .
          <br className="hidden md:block" />
          Scores and News via ESPN. Videos fetched from YouTube. Not associated
          with the NBA or ESPN.
        </p>
      </div>
    </footer>
  )
}
