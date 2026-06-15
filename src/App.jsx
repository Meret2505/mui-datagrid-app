import { useMemo, useEffect } from 'react'
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Stack,
  IconButton,
  Tooltip,
  Alert,
  Divider,
} from '@mui/material'
import { keyframes } from '@mui/system'
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeIcon from '@mui/icons-material/LightModeOutlined'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import { createAppTheme } from './theme/theme'
import { usePersistentState } from './hooks/usePersistentState'
import { useBooks } from './hooks/useBooks'
import BooksTable from './components/BooksTable'

const rise = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`

// keeps the <body> paper texture in sync with the active MUI palette
const BG_VARS = {
  light: { '--rr-bg': '#efe6d4', '--rr-bg-2': '#e6d8bd', '--rr-glow': 'rgba(122,38,48,0.10)', '--rr-grain': '0.5' },
  dark: { '--rr-bg': '#191410', '--rr-bg-2': '#221a13', '--rr-glow': 'rgba(224,140,132,0.10)', '--rr-grain': '0.85' },
}

export default function App() {
  // bonus: theme mode persisted across reloads
  const [mode, setMode] = usePersistentState('app.themeMode', 'light')
  const theme = useMemo(() => createAppTheme(mode), [mode])

  const { rows, loading, error } = useBooks()

  useEffect(() => {
    const vars = BG_VARS[mode] || BG_VARS.light
    Object.entries(vars).forEach(([k, v]) =>
      document.documentElement.style.setProperty(k, v),
    )
  }, [mode])

  const stats = useMemo(() => {
    if (!rows.length) return null
    const rated = rows.filter((r) => r.rating > 0)
    const avg = rated.length
      ? rated.reduce((s, r) => s + r.rating, 0) / rated.length
      : 0
    return { total: rows.length, avg: avg.toFixed(2) }
  }, [rows])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ gap: 1.5 }}>
          <AutoStoriesIcon sx={{ color: 'primary.main', fontSize: 26 }} />
          <Box sx={{ flexGrow: 1, lineHeight: 1 }}>
            <Typography
              variant="overline"
              sx={{ display: 'block', color: 'text.secondary', lineHeight: 1 }}
            >
              ЧИТАЛЬНЫЙ ЗАЛ
            </Typography>
            <Typography
              sx={{ fontFamily: 'inherit', fontWeight: 700, fontSize: '0.95rem' }}
            >
              Книжный каталог
            </Typography>
          </Box>
          <Tooltip title={mode === 'dark' ? 'Светлая тема' : 'Тёмная тема'}>
            <IconButton
              onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
              aria-label="Переключить тему"
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.primary',
                '&:hover': { transform: 'rotate(-12deg)', color: 'primary.main' },
              }}
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 8 }, pb: 6 }}>
        {/* ---- Editorial masthead ---- */}
        <Box component="header" sx={{ mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              animation: `${rise} .6s ease both`,
            }}
          >
            OPEN&nbsp;LIBRARY · СОБРАНИЕ&nbsp;СОЧИНЕНИЙ
          </Typography>

          <Typography
            component="h1"
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-0.025em',
              fontSize: { xs: '3rem', sm: '4.25rem', md: '5.5rem' },
              mt: 1,
              color: 'text.primary',
              animation: `${rise} .6s ease .05s both`,
            }}
          >
            Книжный
            <Box
              component="span"
              sx={{
                display: 'block',
                fontStyle: 'italic',
                fontWeight: 600,
                color: 'primary.main',
              }}
            >
              каталог
            </Box>
          </Typography>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 2, md: 4 }}
            alignItems={{ xs: 'flex-start', md: 'flex-end' }}
            sx={{ mt: 3, animation: `${rise} .6s ease .12s both` }}
          >
            <Typography
              sx={{
                maxWidth: 540,
                color: 'text.secondary',
                fontSize: '1.02rem',
                lineHeight: 1.6,
              }}
            >
              Живая подборка изданий из&nbsp;
              <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
                Open&nbsp;Library
              </Box>
              . Нажмите на&nbsp;строку, чтобы открыть карточку книги, или на&nbsp;обложку
              — чтобы рассмотреть её&nbsp;крупнее. Сортировка, фильтры и&nbsp;тема
              сохраняются между визитами.
            </Typography>

            {stats && (
              <Stack
                direction="row"
                spacing={3}
                sx={{ ml: { md: 'auto' }, flexShrink: 0 }}
              >
                <Stat value={stats.total} label="изданий" />
                <Box sx={{ borderLeft: '1px solid', borderColor: 'divider' }} />
                <Stat value={`${stats.avg}`} label="ср. рейтинг" />
              </Stack>
            )}
          </Stack>

          <Box sx={{ mt: 4, animation: `${rise} .6s ease .18s both` }}>
            <Divider sx={{ borderBottomWidth: 2, borderColor: 'text.primary', opacity: 0.85 }} />
            <Divider sx={{ mt: '3px', borderColor: 'text.primary', opacity: 0.4 }} />
          </Box>
        </Box>

        {error && (
          <Alert severity="error" variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
            Не&nbsp;удалось загрузить данные: {error}
          </Alert>
        )}

        <Box sx={{ animation: `${rise} .6s ease .24s both` }}>
          <BooksTable rows={rows} loading={loading} />
        </Box>

        <Typography
          component="footer"
          sx={{
            mt: 5,
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: '0.8rem',
          }}
        >
          Данные предоставлены{' '}
          <Box
            component="a"
            href="https://openlibrary.org"
            target="_blank"
            rel="noreferrer"
            sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 600 }}
          >
            Open Library
          </Box>{' '}
          · Собрано на React + Material UI
        </Typography>
      </Container>
    </ThemeProvider>
  )
}

function Stat({ value, label }) {
  return (
    <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
      <Typography
        sx={{
          fontFamily: '"Playfair Display", serif',
          fontWeight: 800,
          fontSize: '2rem',
          lineHeight: 1,
          color: 'primary.main',
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="overline"
        sx={{ color: 'text.secondary', fontSize: '0.65rem' }}
      >
        {label}
      </Typography>
    </Box>
  )
}
