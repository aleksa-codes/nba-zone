import { parseStringPromise } from "xml2js"

export interface YouTubeVideo {
  id: string
  title: string
  link: string
  pubDate: string
  thumbnail: string
  views: string
  channelName?: string
}

const fetchAndParseChannelFeed = async (
  channelId: string
): Promise<YouTubeVideo[]> => {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) {
      throw new Error(
        `Failed to fetch youtube feed for ${channelId}: ${res.statusText}`
      )
    }

    const text = await res.text()
    const parsed = await parseStringPromise(text, { explicitArray: false })

    if (!parsed?.feed?.entry) {
      return []
    }

    const channelName =
      parsed.feed.author?.name || parsed.feed.title || "YouTube Channel"

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
        channelName,
      }
    })
  } catch (error) {
    console.error(`Failed to fetch videos for channel ${channelId}:`, error)
    return []
  }
}

export const getChazNBAVideos = async (): Promise<YouTubeVideo[]> => {
  return await fetchAndParseChannelFeed("UChgDp_uE5PVqnpdV05xKOOA")
}

const fetchAndParsePlaylistFeed = async (
  playlistId: string,
  channelNameOverride?: string
): Promise<YouTubeVideo[]> => {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) {
      throw new Error(
        `Failed to fetch youtube feed for playlist ${playlistId}: ${res.statusText}`
      )
    }

    const text = await res.text()
    const parsed = await parseStringPromise(text, { explicitArray: false })

    if (!parsed?.feed?.entry) {
      return []
    }

    const channelName =
      channelNameOverride ||
      parsed.feed.author?.name ||
      parsed.feed.title ||
      "YouTube Channel"

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
        channelName,
      }
    })
  } catch (error) {
    console.error(`Failed to fetch videos for playlist ${playlistId}:`, error)
    return []
  }
}

const fetchLatestVideosWithoutShorts = async (
  channelHandle: string,
  channelNameOverride: string
): Promise<YouTubeVideo[]> => {
  try {
    // Add ?hl=en to enforce English relative timestamps on restricted environments like Vercel
    const res = await fetch(
      `https://www.youtube.com/${channelHandle}/videos?hl=en`,
      {
        headers: { "Accept-Language": "en-US,en;q=0.9" },
        next: { revalidate: 3600 },
      }
    )

    if (!res.ok) return []

    const html = await res.text()
    const match = html.match(/var ytInitialData = (.*?);<\/script>/)
    if (!match) return []

    const data = JSON.parse(match[1])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const videos: any[] = []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const traverse = (obj: any) => {
      if (obj && typeof obj === "object") {
        if (obj.videoRenderer) {
          videos.push(obj.videoRenderer)
        } else {
          Object.values(obj).forEach(traverse)
        }
      }
    }
    traverse(data)

    return videos.map((v, i) => {
      const videoId = v.videoId || ""
      const publishedText = v.publishedTimeText?.simpleText || ""

      const realDate = new Date()
      // Translate dynamic timestamps ("6 hours ago", "2 days ago") into exact ISO dates so parsing doesn't artificially elevate videos from other channels based on overall upload frequency indexes.
      const match = publishedText.match(
        /(\d+)\s+(minute|hour|day|week|month|year)s?\s+ago/i
      )
      if (match) {
        const amount = parseInt(match[1], 10)
        const unit = match[2].toLowerCase()
        if (unit === "minute")
          realDate.setMinutes(realDate.getMinutes() - amount)
        else if (unit === "hour")
          realDate.setHours(realDate.getHours() - amount)
        else if (unit === "day") realDate.setDate(realDate.getDate() - amount)
        else if (unit === "week")
          realDate.setDate(realDate.getDate() - amount * 7)
        else if (unit === "month")
          realDate.setMonth(realDate.getMonth() - amount)
        else if (unit === "year")
          realDate.setFullYear(realDate.getFullYear() - amount)
      } else {
        // Safe fallback in case regex somehow doesn't match
        realDate.setHours(realDate.getHours() - i)
      }

      return {
        id: videoId,
        title: v.title?.runs?.[0]?.text || "Untitled Video",
        link: `https://www.youtube.com/watch?v=${videoId}`,
        pubDate: realDate.toISOString(),
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        views: v.viewCountText?.simpleText?.replace(/[^0-9KMBkm]/g, "") || "0",
        channelName: channelNameOverride,
      }
    })
  } catch (error) {
    console.error(`Failed to scrape latest videos for ${channelHandle}:`, error)
    return []
  }
}

export const getFirstTakeVideos = async (): Promise<YouTubeVideo[]> => {
  // Fetch from official First Take playlists (for historical/reliable segments)
  // and from the channel videos page directly (which bypasses RSS feed limits and excludes Shorts)
  const playlists = [
    { id: "PLn3nHXu50t5wkud7Iv0LFazfV8dja6dc3", name: "ESPN" },
    { id: "PLu1neCd4swubRD25kK8pFWQmPSh_4C59F", name: "NBA on ESPN" },
  ]
  const channelsToScrape = [
    { handle: "@ESPN", name: "ESPN" },
    { handle: "@nbaonespn", name: "NBA on ESPN" },
  ]

  const [playlistResponses, scrapedResponses] = await Promise.all([
    Promise.all(playlists.map((p) => fetchAndParsePlaylistFeed(p.id, p.name))),
    Promise.all(
      channelsToScrape.map((c) =>
        fetchLatestVideosWithoutShorts(c.handle, c.name)
      )
    ),
  ])

  const playlistVideos = playlistResponses.flat()
  const latestScrapedVideos = scrapedResponses
    .flat()
    .filter((video) => video.title.toLowerCase().includes("first take"))

  // Combine all and remove duplicates by video id
  const allVideosMap = new Map<string, YouTubeVideo>()

  for (const video of [...latestScrapedVideos, ...playlistVideos]) {
    if (!allVideosMap.has(video.id)) {
      allVideosMap.set(video.id, video)
    }
  }

  const firstTakeVideos = Array.from(allVideosMap.values())

  // Sort by pubDate descending
  return firstTakeVideos.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  )
}
