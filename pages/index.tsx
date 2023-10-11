import { ReactElement, useEffect } from 'react';
import BaseLayout from 'src/layouts/BaseLayout';

import Link from 'src/components/Link';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Logo from 'src/components/LogoSign';
import Hero from 'src/content/Overview/Hero';
import axios from 'axios';
import { Box, Card, Container, Typography, styled } from '@mui/material';

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
  const router = useRouter();

  // to run on all renders
  useEffect(() => {
    const query = router.query;

    if (query.code) {
      console.log({ code: query.code });
      signIn();
    }
  });

  async function signIn() {
    const code =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiXCJnQUFBQUFCbEpoMEwzWVUtTDAydk5NRHlIUFV1dHV2bUJXcGFPanBGcllQZFlQSVhuY2RuX0pIUVEzNmNCQVMwMWc0UnBhNGhfNHdIMTF5dEJlMDMyVmVuU0JkUTBjWEJkTDV5TzZnbktoWXprNXdxeThWbmJlbVJGTTFpeVhPRmlIbTBzLXFsQnpZY05aQWREQWVlSGh3NGQ5TWFqSEVyaFlpRUh6dUltMXhtNUhKUlZTRGFrY3hEaGV5SHlQT2M1dHFVSGk0OVZTLTVlU1NhUzlIMnZFN2lUQzQ0d2NUQmxUR3lsREtZclNNRDNrYk1rQ1d5WmNCU0dpZkh4Vlp0WjRiM2hDM0xJaGRWakw2RllsZ2NZOXEtQXBBSHVBNmVTcTgtOWVqWU5RdkVDeUQzeEdZX2NzdGZEeFFETmVXTUhhWExSVXpfNDBqNkVKZXdGZmgxSmc4SmxMd0FiT0ctR2tyVXNQSHdrWlpqQ01ncGxIWGwwUVI2VFFIU1ktblRFRFZJT3N1V1A5aHhjYmVyTl9mU3dJaWhEM2owUy1mc281ZHcyODQ4amJCN1pTazZvdk5ULXVFSS13SHpsUnNGamRwNEc0Ty1tdDZteTFDN0ZHT0pNR0dwS0xwWFVnT2xLSnRKcXE2ODJZcVhyc2ZYeFlOWlVmeUVTRy1WRjRoTjJVcGdTakFJMzVtcFhJZUFrSkE4anB1MGh5Wk5Oem5PZnZWc1RrenFZTkN2SkZXeEVKN1ozaVUtMm5RWHZ1RDVoWkl5UEE0cTl4QmY3Yy1NUXBPdUtUYk5qejdkenN4NkVsTTBsWXZCenlLZ25YYjRySkU5MC1MZF9hTlM2Tndhc2tCNVE3alhjLUM5RHp6ZEdmUDBjNG90UXp3Rk9ETHNza2xGM3lmSWdtQllrb192UWRmMmdaNFpNcVYtQTNYSU5vSkdqV2UxN2NORFVmbWQ2UG5KUUtfVVVMSTFOdW5hT05tZkdyN0VLTEY0am5fRDFTQklHWDA9XCIifQ.Jrki_8ANo9mjO_MhJ6RLn0C73yumxfQrvxQxBMrrX1Y';

    try {
      const response = await axios.get(
        `https://ledger.flitchcoin.com/user?code=${code}`
      );
      const data = response.data;

      console.log(data);

      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
    } catch (error) {
      console.log(error);
    }
  }

  async function isUser() {
    try {
      await axios.get(`https://ledger.flitchcoin.com/user/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
    } catch (e) {
      console.log('unauth user');
    }
  }

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
                {/*  onCl*/}
                {/*  variant="contained"*/}
                {/*  sx={{ ml: 2 }}*/}
                {/*>*/}
                {/*  Sign In*/}
                {/*</Button>*/}
                <button onClick={isUser}>Sign In</button>
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
