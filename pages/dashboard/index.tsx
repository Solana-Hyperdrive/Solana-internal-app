import Footer from '@/components/Footer';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import AccountBalances from '@/content/Dashboards/AccountBalances';
import AliasOverview from '@/content/Dashboards/AliasOverview';
import PageHeader from '@/content/Dashboards/PageHeader';
import SearchUser from '@/content/Dashboards/SearchUser';
import SidebarLayout from '@/layouts/SidebarLayout';
import {
  Box,
  Card,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
  styled
} from '@mui/material';
import Head from 'next/head';
import { ChangeEvent, useState } from 'react';

const TabsContainerWrapper = styled(Box)(
  ({ theme }) => `
      padding: 0 ${theme.spacing(2)};
      position: relative;
      bottom: -1px;

      .MuiTabs-root {
        height: 44px;
        min-height: 44px;
      }

      .MuiTabs-scrollableX {
        overflow-x: auto !important;
      }

      .MuiTabs-indicator {
          min-height: 4px;
          height: 4px;
          box-shadow: none;
          bottom: -4px;
          background: none;
          border: 0;

          &:after {
            position: absolute;
            left: 50%;
            width: 28px;
            content: ' ';
            margin-left: -14px;
            background: ${theme.colors.primary.main};
            border-radius: inherit;
            height: 100%;
          }
      }

      .MuiTab-root {
          &.MuiButtonBase-root {
              height: 44px;
              min-height: 44px;
              background: ${theme.colors.alpha.white[50]};
              border: 1px solid ${theme.colors.alpha.black[10]};
              border-bottom: 0;
              position: relative;
              margin-right: ${theme.spacing(1)};
              font-size: ${theme.typography.pxToRem(14)};
              color: ${theme.colors.alpha.black[80]};
              border-bottom-left-radius: 0;
              border-bottom-right-radius: 0;

              .MuiTouchRipple-root {
                opacity: .1;
              }

              &:after {
                position: absolute;
                left: 0;
                right: 0;
                width: 100%;
                bottom: 0;
                height: 1px;
                content: '';
                background: ${theme.colors.alpha.black[10]};
              }

              &:hover {
                color: ${theme.colors.alpha.black[100]};
              }
          }

          &.Mui-selected {
              color: ${theme.colors.alpha.black[100]};
              background: ${theme.colors.alpha.white[100]};
              border-bottom-color: ${theme.colors.alpha.white[100]};

              &:after {
                height: 0;
              }
          }
      }
  `
);

function DashboardTasks() {
  const [currentTab, setCurrentTab] = useState<string>('alias');

  const tabs = [
    { value: 'alias', label: 'Alias' },
    { value: 'search', label: 'Search User' }
  ];

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  return (
    <>
      <Head>
        <title>Tasks Dashboard</title>
      </Head>

      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="md">
        <TabsContainerWrapper>
          <Tabs
            onChange={handleTabsChange}
            value={currentTab}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
          >
            {tabs.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>
        </TabsContainerWrapper>
        <Card variant="outlined">
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={4}
          >
            {currentTab === 'alias' && (
              <Grid item xs={12}>
                <Stack direction="row" p={4} justifyContent="space-between">
                  <Box alignItems="center" justifyContent="center" ml={3}>
                    <AliasOverview />
                  </Box>
                  <AccountBalances />
                </Stack>
              </Grid>
            )}
            {currentTab === 'search' && (
              <Grid item xs={12}>
                <Box p={4}>
                  <SearchUser />
                </Box>
              </Grid>
            )}
          </Grid>
        </Card>
      </Container>

      <Footer />
    </>
  );
}

DashboardTasks.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default DashboardTasks;
