/**
 * Utility functions
 * Common helper functions used across the app
 */

/**
 * Format date to Indonesian locale
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  });
}

/**
 * Format number to Indonesian currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Delay execution (for loading states, etc.)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

/**
 * Generate class names conditionally
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
