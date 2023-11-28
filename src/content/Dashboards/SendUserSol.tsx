import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { Send } from '@mui/icons-material';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  OutlinedInput,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
  styled
} from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery } from 'react-query';

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
    padding-right: ${theme.spacing(0.7)}
`
);

function SendUserSol({ handleCloseDialog }: { handleCloseDialog: () => void }) {
  const searchTypes = [
    {
      value: 'alias',
      text: 'Alias'
    },
    {
      value: 'email',
      text: 'Email ID'
    },
    {
      value: 'sol_wallet',
      text: 'Wallet ID'
    }
  ];

  const actionRef1 = useRef<any>(null);
  const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false);
  const [searchBy, setSearchBy] = useState(searchTypes[0]);

  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [amount, setAmount] = useState('');

  const { data: user } = useIsLoggedIn();
  const {
    data: contact,
    isLoading,
    isFetched
  } = useQuery(
    ['sendUser', searchText],
    async () =>
      axios.post(
        `https://ledger.flitchcoin.com/api/strict/search
`,
        {
          [searchBy.value]: searchText
        }
      ),
    {
      enabled: isSearching && !!searchText,
      retry: false,
      onSettled: () => setIsSearching(false)
    }
  );

  function startSearch() {
    if (!searchText) return;

    setIsSearching(true);
  }

  // async function handleAcceptPayment() {
  //   try {
  //     if (personalPin.length !== 6) return;

  //     const response = await axios.post(
  //       'https://ledger.flitchcoin.com/init/payment/request?solpay=false',
  //       {
  //         ptm: notification.act,
  //         ppin: {
  //           personal_pin: encryptedPPin
  //         }
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('accessToken')}`
  //         }
  //       }
  //     );

  //     const { pub_key, token } = response.data;

  //     const prices = await axios.get(
  //       'https://ledger.flitchcoin.com/api/prices'
  //     );

  //     const sol = +(usd / prices.data.SOL.price).toFixed(6);

  //     const sign = await sendSol(pub_key, sol);

  //     const encryptedSign = AES.encrypt(
  //       sign,
  //       process.env.NEXT_PUBLIC_AES_KEY
  //     ).toString();

  //     await axios.post(
  //       'https://ledger.flitchcoin.com/payment/verification',
  //       {
  //         sign: encryptedSign,
  //         token
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('accessToken')}`
  //         }
  //       }
  //     );
  //   } catch (err) {
  //     if (err instanceof AxiosError) {
  //       console.log({ err });
  //     } else if (err instanceof Error && err.message === 'No Public Key') {
  //       setShouldConnectWallet(false); // to force re-render of connect wallet modal
  //       setShouldConnectWallet(true);
  //     } else {
  //       console.log({ err });
  //     }
  //   } finally {
  //     setPersonalPin('');
  //     handleClose();
  //   }
  // }

  async function handleSendSol() {
    if (!user || !contact) return;

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter valid amount to send');
      return;
    }

    console.log('sent');
    handleCloseDialog();
  }

  return (
    <>
      <Box component="form">
        <Stack mb={3} direction="row" gap={2}>
          <FormControl>
            <InputLabel id="currency">Currency</InputLabel>
            <Select
              labelId="currency"
              id="currency"
              label="Currency"
              defaultValue="sol"
            >
              <MenuItem value="sol">
                <Stack direction="row" alignItems="center" gap={2}>
                  SOL{' '}
                  <Image
                    src="/static/images/logo/SOL.svg"
                    width={20}
                    height={20}
                    alt="Solana"
                  />
                </Stack>
              </MenuItem>
              <MenuItem value="usd">USD $</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Amount"
            inputMode="numeric"
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Stack>

        <Box
          mb={2}
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center">
            <Typography
              variant="subtitle2"
              sx={{
                pr: 1
              }}
            >
              Search by:
            </Typography>
            <Button
              size="small"
              variant="outlined"
              ref={actionRef1}
              onClick={() => setOpenMenuPeriod(true)}
              endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
            >
              {searchBy.text}
            </Button>
            <Menu
              disableScrollLock
              anchorEl={actionRef1.current}
              onClose={() => setOpenMenuPeriod(false)}
              open={openPeriod}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              {searchTypes.map((type) => (
                <MenuItem
                  key={type.value}
                  onClick={() => {
                    setSearchBy(type);
                    setOpenMenuPeriod(false);
                  }}
                >
                  {type.text}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>

        <FormControl variant="outlined" fullWidth>
          <OutlinedInputWrapper
            type="text"
            placeholder="Search users here..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  size="small"
                  onClick={startSearch}
                  disabled={isSearching}
                >
                  Search
                </Button>
              </InputAdornment>
            }
            startAdornment={
              <InputAdornment position="start">
                <SearchTwoToneIcon />
              </InputAdornment>
            }
          />
        </FormControl>

        {isLoading ? <Skeleton variant="text" height={70} width={300} /> : null}

        {isFetched ? (
          contact?.data ? (
            <Stack direction="row" alignItems="center" mt={2} spacing={2}>
              <Avatar alt={contact?.data?.email} src={contact?.data?.img} />

              <p>{contact?.data?.email}</p>

              <Button onClick={handleSendSol}>
                <Send color="success" />
              </Button>
            </Stack>
          ) : (
            <p>No contact found! Please recheck details.</p>
          )
        ) : null}
      </Box>
    </>
  );
}

export default SendUserSol;
