import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

export const formatScore = (score: number | undefined | null) => {
  if (score === null || score === undefined) return 'N/A'
  return Number(score).toFixed(1)
}

export const getScoreColor = (score: number) => {
  if (score >= 8) return 'text-green-600'
  if (score >= 7) return 'text-blue-600'
  if (score >= 6) return 'text-yellow-600'
  if (score >= 5) return 'text-orange-600'
  return 'text-red-600'
}