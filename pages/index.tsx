import { ReactElement, useEffect } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';

import Head from 'next/head';
import Link from 'src/components/Link';

import Hero from 'src/content/Overview/Hero';

import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { Box, Container, Typography, styled } from '@mui/material';
import axios from 'axios';

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
  useIsLoggedIn('dashboard');

  useEffect(() => {
    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }, []);

  return (
    <OverviewWrapper>
      <Head>
        <title>FlitchPay</title>
      </Head>

      <Hero />
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
