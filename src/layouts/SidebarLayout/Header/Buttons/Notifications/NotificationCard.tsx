import { Button, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';

const NotificationCard = ({ message }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const path = `/applications/messenger/${message.sender_uid}`;

  async function handleMessageClick() {
    await axios.post(
      `https://ledger.flitchcoin.com/commit/seen?uuid=${message.uuid}`,
      message,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );

    queryClient.invalidateQueries({ queryKey: ['notifications'] });

    if (router.asPath !== path) router.push(path);
  }

  // payment notification
  if (message?.act) return null;

  // message notification
  return (
    <Button onClick={handleMessageClick} variant="text">
      <Typography component="span" variant="body2" color="text.secondary">
        {message.message}
      </Typography>
    </Button>
  );
};

export default NotificationCard;
