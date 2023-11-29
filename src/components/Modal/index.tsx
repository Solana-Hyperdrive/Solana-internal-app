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
  actionCTA = 'Add',
  handleAction,
  shouldCloseOnDialogClick = false
}: {
  defaultOpen?: boolean;
  buttonText?: React.ReactNode | string;
  modalHeader: React.ReactNode | string;
  dialogContentHeader: React.ReactNode | string;
  dialogContent: React.ReactNode | string;
  actionCTA?: string;
  handleAction?: () => void;
  shouldCloseOnDialogClick?: boolean;
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
          <span
            onClick={() => {
              shouldCloseOnDialogClick ? handleClose() : null;
            }}
          >
            {dialogContent}
          </span>
        </DialogContent>
        <DialogActions sx={{ padding: '2rem' }}>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          {handleAction ? (
            <Button
              variant="contained"
              onClick={() => {
                handleAction();
                handleClose();
              }}
            >
              {actionCTA}
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Modal;
