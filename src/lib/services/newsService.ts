import Parser from "rss-parser"

const parser = new Parser()

export interface NewsArticle {
  title: string
  link: string
  pubDate: string
  source: string
  description?: string
}

export const getNBANews = async (): Promise<NewsArticle[]> => {
  try {
    const feed = await parser.parseURL("https://www.espn.com/espn/rss/nba/news")
    return feed.items.map((item) => ({
      title: item.title || "No title",
      link: item.link || "",
      pubDate: item.pubDate || new Date().toISOString(),
      source: item.creator || "ESPN",
      description: item.contentSnippet || item.content || "",
    }))
  } catch (error) {
    console.error("Failed to fetch NBA News:", error)
    return []
  }
}
