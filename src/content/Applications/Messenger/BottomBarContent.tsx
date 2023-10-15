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

function BottomBarContent() {
  const [message, setMessage] = useState('');

  const { data, isLoading } = useIsLoggedIn();
  const theme = useTheme();

  async function handleSendMessage(currentUID: string) {
    if (!message) return;

    await axios.post(
      'https://ledger.flitchcoin.com/send/msg',
      {
        sender_uid: currentUID,
        rec_uid:
          '8d20d427269f4f5ab4b5dcf5a5ad64997f2bea8dd7ba52018506f1196ae651c0',
        message
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );

    setMessage('');
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const user = {
    name: data?.data?.name,
    avatar: data?.data?.img
  };

  // console.log({ data: data?.data?.uid });
  // uid of other - 8d20d427269f4f5ab4b5dcf5a5ad64997f2bea8dd7ba52018506f1196ae651c0

  return (
    <Box
      sx={{
        background: theme.colors.alpha.white[50],
        display: 'flex',
        alignItems: 'center',
        p: 2
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
          onClick={() => handleSendMessage(data?.data?.uid)}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}

export default BottomBarContent;
