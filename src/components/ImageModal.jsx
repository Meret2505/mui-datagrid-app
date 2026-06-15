import { Component } from 'react'
import { Dialog, IconButton, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

/**
 * Class component (per the brief's "можно использовать функциональные и классовые").
 * Shows the full-size book cover when a thumbnail in the grid is clicked.
 */
class ImageModal extends Component {
  render() {
    const { open, onClose, src, alt } = this.props

    return (
      <Dialog open={open} onClose={onClose} maxWidth="md">
        <Box sx={{ position: 'relative', bgcolor: 'background.paper' }}>
          <IconButton
            onClick={onClose}
            aria-label="Закрыть"
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <CloseIcon />
          </IconButton>
          {src && (
            <Box
              component="img"
              src={src}
              alt={alt || 'Обложка'}
              sx={{
                display: 'block',
                maxWidth: '90vw',
                maxHeight: '85vh',
                width: 'auto',
              }}
            />
          )}
        </Box>
      </Dialog>
    )
  }
}

export default ImageModal
