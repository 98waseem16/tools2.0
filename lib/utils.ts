/**
 * Class name utility (shadcn-style).
 * Use for conditional and merged class names in components.
 */
export function cn(...inputs: (string | undefined | false | null)[]): string {
  return inputs.filter(Boolean).join(' ')
}

/**
 * Base URL for server-side fetches to our own API (e.g. on Vercel).
 * Prefers NEXT_PUBLIC_APP_URL, then VERCEL_URL, then localhost.
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}
