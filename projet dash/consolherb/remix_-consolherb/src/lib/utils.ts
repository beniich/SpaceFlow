/**
 * Utility: merge class names (simple version without clsx/tailwind-merge dep).
 * Filters out falsy values and joins with a space.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
