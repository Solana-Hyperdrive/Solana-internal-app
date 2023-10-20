import { ReactElement, useEffect } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';

import Head from 'next/head';
import Link from 'src/components/Link';

import Logo from 'src/components/LogoSign';
import Hero from 'src/content/Overview/Hero';

import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { Box, Card, Container, Typography, styled } from '@mui/material';
import axios from 'axios';

import { Connectivity } from '@/web3/connectivity';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  height: ${theme.spacing(10)};
  margin-bottom: ${theme.spacing(10)};
`
);

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
  useIsLoggedIn('dashboards/tasks');

  useEffect(() => {
    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }, []);

  // for testing
  const wallet = useAnchorWallet();
  const connectivity = new Connectivity(wallet);

  return (
    <OverviewWrapper>
      <Head>
        <title>Tokyo Free Black NextJS Typescript Admin Dashboard</title>
      </Head>
      <HeaderWrapper>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center">
            <Logo />
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flex={1}
            >
              <Box />
              <Box>
                {/*<Button*/}
                {/*  component={Link}*/}
                {/*  // href="https://test-ledger.flitchcoin.com/login"*/}
                {/*  variant="contained"*/}
                {/*  sx={{ ml: 2 }}*/}
                {/*>*/}
                {/*  Sign In*/}
                {/*</Button>*/}
              </Box>
              <Box>
                <WalletMultiButton />
                <button
                  onClick={() => console.log(wallet?.publicKey?.toBase58())}
                >
                  WalletId
                </button>
                <button onClick={() => connectivity.getTokenListInfo()}>
                  TokenList
                </button>
                <button onClick={() => connectivity.getAllUserTokens()}>
                  UserTokens
                </button>
              </Box>
            </Box>
          </Box>
        </Container>
      </HeaderWrapper>
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
