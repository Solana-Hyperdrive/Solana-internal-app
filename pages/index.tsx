import {
  Typography,
  Box,
  Card,
  Container,
  Button,
  styled
} from '@mui/material';
import type { ReactElement } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';

import Link from 'src/components/Link';
import Head from 'next/head';

import Logo from 'src/components/LogoSign';
import Hero from 'src/content/Overview/Hero';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Connectivity } from '@/web3/connectivity';
import { useAnchorWallet } from '@solana/wallet-adapter-react';

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

function Overview() {
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
                <Button
                  component={Link}
                  href="/dashboards/tasks"
                  variant="contained"
                  sx={{ ml: 2 }}
                >
                  Live Preview
                </Button>
              </Box>
              <Box>
                <WalletMultiButton />
                <button onClick={() => console.log(wallet?.publicKey?.toBase58())}>WalletId</button>
                <button onClick={() => connectivity.getTokenListInfo()}>TokenList</button>
                <button onClick={() => connectivity.getAllUserTokens()}>UserTokens</button>
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
