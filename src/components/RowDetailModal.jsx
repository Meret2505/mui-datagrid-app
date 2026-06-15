import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Stack,
  Chip,
  Rating,
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import { alpha } from '@mui/material/styles'
import { MONO } from '../theme/theme'

const dateFmt = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export default function RowDetailModal({ open, onClose, book }) {
  if (!book) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <IconButton
        onClick={onClose}
        aria-label="Закрыть"
        sx={{
          position: 'absolute',
          right: 12,
          top: 12,
          zIndex: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': { color: 'primary.main' },
        }}
      >
        <CloseRoundedIcon fontSize="small" />
      </IconButton>

      <DialogContent sx={{ p: 0 }}>
        {/* hero band */}
        <Box
          sx={(theme) => ({
            p: { xs: 3, sm: 4 },
            background: `linear-gradient(135deg, ${alpha(
              theme.palette.primary.main,
              theme.palette.mode === 'dark' ? 0.22 : 0.1,
            )}, transparent 70%)`,
            borderBottom: '1px solid',
            borderColor: 'divider',
          })}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
            {book.coverThumb && (
              <Box
                component="img"
                src={book.coverThumb}
                alt={book.title}
                sx={{
                  width: 132,
                  borderRadius: 1.5,
                  boxShadow: '0 18px 36px -14px rgba(50,25,10,0.7)',
                  objectFit: 'cover',
                  alignSelf: 'flex-start',
                  outline: '1px solid',
                  outlineColor: 'divider',
                }}
              />
            )}

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="overline" sx={{ color: 'primary.main' }}>
                карточка издания
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Playfair Display", serif',
                  fontWeight: 800,
                  fontSize: '1.7rem',
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                  color: 'text.primary',
                  my: 0.5,
                }}
              >
                {book.title}
              </Typography>
              <Typography
                sx={{
                  fontStyle: 'italic',
                  color: 'secondary.main',
                  fontSize: '1.05rem',
                }}
              >
                {book.author}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* metadata */}
        <Stack sx={{ p: { xs: 3, sm: 4 }, pt: { xs: 2.5, sm: 3 } }} spacing={0}>
          <Field label="Дата издания">
            <Box component="span" sx={{ fontFamily: MONO, fontSize: '0.9rem' }}>
              {book.published ? dateFmt.format(book.published) : '—'}
            </Box>
          </Field>

          <Field label="Рейтинг">
            <Stack direction="row" spacing={1} alignItems="center">
              <Rating
                value={book.rating}
                precision={0.1}
                readOnly
                size="small"
                icon={<StarRoundedIcon fontSize="inherit" />}
                emptyIcon={<StarBorderRoundedIcon fontSize="inherit" />}
                sx={{ color: 'secondary.main' }}
              />
              <Typography sx={{ fontFamily: MONO, fontSize: '0.82rem', color: 'text.secondary' }}>
                {book.rating ? book.rating.toFixed(2) : '—'} · {book.ratingsCount} оц.
              </Typography>
            </Stack>
          </Field>

          <Field label="Объём" last>
            <Chip
              label={book.pages ? `${book.pages} стр.` : 'неизвестно'}
              size="small"
              variant="outlined"
              sx={{ borderColor: 'primary.main', color: 'primary.main', fontWeight: 600 }}
            />
          </Field>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

function Field({ label, children, last }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        py: 1.75,
        borderBottom: last ? 'none' : '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography
        variant="overline"
        sx={{ color: 'text.secondary', fontSize: '0.66rem' }}
      >
        {label}
      </Typography>
      <Box sx={{ textAlign: 'right' }}>{children}</Box>
    </Stack>
  )
}
