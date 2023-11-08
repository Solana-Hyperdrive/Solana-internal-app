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
import { useRef, useState } from 'react';
import useWsStore from 'store/ws';
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
  const newNotifications = useWsStore((state) => state.newNotifications);

  const ref = useRef<any>(null);

  const [isOpen, setOpen] = useState<boolean>(false);

  const { data, isLoading } = useNotifications();

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
                {newNotifications?.length > 0 ? (
                  <Stack gap={1.5}>
                    {newNotifications?.map((notification: any) => (
                      <NotificationCard
                        key={notification.uuid}
                        notification={notification}
                      />
                    ))}
                  </Stack>
                ) : null}
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
