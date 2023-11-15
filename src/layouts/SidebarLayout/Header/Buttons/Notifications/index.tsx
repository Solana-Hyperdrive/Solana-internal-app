import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import useNotifications from '@/hooks/useNotifications';
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';
import {
  alpha,
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  Popover,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import useWsStore from 'store/wsStore';
import NotificationCard from './NotificationCard';

const NotificationsBadge = styled(Badge)(
  ({ theme }) => `
    
    .MuiBadge-badge {
        background-color: ${alpha(theme.palette.error.main, 0.1)};
        color: ${theme.palette.error.main};
        min-width: 16px; 
        height: 16px;
        padding: 0;

        &::after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-shadow: 0 0 0 1px ${alpha(theme.palette.error.main, 0.3)};
            content: "";
        }
    }
`
);

function HeaderNotifications() {
  const socket = useWsStore((state) => state.socket);

  const newNotifications = useWsStore((state) => state.newNotifications);
  const updateNotifications = useWsStore((state) => state.updateNotifications);

  const updateNewChat = useWsStore((state) => state.updateNewChat);

  const recUser = useWsStore((state) => state.recUser);

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const { data: me } = useIsLoggedIn();

  const { data, isLoading } = useNotifications();

  // add ws functions
  useEffect(() => {
    socket.on('connect', () => {
      console.log('server connected');
    });

    socket.on('msg', (message) => {
      console.log({ message });

      if (
        (recUser &&
          !message.act &&
          message?.rec_uid === recUser?.uid &&
          message?.sender_uid === me?.data?.uid) ||
        (recUser &&
          !message.act &&
          message?.rec_uid === me?.data?.uid &&
          message?.sender_uid === recUser?.uid)
      )
        updateNewChat(message);
      else updateNotifications(message);
    });

    socket.on('disconnect', () => {
      console.log('disconnected from server');
    });

    return () => {
      socket?.off('connect');
      socket?.off('msg');
      socket?.off('disconnect');
    };
  }, [me?.data?.uid, recUser?.uid]);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  if (isLoading) {
    return null;
  }

  console.log({ newNotifications });

  return (
    <>
      <Tooltip arrow title="Notifications">
        <IconButton color="primary" ref={ref} onClick={handleOpen}>
          <NotificationsBadge
            badgeContent={data?.data?.length + newNotifications.length || 0}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <NotificationsActiveTwoToneIcon />
          </NotificationsBadge>
        </IconButton>
      </Tooltip>

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
        <Box
          sx={{ p: 2 }}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5">Notifications</Typography>
        </Box>

        <Divider />

        <List sx={{ p: 0 }}>
          <ListItem
            sx={{ p: 2, minWidth: 350, display: { xs: 'block', sm: 'flex' } }}
          >
            <Box flex="1">
              <Box display="flex" justifyContent="space-between"></Box>
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {/* New */}
                {newNotifications?.length > 0 ? (
                  <Stack gap={1.5}>
                    {newNotifications?.map((notification: any) => (
                      <NotificationCard
                        key={notification.uuid}
                        notification={notification}
                        isWs={true}
                      />
                    ))}
                  </Stack>
                ) : null}

                {/* Old */}
                {data?.data?.length > 0 ? (
                  <Stack gap={1.5}>
                    {data?.data?.map((notification: any) => (
                      <NotificationCard
                        key={notification.uuid}
                        notification={notification}
                      />
                    ))}
                  </Stack>
                ) : null}

                {/* None */}
                {data?.data?.length === 0 && newNotifications?.length === 0
                  ? 'No new messages in your inbox'
                  : null}
              </Typography>
            </Box>
          </ListItem>
        </List>
      </Popover>
    </>
  );
}

export default HeaderNotifications;
