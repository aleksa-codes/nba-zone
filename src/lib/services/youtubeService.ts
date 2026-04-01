import Parser from "rss-parser"

const parser = new Parser({
  customFields: {
    item: [
      ["media:group", "mediaGroup"],
      ["yt:videoId", "videoId"],
    ],
  },
})

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
    const feed = await parser.parseURL(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHAZ_NBA_CHANNEL_ID}`
    )

    return feed.items.map((item) => {
      // Cast the item to correctly shape RSS attributes
      const customItem = item as unknown as Record<string, unknown>

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mediaGroup = customItem.mediaGroup as any
      const thumbnail = mediaGroup?.["media:thumbnail"]?.[0]?.$?.url || ""
      const rawViews =
        mediaGroup?.["media:community"]?.[0]?.["media:statistics"]?.[0]?.$
          ?.views || "0"

      const formattedViews = new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(Number(rawViews))

      return {
        id: (customItem.videoId as string) || "",
        title: item.title || "Untitled Video",
        link: item.link || "",
        pubDate: item.pubDate || new Date().toISOString(),
        thumbnail: thumbnail,
        views: formattedViews,
      }
    })
  } catch (error) {
    console.error("Failed to fetch Chaz NBA videos:", error)
    return []
  }
}
