"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Play } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface VideoModalProps {
  videoId: string
  title: string
  thumbnail: string
  views: string
  pubDate: string
}

export function VideoModal({
  videoId,
  title,
  thumbnail,
  views,
  pubDate,
}: VideoModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-colors hover:border-primary focus-visible:outline-none">
          <div className="relative aspect-video w-full shrink-0 bg-muted">
            <Image
              src={thumbnail}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex items-center justify-center rounded-full bg-red-600/90 p-4 text-white backdrop-blur-sm">
                <Play className="h-8 w-8 translate-x-0.5 fill-current" />
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-between border-t border-border p-5">
            <h3 className="mb-3 text-base leading-tight font-bold transition-colors group-hover:text-primary">
              {title}
            </h3>
            <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {views}
              </span>
              <span>
                {new Date(pubDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="h-[clamp(300px,60vh,600px)] overflow-hidden border-none bg-black p-0 sm:max-w-4xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {open && (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="border-0 bg-black"
          ></iframe>
        )}
      </DialogContent>
    </Dialog>
  )
}
