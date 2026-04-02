import { Button } from "@/components/ui/button"
import { VideoModal } from "@/components/youtube/video-modal"
import { getFirstTakeVideos } from "@/lib/services/youtubeService"
import { Play } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "First Take",
  description: "Watch the latest First Take videos.",
}

export const revalidate = 3600 // 1 hour

export default async function FirstTakePage() {
  const allVideos = await getFirstTakeVideos()
  const videos = allVideos.slice(0, 12)

  return (
    <div className="container py-8">
      <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <h1 className="flex items-center gap-3 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            <span className="flex items-center justify-center rounded-xl bg-red-600/10 p-3 shadow-inner">
              <Play className="h-8 w-8 fill-current text-red-600" />
            </span>
            First Take
          </h1>
          <p className="mt-4 text-lg font-medium text-muted-foreground">
            Hot takes and debates. Showing the latest First Take segments from
            ESPN and NBA on ESPN.
          </p>
        </div>
        <div className="mt-2 flex shrink-0 gap-3 md:mt-0">
          <Link
            href="https://www.youtube.com/@ESPN"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="gap-2 rounded-xl bg-red-600 font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-red-700"
            >
              <Play className="h-5 w-5 fill-current" />
              Visit ESPN
            </Button>
          </Link>
          <Link
            href="https://www.youtube.com/@nbaonespn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="gap-2 rounded-xl bg-red-600 font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-red-700"
            >
              <Play className="h-5 w-5 fill-current" />
              Visit NBA on ESPN
            </Button>
          </Link>
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-muted/20 py-24 text-center">
          <p className="text-xl font-semibold text-muted-foreground">
            No First Take videos available at the moment. Please check back
            later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
          {videos.map((video) => (
            <VideoModal
              key={video.id}
              videoId={video.id}
              title={video.title}
              thumbnail={video.thumbnail}
              views={video.views}
              pubDate={video.pubDate}
              channelName={video.channelName}
            />
          ))}
        </div>
      )}
    </div>
  )
}
