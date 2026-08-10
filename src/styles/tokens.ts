// src/styles/tokens.ts
// Centralized design tokens for AlluraCare

// ============================================
// COLORS
// ============================================

export const colors = {
  // Brand Primary
  brand: {
    primary: '#874A58',
    secondary: '#C9CAE1',
    accent: '#B8A2B7',
    background: '#FAFAF8',
    lightBg: '#EDEDFA',
    hover: '#C397A0',
    softRose: '#D7B8BF',
    paleRose: '#EFDFE2',
    cream: '#F5F0EB',
    ivory: '#FDFBF9',
    gold: '#D4A574',
    mint: '#C1EODF',
    sage: '#D3E3E3',
  },

  // Text
  text: {
    primary: '#2D2D2D',
    secondary: '#8A8A8A',
    white: '#FFFFFF',
  },

  // Semantic (new colors I'm adding)
  semantic: {
    success: '#4CAF7A',
    successLight: '#E8F5ED',
    error: '#D45769',
    errorLight: '#FDE8EB',
    warning: '#E8A84C',
    warningLight: '#FDF4E5',
    info: '#6B8FA8',
    infoLight: '#E8EFF5',
  },

  // Scale for UI
  ui: {
    background: '#FAFAF8',
    surface: '#FFFFFF',
    border: '#D7B8BF',
    borderLight: '#EFDFE2',
    shadow: 'rgba(135, 74, 88, 0.08)',
    shadowDark: 'rgba(135, 74, 88, 0.16)',
  },
} as const;

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  // Font families
  fontFamily: {
    sans: 'var(--font-inter), system-ui, -apple-system, sans-serif',
    serif: 'var(--font-playfair), Georgia, "Times New Roman", serif',
    persian: '"Shabnam", "Vazir", "Vazir-FD", system-ui, sans-serif',
  },

  // Heading sizes
  heading: {
    display: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: 700,
      lineHeight: 1.05,
      letterSpacing: '-0.03em',
    },
    h1: {
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontSize: 'clamp(1.5rem, 2.5vw, 1.75rem)',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
  },

  // Body text
  body: {
    large: {
      fontSize: '1.125rem',
      lineHeight: 1.7,
    },
    base: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    small: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    },
  },
} as const;

// ============================================
// SPACING
// ============================================

export const spacing = {
  // Base spacing scale (in rem)
  // 1rem = 16px
  0: '0',
  0.25: '0.25rem', // 4px
  0.5: '0.5rem', // 8px
  0.75: '0.75rem', // 12px
  1: '1rem', // 16px
  1.25: '1.25rem', // 20px
  1.5: '1.5rem', // 24px
  2: '2rem', // 32px
  2.5: '2.5rem', // 40px
  3: '3rem', // 48px
  4: '4rem', // 64px
  5: '5rem', // 80px
  6: '6rem', // 96px
  8: '8rem', // 128px
  10: '10rem', // 160px
  12: '12rem', // 192px
  16: '16rem', // 256px
  20: '20rem', // 320px
  24: '24rem', // 384px
  32: '32rem', // 512px
  40: '40rem', // 640px
  48: '48rem', // 768px
  56: '56rem', // 896px
  64: '64rem', // 1024px
} as const;

// Container widths
export const containers = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1200px', // Your custom container
  '2xl': '1400px',
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const radius = {
  none: '0',
  sm: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

// ============================================
// SHADOWS
// ============================================

export const shadows = {
  card: '0 2px 12px rgba(135, 74, 88, 0.04)',
  soft: '0 4px 20px rgba(135, 74, 88, 0.06)',
  medium: '0 8px 40px rgba(135, 74, 88, 0.08)',
  hover: '0 16px 60px rgba(135, 74, 88, 0.10)',
  glow: '0 0 80px rgba(135, 74, 88, 0.04)',
  dropdown: '0 12px 48px rgba(0, 0, 0, 0.08)',
  modal: '0 24px 80px rgba(0, 0, 0, 0.12)',
} as const;

// ============================================
// ANIMATIONS
// ============================================

export const animations = {
  duration: {
    fastest: '150ms',
    fast: '250ms',
    normal: '400ms',
    slow: '600ms',
    slower: '800ms',
    slowest: '1200ms',
  },
  easing: {
    ease: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
} as const;

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================
// EXPORT ALL TOKENS
// ============================================

export const tokens = {
  colors,
  typography,
  spacing,
  containers,
  radius,
  shadows,
  animations,
  breakpoints,
} as const;

export type Tokens = typeof tokens;
export type ColorTokens = typeof colors;
export type TypographyTokens = typeof typography;
export type SpacingTokens = typeof spacing;
export type RadiusTokens = typeof radius;
export type ShadowTokens = typeof shadows;
export type AnimationTokens = typeof animations;
export type BreakpointTokens = typeof breakpoints;

export default tokens;