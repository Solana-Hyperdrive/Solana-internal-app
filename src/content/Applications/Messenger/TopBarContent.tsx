import { Avatar, Box, Skeleton, Typography, styled } from '@mui/material';

const RootWrapper = styled(Box)(
  ({ theme }) => `
        @media (min-width: ${theme.breakpoints.values.md}px) {
          display: flex;
          gap: ${theme.spacing(2)};
          align-items: center;
          justify-content: space-between;
      }
`
);

function TopBarContent({ recUser }) {
  return (
    <>
      <RootWrapper>
        <Box display="flex" alignItems="center">
          {recUser?.name ? (
            <Avatar
              variant="rounded"
              sx={{
                width: 48,
                height: 48
              }}
              alt={recUser?.name}
              src={recUser?.img}
            />
          ) : (
            <Skeleton width={48} height={48} variant="rectangular" />
          )}

          <Box ml={1}>
            <Typography variant="h4">
              {recUser?.name || recUser?.email ? (
                recUser?.name || recUser?.email
              ) : (
                <Skeleton width={148} height={28} variant="rectangular" />
              )}
            </Typography>
          </Box>
        </Box>
      </RootWrapper>
    </>
  );
}

export default TopBarContent;
