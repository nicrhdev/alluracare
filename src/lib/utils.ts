// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { tokens } from "@/styles/tokens"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Design system helpers
export const getColor = (colorPath: string) => {
  const parts = colorPath.split('.')
  let current: any = tokens.colors
  for (const part of parts) {
    if (current[part] === undefined) return undefined
    current = current[part]
  }
  return current
}

export const getSpacing = (size: keyof typeof tokens.spacing) => {
  return tokens.spacing[size]
}

export const getRadius = (size: keyof typeof tokens.radius) => {
  return tokens.radius[size]
}

export const getShadow = (name: keyof typeof tokens.shadows) => {
  return tokens.shadows[name]
}

// Price formatting
export const formatPrice = (price: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Slug generation
export const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Truncate text
export const truncateText = (text: string, length: number = 100) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// Delay utility for animations
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))