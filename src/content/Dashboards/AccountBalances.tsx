import { Avatar, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { useQuery } from 'react-query';

const AccountBalances = () => {
  const { data } = useQuery(['accountBalances'], async () =>
    axios.get('https://ledger.flitchcoin.com/account/balance', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
  );

  console.log({ data });

  return (
    <Stack alignItems="center">
      <Stack
        p={4}
        alignItems={'center'}
        justifyContent={'space-between'}
        gap={3}
        style={{
          border: '1px solid gray',
          borderRadius: '20px'
        }}
      >
        <Stack direction="row" alignItems="center" gap={2}>
          <Avatar src="https://s3-symbol-logo.tradingview.com/crypto/XTVCBTC.svg" />
          <Typography fontWeight={900} fontSize={18}>
            BTC
          </Typography>
        </Stack>
        <Typography fontWeight={900} fontSize={28}>
          $1343.24
        </Typography>
      </Stack>
    </Stack>
  );
};

export default AccountBalances;
