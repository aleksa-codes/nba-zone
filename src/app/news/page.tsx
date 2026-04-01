import { getNBANews } from "@/lib/services/newsService"
import { ArrowRight, Clock, Newspaper } from "lucide-react"

export const revalidate = 3600

export default async function NewsPage() {
  const articles = await getNBANews()

  return (
    <div className="container py-8">
      <div className="mb-10 max-w-2xl">
        <h1 className="flex items-center gap-3 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
          <span className="flex items-center justify-center rounded-xl bg-primary/10 p-3 shadow-inner">
            <Newspaper className="h-8 w-8 text-primary" />
          </span>
          NBA News
        </h1>
        <p className="mt-4 text-lg font-medium text-muted-foreground">
          Stay up to date with the latest NBA headlines, trades, and updates
          from ESPN.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, i) => (
          <a
            key={i}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col focus-visible:outline-none"
          >
            <div className="flex h-full flex-col rounded-xl border bg-card p-6 text-card-foreground shadow transition-colors hover:border-primary">
              <div className="mb-4 flex items-center justify-end">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {new Date(article.pubDate).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <h3 className="mb-4 text-xl leading-tight font-medium transition-colors group-hover:text-primary">
                {article.title}
              </h3>

              <div className="mt-auto">
                {article.description && (
                  <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                    {article.description}
                  </p>
                )}
                <div className="flex items-center text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary">
                  Read full story
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </a>
        ))}
        {articles.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No news articles found at the moment. Please try again later.
          </div>
        )}
      </div>
    </div>
  )
}
