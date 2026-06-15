import { useMemo } from 'react'
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { createAppTheme } from './theme/theme'
import { usePersistentState } from './hooks/usePersistentState'
import { useBooks } from './hooks/useBooks'
import BooksTable from './components/BooksTable'

export default function App() {
  // bonus: theme mode persisted across reloads
  const [mode, setMode] = usePersistentState('app.themeMode', 'light')
  const theme = useMemo(() => createAppTheme(mode), [mode])

  const { rows, loading, error } = useBooks()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar>
          <MenuBookIcon sx={{ mr: 1.5, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
            Книжный каталог
          </Typography>
          <Tooltip title={mode === 'dark' ? 'Светлая тема' : 'Тёмная тема'}>
            <IconButton
              onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
              color="inherit"
              aria-label="Переключить тему"
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Каталог книг
          </Typography>
          <Typography color="text.secondary">
            Данные из Open Library API. Кликните по строке — откроется карточка
            книги. Кликните по обложке — увеличенное изображение. Сортировка,
            фильтры и тема сохраняются после перезагрузки.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Ошибка загрузки: {error}
          </Alert>
        )}

        <BooksTable rows={rows} loading={loading} />
      </Container>
    </ThemeProvider>
  )
}
