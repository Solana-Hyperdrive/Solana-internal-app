import {
  alpha,
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  Popover,
  Tooltip,
  Typography
} from '@mui/material';
import { useRef, useState } from 'react';
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';
import { styled } from '@mui/material/styles';

import useNotifications from '@/hooks/useNotifications';

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
  const ref = useRef<any>(null);

  const [isOpen, setOpen] = useState<boolean>(false);

  const { isLoading } = useNotifications();

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  if (isLoading) {
    return null;
  }

  const data =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('notifications')) || []
      : [];

  return (
    <>
      <Tooltip arrow title="Notifications">
        <IconButton color="primary" ref={ref} onClick={handleOpen}>
          <NotificationsBadge
            badgeContent={data?.length}
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
                {data?.length > 0 ? (
                  <>
                    {data?.map((message: any) => (
                      <div key={message.uuid}>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {message.message}
                        </Typography>
                        <br />
                      </div>
                    ))}
                  </>
                ) : (
                  'No new messages in your inbox'
                )}
              </Typography>
            </Box>
          </ListItem>
        </List>
      </Popover>
    </>
  );
}

// [
//   {
//     uuid: '7e7a566e-2771-40b7-adc7-ee7dea183e98',
//     sender_uid:
//       '2266a962f5fd4a9dadcd5de322b228fbaada652f834f5aeb9705c31ba83fd4d9',
//     rec_uid: '8d20d427269f4f5ab4b5dcf5a5ad64997f2bea8dd7ba52018506f1196ae651c0',
//     message: 'hello',
//     act: null,
//     seen: false,
//     ts: 1697211331.965007
//   },
//   {
//     uuid: '98b6ee67-ad9a-4d19-b9f2-2f0119754241',
//     sender_uid:
//       '2266a962f5fd4a9dadcd5de322b228fbaada652f834f5aeb9705c31ba83fd4d9',
//     rec_uid: '8d20d427269f4f5ab4b5dcf5a5ad64997f2bea8dd7ba52018506f1196ae651c0',
//     message: 'nope',
//     act: null,
//     seen: false,
//     ts: 1697211379.5494144
//   }
// ];

export default HeaderNotifications;
