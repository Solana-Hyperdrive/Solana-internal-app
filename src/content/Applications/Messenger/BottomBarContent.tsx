import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import AttachFileTwoToneIcon from '@mui/icons-material/AttachFileTwoTone';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputBase,
  Tooltip,
  styled,
  useTheme
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

const MessageInputWrapper = styled(InputBase)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(18)};
    padding: ${theme.spacing(1)};
    width: 100%;
`
);

const Input = styled('input')({
  display: 'none'
});

function BottomBarContent({ recUser }) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const { data: me, isLoading } = useIsLoggedIn();
  const theme = useTheme();

  async function handleSendMessage() {
    if (!message) return;

    setIsSending(true);

    await axios.post(
      'https://ledger.flitchcoin.com/send/msg',
      {
        sender_uid: me?.data?.uid,
        rec_uid: recUser?.uid,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );

    setMessage('');
    setIsSending(false);
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const user = {
    name: me?.data?.name,
    avatar: me?.data?.img
  };

  return (
    <Box
      sx={{
        background: theme.colors.alpha.white[50],
        display: 'flex',
        alignItems: 'center',
        p: 1
      }}
    >
      <Box flexGrow={1} display="flex" alignItems="center">
        <Avatar
          sx={{ display: { xs: 'none', sm: 'flex' }, mr: 1 }}
          alt={user.name}
          src={user.avatar}
        />
        <MessageInputWrapper
          autoFocus
          placeholder="Write your message here..."
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Box>
      <Box>
        <Tooltip arrow placement="top" title="Choose an emoji">
          <IconButton
            sx={{ fontSize: theme.typography.pxToRem(16) }}
            color="primary"
          >
            😀
          </IconButton>
        </Tooltip>
        <Input accept="image/*" id="messenger-upload-file" type="file" />
        <Tooltip arrow placement="top" title="Attach a file">
          <label htmlFor="messenger-upload-file">
            <IconButton sx={{ mx: 1 }} color="primary" component="span">
              <AttachFileTwoToneIcon fontSize="small" />
            </IconButton>
          </label>
        </Tooltip>
        <Button
          startIcon={<SendTwoToneIcon />}
          variant="contained"
          disabled={!recUser?.uid || isSending}
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default BottomBarContent;
