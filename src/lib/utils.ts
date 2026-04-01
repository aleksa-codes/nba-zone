import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns a Date object initialized to the current NBA calendar day (New York time).
 * This ensures that when passed midnight in other parts of the world,
 * the matches displayed still align with the US dates.
 * It also shifts back 4 hours so games playing locally late at night
 * (e.g. 1AM-3AM EST) still register as the "previous day's" schedule.
 */
export function getNBADate(offsetDays: number = 0): Date {
  const now = new Date()
  const nyTimeString = now.toLocaleString("en-US", {
    timeZone: "America/New_York",
  })
  const nyDate = new Date(nyTimeString)

  // Shift back by 4 hours to account for late games bridging across midnight EST
  nyDate.setHours(nyDate.getHours() - 4)
  nyDate.setDate(nyDate.getDate() + offsetDays)

  return nyDate
}
