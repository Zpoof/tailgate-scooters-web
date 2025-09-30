import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency with proper decimal places
 * Fixes floating point precision issues
 */
export function formatCurrency(amount: number): string {
  return (Math.round(amount * 100) / 100).toFixed(2)
}

/**
 * Safely adds currency amounts with proper precision
 */
export function addCurrency(...amounts: number[]): number {
  const total = amounts.reduce((sum, amount) => sum + amount, 0)
  return Math.round(total * 100) / 100
}
