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

  return (
    <Stack
      gap={5}
      style={{
        width: '250px',
        height: '300px',
        overflow: 'scroll'
      }}
    >
      {data?.data?.balances &&
        Object.keys(data?.data?.balances).map((coin) => {
          if (coin === 'ts') return null;

          return (
            <Stack alignItems="center" key={coin}>
              <Stack
                p={3}
                alignItems={'center'}
                justifyContent={'space-between'}
                gap={3}
                style={{
                  border: '1px solid gray',
                  borderRadius: '20px',
                  width: '200px',
                  height: '150px'
                }}
              >
                <Stack direction="row" alignItems="center" gap={2}>
                  <Avatar
                    src={`https://s3-symbol-logo.tradingview.com/crypto/XTVC${coin}.svg`}
                  />
                  <Stack alignItems="center">
                    <Typography fontWeight={900} fontSize={18}>
                      {coin}
                    </Typography>
                    <Typography fontWeight={900} fontSize={12} color="gray">
                      ${data?.data?.prices[coin].price}
                    </Typography>
                  </Stack>
                </Stack>
                <Typography fontWeight={900} fontSize={28}>
                  ${data?.data?.balances[coin]}
                </Typography>
              </Stack>
            </Stack>
          );
        })}
    </Stack>
  );
};

export default AccountBalances;
