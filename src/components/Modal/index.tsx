import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import React from 'react';

function Modal({
  modalHeader,
  dialogContentHeader,
  dialogContent,
  handleAction
}: {
  modalHeader: string;
  dialogContentHeader: string;
  dialogContent: React.ReactNode;
  handleAction: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Alias
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{modalHeader}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogContentHeader}</DialogContentText>
          {dialogContent}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={async () => {
              await handleAction();
              handleClose();
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Modal;
