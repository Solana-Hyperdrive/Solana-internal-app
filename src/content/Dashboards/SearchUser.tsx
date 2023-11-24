import Modal from '@/components/Modal';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { Add } from '@mui/icons-material';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import {
  Avatar,
  Box,
  Button,
  FormControl,
  InputAdornment,
  Menu,
  MenuItem,
  OutlinedInput,
  Skeleton,
  Stack,
  TextField,
  Typography,
  styled
} from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
    padding-right: ${theme.spacing(0.7)}
`
);

function SearchUser() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchTypes = [
    {
      value: 'email',
      text: 'Email ID'
    },
    {
      value: 'alias',
      text: 'Alias'
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
  const [name, setName] = useState('');

  const { data: user } = useIsLoggedIn();
  const { data, isLoading, isFetched } = useQuery(
    ['user', searchText],
    async () => {
      const response = await axios.post(
        `https://ledger.flitchcoin.com/api/strict/search
`,
        {
          [searchBy.value]: searchText
        }
      );

      setIsSearching(false);

      queryClient.invalidateQueries({ queryKey: ['recUser'] });

      return response;
    },
    { enabled: isSearching && !!searchText }
  );

  function handleSearch() {
    setIsSearching(true);
  }

  async function handleAddContact(contact) {
    if (!name) return;

    try {
      const response = await axios.post(
        'https://ledger.flitchcoin.com/contact',
        {
          my_uid: user.data.uid,
          uid: contact.uid,
          email: contact.email,
          name
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      console.log({ response });
      let route: string;
      if (response.status === 208) route = response.data?.detail?.uid;
      else route = response.data?.uid;
      router.push(`/applications/messenger/${route}`);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <FormControl variant="outlined" fullWidth>
        <OutlinedInputWrapper
          type="text"
          placeholder="Search users here..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <Button variant="contained" size="small" onClick={handleSearch}>
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
      <Box
        py={3}
        display="flex"
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
      {isLoading ? <Skeleton variant="text" height={70} width={300} /> : null}
      {isFetched ? (
        data?.data ? (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={data?.data?.email} src={data?.data?.img} />

            <p>{data?.data?.email}</p>

            <Modal
              buttonText={<Add color="success" />}
              modalHeader={'Name of contact'}
              dialogContentHeader={'Please add the name of the contact.'}
              dialogContent={
                <TextField
                  autoFocus
                  margin="dense"
                  label="Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              }
              handleAction={() => handleAddContact(data?.data)}
            />
          </Stack>
        ) : (
          <p>No contact found! Please recheck details.</p>
        )
      ) : null}
    </>
  );
}

export default SearchUser;
