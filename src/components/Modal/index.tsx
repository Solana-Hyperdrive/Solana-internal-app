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
  defaultOpen = false,
  buttonText,
  modalHeader,
  dialogContentHeader,
  dialogContent,
  handleAction
}: {
  defaultOpen?: boolean;
  buttonText: React.ReactNode | string;
  modalHeader: React.ReactNode | string;
  dialogContentHeader: React.ReactNode | string;
  dialogContent: React.ReactNode | string;
  handleAction: () => void;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {!defaultOpen ? (
        <>
          {typeof buttonText === 'string' ? (
            <Button variant="outlined" onClick={handleClickOpen}>
              {buttonText}
            </Button>
          ) : (
            <span onClick={handleClickOpen}>{buttonText}</span>
          )}
        </>
      ) : null}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{modalHeader}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogContentHeader}</DialogContentText>
          {dialogContent}
        </DialogContent>
        <DialogActions sx={{ padding: '2rem' }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleAction();
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
