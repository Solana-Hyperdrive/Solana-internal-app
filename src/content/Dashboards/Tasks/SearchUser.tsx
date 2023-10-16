import Modal from '@/components/Modal';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { Add } from '@mui/icons-material';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  Menu,
  MenuItem,
  OutlinedInput,
  TextField,
  Typography,
  styled
} from '@mui/material';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useQuery } from 'react-query';

const OutlinedInputWrapper = styled(OutlinedInput)(
  ({ theme }) => `
    background-color: ${theme.colors.alpha.white[100]};
    padding-right: ${theme.spacing(0.7)}
`
);

function SearchUser() {
  const searchTypes = [
    {
      value: 'exact',
      text: 'Exact match'
    },
    {
      value: 'relevant',
      text: 'Most relevant'
    }
  ];

  const actionRef1 = useRef<any>(null);
  const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false);
  const [period, setPeriod] = useState<string>(searchTypes[0].text);

  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [name, setName] = useState('');

  const { data: user } = useIsLoggedIn();
  const { data, isLoading } = useQuery(
    ['user', searchText],
    async () => {
      const response = await axios.post(
        `https://ledger.flitchcoin.com/api/strict/search
`,
        {
          data: {
            email: searchText,
            alias: searchText,
            label: searchText,
            sol_wallet: searchText
          }
        }
      );

      setIsSearching(false);

      return response;
    },
    { enabled: isSearching && !!searchText }
  );

  function handleSearch() {
    setIsSearching(true);
  }

  async function handleAddContact(contact) {
    if (!name) return;

    await axios.post(
      'https://ledger.flitchcoin.com/contact',
      {
        my_uid: user.data.uid,
        uid: contact.uid[0],
        email: contact.email,
        name
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );

    setName('');
  }

  return (
    <>
      <FormControl variant="outlined" fullWidth>
        <OutlinedInputWrapper
          type="text"
          placeholder="Search terms here..."
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
            {period}
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
            {searchTypes.map((_period) => (
              <MenuItem
                key={_period.value}
                onClick={() => {
                  setPeriod(_period.text);
                  setOpenMenuPeriod(false);
                }}
              >
                {_period.text}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      {isLoading ? <Typography variant="body2">Loading...</Typography> : null}
      {data ? (
        <Box>
          {data.data.email}
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
        </Box>
      ) : null}
    </>
  );
}

export default SearchUser;
