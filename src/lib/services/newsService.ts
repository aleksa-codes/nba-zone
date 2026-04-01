import { parseStringPromise } from "xml2js"

export interface NewsArticle {
  title: string
  link: string
  pubDate: string
  source: string
  description?: string
}

export const getNBANews = async (): Promise<NewsArticle[]> => {
  try {
    const res = await fetch("https://www.espn.com/espn/rss/nba/news", {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch rss feed: ${res.statusText}`)
    }

    const text = await res.text()
    const parsed = await parseStringPromise(text, { explicitArray: false })

    if (!parsed?.rss?.channel?.item) {
      return []
    }

    const items = Array.isArray(parsed.rss.channel.item)
      ? parsed.rss.channel.item
      : [parsed.rss.channel.item]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return items.map((item: any) => ({
      title: item.title || "No title",
      link: item.link || "",
      pubDate: item.pubDate || new Date().toISOString(),
      source: item["dc:creator"] || "ESPN",
      description: item.description || "",
    }))
  } catch (error) {
    console.error("Failed to fetch NBA News:", error)
    return []
  }
}
