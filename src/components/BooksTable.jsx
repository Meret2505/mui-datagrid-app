import { useMemo, useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Box, Typography, Chip, Rating, Stack } from '@mui/material'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded'
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded'
import { alpha } from '@mui/material/styles'
import { usePersistentState } from '../hooks/usePersistentState'
import { MONO } from '../theme/theme'
import RowDetailModal from './RowDetailModal'
import ImageModal from './ImageModal'

const dateFmt = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export default function BooksTable({ rows, loading }) {
  // image-zoom modal state
  const [imageModal, setImageModal] = useState({ open: false, src: null, alt: '' })
  // row-detail modal state
  const [detailModal, setDetailModal] = useState({ open: false, book: null })

  // --- Persisted DataGrid state (bonus: survives reload) ---
  const [sortModel, setSortModel] = usePersistentState('grid.sortModel', [
    { field: 'rating', sort: 'desc' },
  ])
  const [filterModel, setFilterModel] = usePersistentState('grid.filterModel', {
    items: [],
  })
  const [paginationModel, setPaginationModel] = usePersistentState(
    'grid.paginationModel',
    { page: 0, pageSize: 10 },
  )

  const columns = useMemo(
    () => [
      {
        field: 'coverThumb',
        headerName: 'Обложка',
        width: 116,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', py: 1.5 }}>
            <Box
              role="button"
              tabIndex={0}
              aria-label="Увеличить обложку"
              onClick={(e) => {
                e.stopPropagation() // don't trigger the row-detail modal
                setImageModal({
                  open: true,
                  src: params.row.coverLarge || params.value,
                  alt: params.row.title,
                })
              }}
              sx={{
                position: 'relative',
                width: 62,
                height: 92,
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'zoom-in',
                bgcolor: 'background.default',
                boxShadow: '0 6px 16px -8px rgba(60,30,10,0.6)',
                outline: '1px solid',
                outlineColor: 'divider',
                transition: 'transform .2s ease, box-shadow .2s ease',
                '& .zoom': { opacity: 0, transition: 'opacity .2s ease' },
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.04)',
                  boxShadow: '0 14px 26px -10px rgba(60,30,10,0.7)',
                },
                '&:hover .zoom': { opacity: 1 },
              }}
            >
              {params.value ? (
                <Box
                  component="img"
                  src={params.value}
                  alt={params.row.title}
                  loading="lazy"
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'grid',
                    placeItems: 'center',
                    color: 'text.secondary',
                    fontFamily: MONO,
                    fontSize: 11,
                  }}
                >
                  нет
                </Box>
              )}
              <Box
                className="zoom"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'rgba(20,10,5,0.45)',
                  color: '#fff',
                }}
              >
                <ZoomInRoundedIcon fontSize="small" />
              </Box>
            </Box>
          </Box>
        ),
      },
      {
        field: 'title',
        headerName: 'Название',
        flex: 1.5,
        minWidth: 210,
        renderCell: (params) => (
          // custom style #1: high-contrast display serif
          <Typography
            sx={{
              fontFamily: '"Playfair Display", serif',
              fontWeight: 700,
              fontSize: '1.05rem',
              lineHeight: 1.25,
              color: 'text.primary',
              whiteSpace: 'normal',
              py: 0.5,
            }}
          >
            {params.value}
          </Typography>
        ),
      },
      {
        field: 'author',
        headerName: 'Автор',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => (
          // custom style #2: italic, brass secondary colour, small caps lead
          <Stack spacing={0.25} sx={{ py: 0.5 }}>
            <Typography
              variant="overline"
              sx={{ color: 'text.secondary', lineHeight: 1, fontSize: '0.6rem' }}
            >
              автор
            </Typography>
            <Typography
              sx={{
                fontStyle: 'italic',
                fontWeight: 500,
                color: 'secondary.main',
                fontSize: '0.95rem',
                lineHeight: 1.2,
                whiteSpace: 'normal',
              }}
            >
              {params.value}
            </Typography>
          </Stack>
        ),
      },
      {
        field: 'published',
        headerName: 'Издано',
        type: 'date',
        width: 130,
        valueFormatter: (value) => (value ? dateFmt.format(value) : '—'),
        renderCell: (params) => (
          // custom style #3: monospace catalogue date
          <Box
            sx={{
              fontFamily: MONO,
              fontSize: '0.82rem',
              color: 'text.secondary',
              letterSpacing: '0.02em',
              px: 1,
              py: 0.4,
              borderLeft: '2px solid',
              borderColor: 'divider',
            }}
          >
            {params.row.published ? dateFmt.format(params.row.published) : '—'}
          </Box>
        ),
      },
      {
        field: 'rating',
        headerName: 'Рейтинг',
        type: 'number',
        width: 168,
        renderCell: (params) => (
          <Stack alignItems="flex-start" spacing={0.25} sx={{ py: 0.5 }}>
            <Rating
              value={params.value}
              precision={0.1}
              readOnly
              size="small"
              icon={<StarRoundedIcon fontSize="inherit" />}
              emptyIcon={<StarBorderRoundedIcon fontSize="inherit" />}
              sx={{ color: 'secondary.main' }}
            />
            <Typography sx={{ fontFamily: MONO, fontSize: '0.72rem', color: 'text.secondary' }}>
              {params.value ? params.value.toFixed(2) : '—'}
              {params.row.ratingsCount ? ` · ${params.row.ratingsCount}` : ''}
            </Typography>
          </Stack>
        ),
      },
      {
        field: 'pages',
        headerName: 'Страниц',
        type: 'number',
        width: 120,
        renderCell: (params) => (
          <Chip
            label={params.value ? `${params.value} стр.` : '—'}
            size="small"
            variant="outlined"
            sx={{
              borderColor: params.value > 400 ? 'primary.main' : 'divider',
              color: params.value > 400 ? 'primary.main' : 'text.secondary',
              fontWeight: 600,
            }}
          />
        ),
      },
    ],
    [],
  )

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        // automatic row height, clamped to 100–300px via cell CSS below
        getRowHeight={() => 'auto'}
        onRowClick={(params) => setDetailModal({ open: true, book: params.row })}
        // persisted, controlled state (bonus)
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25]}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 300, placeholder: 'Поиск…' },
          },
        }}
        disableRowSelectionOnClick
        columnHeaderHeight={52}
        sx={(theme) => ({
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          bgcolor: 'background.paper',
          overflow: 'hidden',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 30px 60px -35px rgba(0,0,0,0.8)'
              : '0 30px 60px -35px rgba(74,45,25,0.4)',
          fontFamily: theme.typography.fontFamily,

          // clamp auto row height
          '& .MuiDataGrid-cell': {
            minHeight: '100px !important',
            maxHeight: '300px !important',
            display: 'flex',
            alignItems: 'center',
            borderColor: alpha(theme.palette.divider, 0.6),
          },
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': { outline: 'none' },
          '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none',
          },

          // editorial header
          '& .MuiDataGrid-columnHeaders': {
            borderBottom: '2px solid',
            borderColor: 'text.primary',
          },
          '& .MuiDataGrid-columnHeader': {
            bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.1 : 0.05),
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 700,
            fontSize: '0.72rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'text.primary',
          },

          // rows
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
            transition: 'background-color .15s ease, box-shadow .15s ease',
            position: 'relative',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.12 : 0.06),
            boxShadow: `inset 3px 0 0 0 ${theme.palette.primary.main}`,
          },

          // toolbar
          '& .MuiDataGrid-toolbarContainer': {
            padding: theme.spacing(1.5, 2),
            gap: theme.spacing(1),
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: alpha(theme.palette.background.default, 0.5),
            '& .MuiButton-root': { color: theme.palette.text.secondary, fontWeight: 600 },
            '& .MuiButton-root:hover': { color: theme.palette.primary.main },
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid',
            borderColor: 'divider',
          },
        })}
      />

      <ImageModal
        open={imageModal.open}
        src={imageModal.src}
        alt={imageModal.alt}
        onClose={() => setImageModal({ open: false, src: null, alt: '' })}
      />

      <RowDetailModal
        open={detailModal.open}
        book={detailModal.book}
        onClose={() => setDetailModal({ open: false, book: null })}
      />
    </Box>
  )
}
