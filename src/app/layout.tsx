import "@/app/globals.css"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import Providers from "@/components/providers"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

const fontSans = Geist({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "NBA Hub",
  description: "A minimal mobile-first NBA Hub built with Next.js 16.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, fontSans.variable)}
    >
      <body suppressHydrationWarning>
        <ThemeProvider>
          <Providers>
            <div className="relative flex min-h-screen flex-col bg-background">
              <SiteHeader />
              <main className="flex flex-1 flex-col">{children}</main>
              <SiteFooter />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
