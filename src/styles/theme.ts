/* ─── SPY Design System ─── */

export const colors = {
  /* Core SPY palette */
  spyBlack: '#1a1a1a',
  spyDark: '#0d0d0d',
  spyGold: '#c9a227',
  spyGoldLight: '#d4b652',
  spyGoldDark: '#a68820',
  spyWhite: '#ffffff',
  spyGray: '#888888',
  spyGrayLight: '#cccccc',
  spyGrayDark: '#333333',

  /* Surfaces */
  bg: '#0d0d0d',
  bgContent: '#1a1a1a',
  bgCard: '#222222',
  bgCardHover: '#2a2a2a',
  bgElevated: '#2d2d2d',
  bgInput: '#1a1a1a',
  bgSubtle: '#1f1f1f',

  /* Header & Sidebar */
  headerBg: '#0d0d0d',
  sidebarBg: '#0d0d0d',
  sidebarHover: '#1a1a1a',
  sidebarActive: '#1a1a1a',

  /* Text */
  textPrimary: '#ffffff',
  textSecondary: '#cccccc',
  textMuted: '#888888',
  textDimmed: '#666666',

  /* Primary (gold) */
  primary: '#c9a227',
  primaryHover: '#d4b652',
  primaryDark: '#a68820',
  primarySubtle: 'rgba(201, 162, 39, 0.1)',
  primaryBorder: 'rgba(201, 162, 39, 0.3)',

  /* Borders */
  border: '#333333',
  borderLight: '#2a2a2a',
  borderHover: '#c9a227',

  /* Semantic */
  success: '#27ae60',
  successBg: 'rgba(39, 174, 96, 0.12)',
  warning: '#e67e22',
  warningBg: 'rgba(230, 126, 34, 0.12)',
  danger: '#e74c3c',
  dangerBg: 'rgba(231, 76, 60, 0.12)',
  info: '#3498db',
  infoBg: 'rgba(52, 152, 219, 0.12)',

  /* Feature-specific (dedication page) */
  stockBlue: '#3498db',
  stockBg: 'rgba(52, 152, 219, 0.15)',
  prePurple: '#9b59b6',
  preBg: 'rgba(155, 89, 182, 0.15)',
} as const

export const fonts = {
  heading: "'Cormorant', 'Cormorant Garamond', Georgia, serif",
  body: "'Raleway', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
} as const

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
} as const

export const radii = {
  sm: '6px',
  md: '10px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
} as const

export const shadows = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.3)',
  md: '0 4px 12px rgba(0, 0, 0, 0.4)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
  xl: '0 20px 60px rgba(0, 0, 0, 0.6)',
  glow: '0 0 20px rgba(201, 162, 39, 0.15)',
  cardHover: '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(201, 162, 39, 0.3)',
} as const

export const transitions = {
  fast: '0.15s ease',
  normal: '0.2s ease',
  slow: '0.3s ease',
} as const

export const theme = {
  colors,
  fonts,
  spacing,
  radii,
  shadows,
  transitions,
} as const

export default theme
