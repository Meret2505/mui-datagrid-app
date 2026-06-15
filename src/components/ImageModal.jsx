import { Component } from 'react'
import { Dialog, IconButton, Box, Typography } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

/**
 * Class component (per the brief's "можно использовать функциональные и классовые").
 * Shows the full-size book cover when a thumbnail in the grid is clicked.
 */
class ImageModal extends Component {
  render() {
    const { open, onClose, src, alt } = this.props

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        slotProps={{ paper: { sx: { bgcolor: 'transparent', boxShadow: 'none', overflow: 'visible' } } }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={onClose}
            aria-label="Закрыть"
            sx={{
              position: 'absolute',
              right: -16,
              top: -16,
              zIndex: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 3,
              '&:hover': { bgcolor: 'background.paper', color: 'primary.main' },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>

          {src && (
            <Box
              sx={{
                p: 1.5,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 50px 90px -30px rgba(0,0,0,0.7)',
              }}
            >
              <Box
                component="img"
                src={src}
                alt={alt || 'Обложка'}
                sx={{
                  display: 'block',
                  maxWidth: '82vw',
                  maxHeight: '80vh',
                  width: 'auto',
                  borderRadius: 1,
                }}
              />
              {alt && (
                <Typography
                  sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    color: 'text.secondary',
                    mt: 1.25,
                    px: 1,
                    fontSize: '0.95rem',
                  }}
                >
                  {alt}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Dialog>
    )
  }
}

export default ImageModal
