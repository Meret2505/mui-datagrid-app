import { createTheme } from '@mui/material/styles'

// A small, opinionated palette. The accent is an ink-blue rather than the
// default MUI purple, paired with a warm amber for highlights — chosen to suit
// a "library / reading room" subject without falling back to defaults.
const shared = {
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h6: { fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
}

export const createAppTheme = (mode) =>
  createTheme({
    ...shared,
    palette:
      mode === 'dark'
        ? {
            mode: 'dark',
            primary: { main: '#7AA2F7' },
            secondary: { main: '#E0AF68' },
            background: { default: '#11131A', paper: '#1A1D27' },
            text: { primary: '#E6E8EF', secondary: '#9AA0B0' },
          }
        : {
            mode: 'light',
            primary: { main: '#2F4B7C' },
            secondary: { main: '#C77B30' },
            background: { default: '#F5F3EE', paper: '#FFFFFF' },
            text: { primary: '#1C2433', secondary: '#5A6275' },
          },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
    },
  })
