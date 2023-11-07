import useAlias from '@/hooks/useAlias';
import { Box, Grid, Stack, Typography } from '@mui/material';
import AddAlias from './AddAlias';

function AliasOverview({ ticker }: { ticker: React.ReactNode }) {
  const { data, isLoading } = useAlias();

  if (isLoading) {
    return <p>Loading</p>;
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Stack direction="row" justifyContent="space-between">
            <Box>
              {data?.data?.map((alias) => (
                <Box key={alias.uuid}>
                  <Box display="flex" alignItems="center" pb={3}>
                    <Box
                      sx={{
                        ml: 1.5
                      }}
                    >
                      <Typography variant="h4" noWrap gutterBottom>
                        {alias.alias}
                      </Typography>
                      <Typography variant="subtitle2" noWrap>
                        {alias.sol_wallet}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            {ticker}
          </Stack>
          <AddAlias />
        </Grid>
      </Grid>
    </>
  );
}

export default AliasOverview;
