
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines Tailwind classes and merges conflicting ones using tailwind-merge.
 * Part of the "Padrão Ouro" architecture.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
