import { LoadingButton } from '@mui/lab'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material'
import { FC, ReactNode } from 'react'
import CloseIcon from '@mui/icons-material/Close';

export type ConfirmDialogProps = {
  title: ReactNode,
  description: ReactNode,
  actions: ReactNode,
  isOpen: boolean,
  isFetching: boolean,
  handleClose: () => void
  handleSubmit?: () => void
}

export const ConfirmDialog: FC<ConfirmDialogProps> = ({ title, description, isOpen, handleClose, actions }) => {
  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth='sm' fullWidth>

      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'center'
        }}>
        <IconButton
          sx={{
            position: 'absolute',
            left: 18,
            top: 10,
          }}
          edge="start"
          color="default"
          onClick={handleClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <div>
        {actions}
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog