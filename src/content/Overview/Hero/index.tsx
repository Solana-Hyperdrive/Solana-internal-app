import { CircularProgress, Stack } from '@mui/material';

function Hero() {
  return (
    <Stack sx={{ height: '80vh' }} alignItems="center" justifyContent="center">
      <CircularProgress size={200} />
    </Stack>
  );
}

export default Hero;
