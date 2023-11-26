import useAlias from '@/hooks/useAlias';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { Avatar, Box, Skeleton, Stack, Typography } from '@mui/material';
import AddAlias from './AddAlias';

function AliasOverview() {
  const { data: alaises, isLoading: isAliasesLoading } = useAlias();
  const { data: me, isLoading: isMeLoading } = useIsLoggedIn();

  return (
    <>
      <Stack direction="row" gap={2} alignItems="center">
        {isMeLoading ? (
          <Skeleton variant="circular">
            <Avatar />
          </Skeleton>
        ) : (
          <Avatar alt={me?.data?.name} src={me?.data?.img} />
        )}
        <Typography fontSize={22} letterSpacing={0.5} variant="h2">
          ALIAS
        </Typography>
      </Stack>
      <div style={{ marginBlock: '6px', paddingBlockEnd: '9px' }}>
        {isAliasesLoading ? (
          <Skeleton variant="rectangular" width={150} height={50} />
        ) : null}

        <Stack mt={2} gap={1}>
          {alaises?.data?.map((alias) => (
            <Box key={alias.uuid}>
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
          ))}
        </Stack>
      </div>
      {/* {ticker} */}
      <AddAlias />
    </>
  );
}

export default AliasOverview;
