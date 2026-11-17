/**
 * NORDIC_MINIMAL preset, with the painted-wall palette from the design brief
 * overriding the base colour roles. The `name` field stays exactly as in the
 * preset file — the style layer (SOFT_UI) is a separate field.
 */
export const theme = {
  name: 'nordic-minimal',
  style: 'SOFT_UI',

  colors: {
    // Brief palette
    bg: '#F6EDF4', // painted-wall pink
    primary: '#AB2A86', // plum
    accent: '#28E0B4', // mint
    accentLight: '#7FE8C5', // mint gradient endpoint (inherited)
    ink: '#241821', // dark ink
    secondary: '#DDB0BB', // dusty rose
    surface: '#FAFAFA', // raised cards / reverse text (inherited)

    text: {
      primary: '#241821',
      secondary: 'rgba(36, 24, 33, 0.82)',
      tertiary: 'rgba(36, 24, 33, 0.68)',
      inverse: '#FAFAFA',
      inverseSoft: 'rgba(250, 250, 250, 0.85)',
    },

    ui: {
      border: 'rgba(221, 176, 187, 0.45)',
      borderStrong: 'rgba(171, 42, 134, 0.40)',
      divider: 'rgba(221, 176, 187, 0.55)',
      inset: 'rgba(171, 42, 134, 0.06)',
      scrim: 'rgba(0, 0, 0, 0.30)',
      overlay: 'rgba(36, 24, 33, 0.55)',
      mintTint: 'rgba(40, 224, 180, 0.16)',
      plumTint: 'rgba(171, 42, 134, 0.08)',
    },
  },

  gradients: {
    loader: ['#241821', '#58203F', '#AB2A86'] as string[],
    rooms: ['rgba(246,237,244,0.96)', 'rgba(250,250,250,0.96)'] as string[],
    walls: ['rgba(250,250,250,0.97)', 'rgba(246,237,244,0.97)'] as string[],
    openings: ['rgba(246,237,244,0.97)', 'rgba(250,250,250,0.97)'] as string[],
    coats: ['rgba(250,250,250,0.97)', 'rgba(246,237,244,0.97)'] as string[],
    result: ['rgba(246,237,244,0.94)', 'rgba(221,176,187,0.94)'] as string[],
    notes: ['rgba(250,250,250,0.97)', 'rgba(246,237,244,0.97)'] as string[],
    settings: ['rgba(246,237,244,0.97)', 'rgba(250,250,250,0.97)'] as string[],
    primaryButton: ['#28E0B4', '#7FE8C5'] as string[],
    hero: ['#AB2A86', '#241821'] as string[],
    header: ['#AB2A86', '#8E216F'] as string[],
    hubTile: ['#AB2A86', '#6E1B57'] as string[],
  },

  typography: {
    heroNumber: { fontSize: 48, fontWeight: '800' as const, lineHeight: 56 },
    splashTitle: { fontSize: 36, fontWeight: '800' as const, lineHeight: 40 },
    screenHeading: { fontSize: 28, fontWeight: '800' as const, lineHeight: 34 },
    cardHeading: { fontSize: 20, fontWeight: '700' as const, lineHeight: 26 },
    body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
    bodyStrong: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
    inputNumber: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
    button: { fontSize: 15, fontWeight: '700' as const, lineHeight: 24 },
    helper: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
    caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  },

  radius: { sm: 8, md: 12, input: 16, card: 18, pill: 999 },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 },

  shadows: {
    card: {
      shadowColor: '#241821',
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 10,
      elevation: 2,
    },
    panel: {
      shadowColor: '#241821',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: -3 },
      shadowRadius: 12,
      elevation: 6,
    },
    primaryButton: {
      shadowColor: '#AB2A86',
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 3,
    },
  },

  motion: {
    fast: 80,
    base: 180,
    slow: 260,
    spring: { tension: 180, friction: 20 },
  },
} as const;

export type Theme = typeof theme;
export default theme;
