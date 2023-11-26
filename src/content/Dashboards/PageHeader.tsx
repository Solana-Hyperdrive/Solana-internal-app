import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { Send } from '@mui/icons-material';
import AddAlertTwoToneIcon from '@mui/icons-material/AddAlertTwoTone';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
  alpha,
  lighten,
  styled
} from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import SendUserSol from './SendUserSol';

const AvatarPageTitle = styled(Avatar)(
  ({ theme }) => `
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      color: ${theme.colors.primary.main};
      margin-right: ${theme.spacing(2)};
      background: ${
        theme.palette.mode === 'dark'
          ? theme.colors.alpha.trueWhite[10]
          : theme.colors.alpha.white[50]
      };
      box-shadow: ${
        theme.palette.mode === 'dark'
          ? '0 1px 0 ' +
            alpha(lighten(theme.colors.primary.main, 0.8), 0.2) +
            ', 0px 2px 4px -3px rgba(0, 0, 0, 0.3), 0px 5px 16px -4px rgba(0, 0, 0, .5)'
          : '0px 2px 4px -3px ' +
            alpha(theme.colors.alpha.black[100], 0.4) +
            ', 0px 5px 16px -4px ' +
            alpha(theme.colors.alpha.black[100], 0.2)
      };
`
);

function PageHeader() {
  const { data: me, isLoading: isMeLoading } = useIsLoggedIn();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const user = {
    name: me?.data?.name,
    avatar: me?.data?.img
  };

  return (
    <Box
      display="flex"
      alignItems={{ xs: 'stretch', md: 'center' }}
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
    >
      <Box display="flex" alignItems="center">
        <AvatarPageTitle variant="rounded">
          <AddAlertTwoToneIcon fontSize="large" />
        </AvatarPageTitle>
        <Box>
          <Typography variant="h3" component="h3" gutterBottom>
            <Stack direction="row" gap={1}>
              Welcome,
              {isMeLoading ? (
                <Skeleton variant="rectangular" width={200} />
              ) : (
                <span>{user.name || 'User'}</span>
              )}
              !
            </Stack>
          </Typography>
          <Typography variant="subtitle2">
            Manage your aliases and contacts in a highly secure environment!
          </Typography>
        </Box>
      </Box>
      <Stack direction="row" gap={2} flexWrap="wrap" mt={3}>
        <Button
          variant="contained"
          endIcon={<Send sx={{ ml: '0.75rem' }} />}
          onClick={handleClickOpen}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            Send{' '}
            <Image
              src="/static/images/logo/SOL.svg"
              width={20}
              height={20}
              alt="Solana"
            />
          </Stack>
        </Button>
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>Send SOL</DialogTitle>

          <DialogContent>
            <DialogContentText mb={3}>
              Search User -{'>'} Enter Amount -{'>'} Send
            </DialogContentText>
            <SendUserSol handleCloseDialog={handleClose} />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="error">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
}

export default PageHeader;
