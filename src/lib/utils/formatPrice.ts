// src/lib/utils/formatPrice.ts

interface FormatPriceOptions {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

// Real exchange rate: 1 USD = 185,000 Toman
const EXCHANGE_RATE = 185000;

export const formatPrice = (
  price: number,
  options: FormatPriceOptions = {}
): string => {
  const {
    locale = 'en-US',
    currency = 'USD',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options;

  // For Persian locale, convert USD to Toman
  if (locale === 'fa-IR') {
    const tomanPrice = price * EXCHANGE_RATE;
    
    const formattedNumber = new Intl.NumberFormat('fa-IR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(tomanPrice);
    
    return `${formattedNumber} تومان`;
  }

  // Default: USD formatting
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(price);
};

// Helper to convert USD to Toman
export const usdToToman = (usdPrice: number): number => {
  return usdPrice * EXCHANGE_RATE;
};

// Helper to format Toman
export const formatToman = (price: number): string => {
  return new Intl.NumberFormat('fa-IR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' تومان';
};

// Helper to convert Toman to USD (for reference)
export const tomanToUsd = (tomanPrice: number): number => {
  return tomanPrice / EXCHANGE_RATE;
};