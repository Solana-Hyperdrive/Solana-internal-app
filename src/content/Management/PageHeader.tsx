import { Button, Grid, Typography } from '@mui/material';

import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import Link from 'next/link';

function PageHeader({ title }: { title: 'products' | 'transactions' }) {
  const { data: me, isLoading: isMeLoading } = useIsLoggedIn();

  const user = {
    name: me?.data?.name,
    avatar: me?.data?.img
  };

  if (isMeLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {title.toUpperCase()}
        </Typography>
        <Typography variant="subtitle2">
          {user.name}, these are all your {title}
        </Typography>
      </Grid>
      {title === 'products' ? (
        <Grid item>
          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            <Link href="/management/profile">Create product</Link>
          </Button>
        </Grid>
      ) : null}
    </Grid>
  );
}

export default PageHeader;
