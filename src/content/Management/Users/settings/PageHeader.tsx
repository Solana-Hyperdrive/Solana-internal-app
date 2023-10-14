import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { Typography } from '@mui/material';

function PageHeader() {
  const { data, isLoading } = useIsLoggedIn();

  const user = {
    name: data?.data?.name
  };

  if (isLoading) {
    return 'Loading';
  }

  return (
    <>
      <Typography variant="h3" component="h3" gutterBottom>
        User Settings
      </Typography>
      <Typography variant="subtitle2">
        {user.name}, this could be your user settings panel.
      </Typography>
    </>
  );
}

export default PageHeader;
