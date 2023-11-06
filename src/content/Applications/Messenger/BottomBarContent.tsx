import Modal from '@/components/Modal';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputBase,
  Stack,
  TextField,
  Tooltip,
  Typography,
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

function BottomBarContent({ recUser }) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [amount, setAmount] = useState(0);
  const [isPaying, setIsPaying] = useState(false);

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

  async function handleSendPayment() {
    if (!amount) return;

    setIsPaying(true);

    await axios.post(
      'https://ledger.flitchcoin.com/payment/request',
      {
        sender_uid: me?.data?.uid,
        rec_uid: recUser?.uid,
        message: `Payment of ${amount} from ${me?.data?.name} to ${
          recUser?.name || recUser?.email
        }`,
        act: {
          uid: me?.data?.uid,
          seen: false,
          peer: {
            // no_revert: true,
            uid_sender: me?.data?.uid,
            rec_uid: recUser?.uid,
            message: `Payment of ${amount} from ${me?.data?.name} to ${recUser?.name}`,
            amt: amount,
            token: 'sol',
            currency: 'USD'
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );

    setAmount(0);
    setIsPaying(false);
  }

  if (isLoading || !recUser) {
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
        <Modal
          defaultOpen={false}
          buttonText={
            <Tooltip arrow placement="top" title="Request Payment">
              <IconButton
                sx={{ fontSize: theme.typography.pxToRem(16), p: 1 }}
                color="primary"
                disabled={!recUser?.uid || isPaying}
              >
                🤑
              </IconButton>
            </Tooltip>
          }
          modalHeader={
            <Typography fontSize={30} fontWeight={800}>
              Payment
            </Typography>
          }
          dialogContentHeader={''}
          dialogContent={
            <Stack gap={2} alignItems="center">
              <Typography>
                Please enter amount to send to {recUser?.name}
              </Typography>
              <TextField
                id="amount"
                type="number"
                label="Amount"
                variant="outlined"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </Stack>
          }
          handleAction={handleSendPayment}
        />

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
