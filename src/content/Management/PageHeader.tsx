import { Button, Grid, Skeleton, Stack, Typography } from '@mui/material';

import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import Link from 'next/link';

function PageHeader({ title }: { title: 'products' | 'transactions' }) {
  const { data: me, isLoading: isMeLoading } = useIsLoggedIn();

  const user = {
    name: me?.data?.name,
    avatar: me?.data?.img
  };

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {title.toUpperCase()}
        </Typography>
        <Typography variant="subtitle2">
          <Stack direction="row">
            {isMeLoading ? (
              <Skeleton variant="text" width={100} height={25} />
            ) : (
              user.name
            )}
            , these are all your {title}
          </Stack>
        </Typography>
      </Grid>
      {title === 'products' ? (
        <Grid item>
          <Link href="/management/product" passHref>
            <Button
              sx={{ mt: { xs: 2, md: 0 } }}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
              component="a"
            >
              Create product
            </Button>
          </Link>
        </Grid>
      ) : null}
    </Grid>
  );
}

export default PageHeader;
