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
  buttonText,
  modalHeader,
  dialogContentHeader,
  dialogContent,
  handleAction
}: {
  buttonText: React.ReactNode | string;
  modalHeader: React.ReactNode | string;
  dialogContentHeader: React.ReactNode | string;
  dialogContent: React.ReactNode | string;
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
        {buttonText}
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
