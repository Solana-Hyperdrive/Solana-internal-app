import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText
} from '@mui/material';

const LoadingModal = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <>
      {isLoading ? (
        <Dialog fullScreen open={true}>
          <DialogContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <CircularProgress size={200} />

            <DialogContentText>Transaction in progress</DialogContentText>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};

export default LoadingModal;
