import { createTheme, alpha } from '@mui/material/styles'
import { ruRU as coreRuRU } from '@mui/material/locale'
import { ruRU as gridRuRU } from '@mui/x-data-grid/locales'

/**
 * "Reading room" — an editorial library aesthetic.
 *
 * Warm parchment paper, oxblood ink and aged-brass accents instead of the
 * default cold MUI blue/purple. Three voices in the type system:
 *   · Playfair Display — high-contrast display serif for the masthead & titles
 *   · Golos Text       — Cyrillic-first grotesque for all UI / body text
 *   · JetBrains Mono    — catalogue numerals (dates, counts)
 *
 * Both `ruRU` locales are passed to createTheme so every built-in string
 * (DataGrid toolbar, pagination, filter operators, dialogs) is in Russian.
 */

const DISPLAY = '"Playfair Display", "Georgia", serif'
const BODY = '"Golos Text", "Segoe UI", system-ui, sans-serif'
export const MONO = '"JetBrains Mono", "SFMono-Regular", monospace'

const PALETTES = {
  light: {
    mode: 'light',
    primary: { main: '#7a2630', light: '#9c3a44', dark: '#5d1c24', contrastText: '#fbf6ea' },
    secondary: { main: '#9a6a1c', light: '#bd8a36', dark: '#724d12', contrastText: '#fbf6ea' },
    background: { default: '#efe6d4', paper: '#fbf6ea' },
    text: { primary: '#2b211a', secondary: '#6f5d4c' },
    divider: 'rgba(89, 60, 40, 0.18)',
  },
  dark: {
    mode: 'dark',
    primary: { main: '#e08c84', light: '#eaa9a2', dark: '#b9655d', contrastText: '#241712' },
    secondary: { main: '#d8ab5e', light: '#e6c084', dark: '#a87f3c', contrastText: '#241712' },
    background: { default: '#191410', paper: '#241d17' },
    text: { primary: '#efe3d0', secondary: '#b09a82' },
    divider: 'rgba(220, 200, 170, 0.16)',
  },
}

export const createAppTheme = (mode) => {
  const palette = PALETTES[mode] || PALETTES.light

  return createTheme(
    {
      palette,
      shape: { borderRadius: 10 },
      typography: {
        fontFamily: BODY,
        h1: { fontFamily: DISPLAY },
        h2: { fontFamily: DISPLAY },
        h3: { fontFamily: DISPLAY, fontWeight: 800, letterSpacing: '-0.02em' },
        h4: { fontFamily: DISPLAY, fontWeight: 700, letterSpacing: '-0.01em' },
        h5: { fontFamily: DISPLAY, fontWeight: 700 },
        h6: { fontWeight: 600, letterSpacing: '0.01em' },
        subtitle1: { fontFamily: DISPLAY },
        button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
        overline: { fontWeight: 600, letterSpacing: '0.22em' },
      },
      components: {
        MuiPaper: {
          styleOverrides: { root: { backgroundImage: 'none' } },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: alpha(palette.background.paper, 0.82),
              backdropFilter: 'blur(10px)',
              borderBottom: `1px solid ${palette.divider}`,
              color: palette.text.primary,
            },
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              borderRadius: 16,
              border: `1px solid ${palette.divider}`,
              backgroundImage: 'none',
              boxShadow:
                mode === 'dark'
                  ? '0 40px 80px -30px rgba(0,0,0,0.8)'
                  : '0 40px 80px -30px rgba(74, 45, 25, 0.45)',
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: { fontWeight: 600, fontFamily: MONO },
          },
        },
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              backgroundColor: palette.text.primary,
              color: palette.background.paper,
              fontSize: '0.75rem',
              fontWeight: 500,
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: { transition: 'transform .2s ease, background-color .2s ease' },
          },
        },
      },
    },
    gridRuRU,
    coreRuRU,
  )
}
