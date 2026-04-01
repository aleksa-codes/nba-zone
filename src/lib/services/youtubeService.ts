import { parseStringPromise } from "xml2js"

export interface YouTubeVideo {
  id: string
  title: string
  link: string
  pubDate: string
  thumbnail: string
  views: string
}

export const getChazNBAVideos = async (): Promise<YouTubeVideo[]> => {
  try {
    const CHAZ_NBA_CHANNEL_ID = "UChgDp_uE5PVqnpdV05xKOOA"
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHAZ_NBA_CHANNEL_ID}`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch youtube feed: ${res.statusText}`)
    }

    const text = await res.text()
    const parsed = await parseStringPromise(text, { explicitArray: false })

    if (!parsed?.feed?.entry) {
      return []
    }

    const entries = Array.isArray(parsed.feed.entry)
      ? parsed.feed.entry
      : [parsed.feed.entry]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return entries.map((item: any) => {
      const mediaGroup = item["media:group"]
      const thumbnail = mediaGroup?.["media:thumbnail"]?.$?.url || ""
      const rawViews =
        mediaGroup?.["media:community"]?.["media:statistics"]?.$?.views || "0"

      const formattedViews = new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(Number(rawViews))

      return {
        id: item["yt:videoId"] || "",
        title: item.title || "Untitled Video",
        link: item.link?.$?.href || "",
        pubDate: item.published || new Date().toISOString(),
        thumbnail: thumbnail,
        views: formattedViews,
      }
    })
  } catch (error) {
    console.error("Failed to fetch Chaz NBA videos:", error)
    return []
  }
}
