import { useRef, useState } from 'react';

import NextLink from 'next/link';

import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  Typography
} from '@mui/material';

import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import AccountTreeTwoToneIcon from '@mui/icons-material/AccountTreeTwoTone';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import InboxTwoToneIcon from '@mui/icons-material/InboxTwoTone';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

function HeaderUserbox() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data, isLoading } = useIsLoggedIn();

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  if (isLoading) {
    return null;
  }

  const user = {
    name: data?.data?.name,
    avatar: data?.data?.img
  };

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar variant="rounded" alt={user.name} src={user.avatar} />
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">{user.name}</UserBoxLabel>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar variant="rounded" alt={user.name} src={user.avatar} />
          <UserBoxText>
            <UserBoxLabel variant="body1">{user.name}</UserBoxLabel>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1 }} component="nav">
          <NextLink href="/applications/messenger" passHref>
            <ListItemButton>
              <InboxTwoToneIcon fontSize="small" />
              <ListItemText primary="Messenger" />
            </ListItemButton>
          </NextLink>
          <NextLink href="/management/profile/settings" passHref>
            <ListItemButton>
              <AccountTreeTwoToneIcon fontSize="small" />
              <ListItemText primary="Account Settings" />
            </ListItemButton>
          </NextLink>
        </List>
        <Divider />
        <Box sx={{ m: 1 }}>
          <Button
            color="primary"
            fullWidth
            onClick={async () => {
              try {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                await axios.get('https://ledger.flitchcoin.com/sign-out', {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      'accessToken'
                    )}`
                  }
                });

                queryClient.invalidateQueries({ queryKey: ['me'] });

                router.push('/');
              } catch (err) {
                console.error(err);
              }
            }}
          >
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Sign out
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
