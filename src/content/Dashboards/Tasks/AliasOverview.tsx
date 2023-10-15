import useAlias from '@/hooks/useAlias';
import { Box, Grid, Typography } from '@mui/material';
import AddAlias from '@/content/Dashboards/AddAlias';

function AliasOverview() {
  const { data, isLoading, isFetching } = useAlias();

  console.log({ data, isLoading, isFetching });

  if (isLoading && !data) {
    return <p>Loading</p>;
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        {data.data.map((alias) => (
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
        <AddAlias />
      </Grid>
    </Grid>
  );
}

export default AliasOverview;
