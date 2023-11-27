import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  styled
} from '@mui/material';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import Link from 'src/components/Link';
import BaseLayout from 'src/layouts/BaseLayout';

const OverviewWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
`
);

export async function getServerSideProps({ query: { code } }) {
  if (!code) return { props: {} };

  try {
    const response = await axios.get(
      `https://ledger.flitchcoin.com/user?code=${code}`
    );

    return {
      props: {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token
      }
    };
  } catch (error) {
    console.log(error);
    return { props: {} };
  }
}

function Overview({
  accessToken,
  refreshToken
}: {
  accessToken: string | undefined;
  refreshToken: string | undefined;
}) {
  const router = useRouter();

  useEffect(() => {
    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }

    if (!accessToken && !refreshToken) {
      router.push('https://ledger.flitchcoin.com/login');
    }
  }, []);

  useIsLoggedIn('dashboard');

  return (
    <OverviewWrapper>
      <Head>
        <title>FlitchPay</title>
      </Head>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh'
        }}
      >
        <CircularProgress size={200} />
      </Box>

      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Typography textAlign="center" variant="subtitle1">
          Crafted by{' '}
          <Link
            href="https://flitchcoin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Team FlitchCoin
          </Link>
        </Typography>
      </Container>
    </OverviewWrapper>
  );
}

export default Overview;

Overview.getLayout = function getLayout(page: ReactElement) {
  return <BaseLayout>{page}</BaseLayout>;
};
