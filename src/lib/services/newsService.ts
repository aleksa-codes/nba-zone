export interface NewsArticle {
  title: string
  link: string
  pubDate: string
  source: string
  description?: string
  image?: string
}

interface EspnArticle {
  type: string
  headline?: string
  description?: string
  published?: string
  images?: { url: string }[]
  links?: {
    web?: { href?: string }
    mobile?: { href?: string }
  }
}

export const getNBANews = async (): Promise<NewsArticle[]> => {
  try {
    const res = await fetch(
      "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news?limit=50",
      {
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch JSON news: ${res.statusText}`)
    }

    const data = await res.json()

    if (!data?.articles || !Array.isArray(data.articles)) {
      return []
    }

    return data.articles
      .filter((item: EspnArticle) => item.type !== "Media")
      .sort(
        (a: EspnArticle, b: EspnArticle) =>
          new Date(b.published || 0).getTime() -
          new Date(a.published || 0).getTime()
      )
      .slice(0, 12)
      .map((item: EspnArticle) => ({
        title: item.headline || "No title",
        link: item.links?.web?.href || item.links?.mobile?.href || "",
        pubDate: item.published || new Date().toISOString(),
        source: "ESPN",
        description: item.description || "",
        image: item.images?.[0]?.url || "",
      }))
  } catch (error) {
    console.error("Failed to fetch NBA News:", error)
    return []
  }
}
