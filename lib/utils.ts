/**
 * Class name utility (shadcn-style).
 * Use for conditional and merged class names in components.
 */
export function cn(...inputs: (string | undefined | false | null)[]): string {
  return inputs.filter(Boolean).join(' ')
}
