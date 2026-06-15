import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Stack,
  Chip,
  Rating,
  Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import StarIcon from '@mui/icons-material/Star'

const dateFmt = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export default function RowDetailModal({ open, onClose, book }) {
  if (!book) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pr: 6, fontWeight: 700 }}>
        Подробнее о книге
        <IconButton
          onClick={onClose}
          aria-label="Закрыть"
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          {book.coverThumb && (
            <Box
              component="img"
              src={book.coverThumb}
              alt={book.title}
              sx={{
                width: 140,
                borderRadius: 2,
                boxShadow: 3,
                objectFit: 'cover',
                alignSelf: 'flex-start',
              }}
            />
          )}

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              {book.title}
            </Typography>
            <Typography
              variant="subtitle1"
              color="secondary.main"
              sx={{ fontStyle: 'italic', mb: 2 }}
            >
              {book.author}
            </Typography>

            <Stack spacing={1.5}>
              <Row label="Дата издания">
                {book.published ? dateFmt.format(book.published) : '—'}
              </Row>

              <Divider />

              <Row label="Рейтинг">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating
                    value={book.rating}
                    precision={0.1}
                    readOnly
                    size="small"
                    emptyIcon={<StarIcon fontSize="inherit" />}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {book.rating} ({book.ratingsCount} оценок)
                  </Typography>
                </Stack>
              </Row>

              <Divider />

              <Row label="Объём">
                <Chip
                  label={`${book.pages || '—'} стр.`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Row>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

function Row({ label, children }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
        {label}
      </Typography>
      <Box>{children}</Box>
    </Stack>
  )
}
