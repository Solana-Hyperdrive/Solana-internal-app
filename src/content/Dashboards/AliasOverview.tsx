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
        <Typography fontSize={24}>My Alias</Typography>
      </Stack>

      <Grid container spacing={0}>
        <Grid item>
          <Stack direction="row" justifyContent="space-between">
            <Box>
              <ul>
                {data?.data?.map((alias) => (
                  <li key={alias.uuid}>
                    <Box>
                      <Box display="flex" alignItems="center" pb={3}>
                        <Box>
                          <Typography variant="h4" noWrap gutterBottom>
                            {alias.alias}
                          </Typography>
                          <Typography variant="subtitle2" noWrap>
                            {alias.sol_wallet}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </li>
                ))}
              </ul>
            </Box>

            {/* {ticker} */}
          </Stack>
          <AddAlias />
        </Grid>
      </Grid>
    </>
  );
}

export default AliasOverview;
