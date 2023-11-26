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
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery, useQueryClient } from 'react-query';

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
    padding-right: ${theme.spacing(0.7)}
`
);

function SendUserSol({ handleCloseDialog }: { handleCloseDialog: () => void }) {
  const router = useRouter();
  const queryClient = useQueryClient();
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
  const [amount, setAmount] = useState(0);

  const { data: user } = useIsLoggedIn();
  const {
    data: contact,
    isLoading,
    isFetched
  } = useQuery(
    ['sendUser', searchText],
    async () => {
      const response = await axios.post(
        `https://ledger.flitchcoin.com/api/strict/search
`,
        {
          [searchBy.value]: searchText
        }
      );

      queryClient.invalidateQueries({ queryKey: ['recUser'] });

      return response;
    },
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

  async function handleSendSol() {
    if (!user || !contact) return;

    if (!amount) {
      toast.error('Please enter amount to send');
      return;
    }

    try {
      const response = await axios.post(
        'https://ledger.flitchcoin.com/contact',
        {
          my_uid: user.data.uid,
          uid: contact.data.uid,
          email: contact.data.email
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      let route: string;
      if (response.status === 208) route = response.data?.detail?.uid;
      else route = response.data?.uid;
      router.push(`/applications/messenger/${route}`);
    } catch (e) {
      console.log(e);
    }
  }

  return (
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

        <TextField label="Amount" inputMode="numeric" />
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
            {searchTypes.map((period) => (
              <MenuItem
                key={period.value}
                onClick={() => {
                  setSearchBy(period);
                  setOpenMenuPeriod(false);
                }}
              >
                {period.text}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      <FormControl variant="outlined" fullWidth>
        <OutlinedInputWrapper
          type="text"
          autoFocus
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
  );
}

export default SendUserSol;
