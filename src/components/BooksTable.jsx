import { useMemo, useState } from 'react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Box, Typography, Avatar, Chip, Rating } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import { usePersistentState } from '../hooks/usePersistentState'
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
    { page: 0, pageSize: 10 }
  )

  const columns = useMemo(
    () => [
      {
        field: 'coverThumb',
        headerName: 'Обложка',
        width: 110,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              py: 1,
            }}
          >
            <Avatar
              variant="rounded"
              src={params.value}
              alt={params.row.title}
              onClick={(e) => {
                e.stopPropagation() // don't trigger the row-detail modal
                setImageModal({
                  open: true,
                  src: params.row.coverLarge || params.value,
                  alt: params.row.title,
                })
              }}
              sx={{
                width: 60,
                height: 88,
                cursor: 'zoom-in',
                boxShadow: 2,
                transition: 'transform .15s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            />
          </Box>
        ),
      },
      {
        field: 'title',
        headerName: 'Название',
        flex: 1.4,
        minWidth: 200,
        renderCell: (params) => (
          // custom style #1: bold serif-ish heading
          <Typography
            sx={{
              fontWeight: 700,
              fontFamily: 'Georgia, "Times New Roman", serif',
              color: 'primary.main',
              whiteSpace: 'normal',
              lineHeight: 1.3,
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
          // custom style #2: italic secondary colour
          <Typography
            sx={{
              fontStyle: 'italic',
              color: 'secondary.main',
              fontSize: '0.9rem',
            }}
          >
            {params.value}
          </Typography>
        ),
      },
      {
        field: 'published',
        headerName: 'Дата издания',
        type: 'date',
        width: 150,
        valueFormatter: (value) => (value ? dateFmt.format(value) : '—'),
        renderCell: (params) => (
          // custom style #3: monospace date
          <Typography
            sx={{
              fontFamily: '"Roboto Mono", monospace',
              fontSize: '0.85rem',
              color: 'text.secondary',
              letterSpacing: '0.02em',
            }}
          >
            {params.row.published ? dateFmt.format(params.row.published) : '—'}
          </Typography>
        ),
      },
      {
        field: 'rating',
        headerName: 'Рейтинг',
        type: 'number',
        width: 160,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Rating
              value={params.value}
              precision={0.1}
              readOnly
              size="small"
              emptyIcon={<StarIcon fontSize="inherit" />}
            />
          </Box>
        ),
      },
      {
        field: 'pages',
        headerName: 'Страниц',
        type: 'number',
        width: 120,
        renderCell: (params) => (
          <Chip
            label={params.value || '—'}
            size="small"
            color={params.value > 400 ? 'secondary' : 'default'}
            variant="outlined"
          />
        ),
      },
    ],
    []
  )

  return (
    <Box sx={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        // automatic row height between 100 and 300px
        getRowHeight={() => 'auto'}
        sx={{
          '& .MuiDataGrid-cell': {
            minHeight: 100,
            maxHeight: 300,
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiDataGrid-row': { cursor: 'pointer' },
          border: 'none',
          borderRadius: 3,
          bgcolor: 'background.paper',
          boxShadow: 2,
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: 'background.default',
            fontWeight: 700,
          },
        }}
        // open detail modal on row click
        onRowClick={(params) =>
          setDetailModal({ open: true, book: params.row })
        }
        // persisted, controlled state
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
            quickFilterProps: { debounceMs: 300 },
          },
        }}
        disableRowSelectionOnClick
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
