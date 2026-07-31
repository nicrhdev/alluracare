// src/lib/utils/formatPrice.ts

interface FormatPriceOptions {
  locale: string;
  currency?: 'USD' | 'IRR';
  price: number;
}

export function formatPrice({ locale, currency = 'USD', price }: FormatPriceOptions): string {
  // If locale is Persian (fa), use IRR/Toman
  if (locale === 'fa') {
    // Convert USD to IRR (using a fixed rate for demo)
    // You can change this rate as needed
    const exchangeRate = 58000; // 1 USD = 58,000 IRR
    const rialPrice = price * exchangeRate;
    const tomanPrice = rialPrice / 10; // 1 Toman = 10 Rials
    
    return new Intl.NumberFormat('fa-IR', {
      style: 'currency',
      currency: 'IRR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(tomanPrice * 10).replace('IRR', 'تومان');
  }

  // For English locale, use USD
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price);
}

// Helper function for USD to Toman conversion
export function convertToToman(usdPrice: number): number {
  const exchangeRate = 58000;
  const rialPrice = usdPrice * exchangeRate;
  return rialPrice / 10; // Toman
}

// Helper function to format Toman
export function formatToman(price: number, locale: string = 'fa'): string {
  return new Intl.NumberFormat('fa-IR', {
    style: 'currency',
    currency: 'IRR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price * 10).replace('IRR', 'تومان');
}