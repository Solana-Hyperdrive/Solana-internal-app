import useAlias from '@/hooks/useAlias';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { Avatar, Box, Grid, Stack, Typography } from '@mui/material';
import AddAlias from './AddAlias';

function AliasOverview() {
  const { data, isLoading } = useAlias();
  const { data: me, isLoading: isMeLoading } = useIsLoggedIn();

  if (isLoading || isMeLoading) {
    return <p>Loading</p>;
  }

  return (
    <>
      <Stack direction="column" gap={1}>
        <Avatar alt={me.data.name} src={me.data.img} />
        <Typography fontSize={20} fontWeight={800} letterSpacing={0.5}>
          My Alias
        </Typography>
      </Stack>
      <div style={{ marginBlock: '6px', paddingBlockEnd: '9px' }}>
        {data?.data?.map((alias) => (
          <div key={alias.uuid}>
            <Box>
              <Typography
                fontSize={16}
                style={{ color: 'hsl(240 5% 56.9%)' }}
                variant="subtitle2"
                noWrap
                gutterBottom
              >
                {alias.alias}
              </Typography>
              <Typography fontSize={16} variant="subtitle2" noWrap>
                {alias.sol_wallet}
              </Typography>
            </Box>
          </div>
        ))}
      </div>
      {/* {ticker} */}
      <AddAlias />
    </>
  );
}

export default AliasOverview;
