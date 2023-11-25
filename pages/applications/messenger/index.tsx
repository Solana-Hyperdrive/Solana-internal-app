import SidebarContent from '@/content/Applications/Messenger/SidebarContent';
import SidebarLayout from '@/layouts/SidebarLayout';
import { Box, styled } from '@mui/material';
import Head from 'next/head';

const RootWrapper = styled(Box)(
  ({ theme }) => `
       height: calc(100vh - ${theme.header.height});
       display: flex;
`
);

const Sidebar = styled(Box)(
  ({ theme }) => `
        width: 100%;
        background: ${theme.colors.alpha.white[100]};
        border-right: ${theme.colors.alpha.black[10]} solid 1px;
`
);

function ApplicationsMessenger() {
  return (
    <>
      <Head>
        <title>Messenger - Applications</title>
      </Head>
      <RootWrapper className="Mui-FixedWrapper">
        <Sidebar>
          <SidebarContent />
        </Sidebar>
      </RootWrapper>
    </>
  );
}

ApplicationsMessenger.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ApplicationsMessenger;
