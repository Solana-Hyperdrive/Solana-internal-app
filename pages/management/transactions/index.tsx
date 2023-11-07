import Footer from '@/components/Footer';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import PageHeader from '@/content/Management/PageHeader';
import AllTransactionsTable from '@/content/Management/Transactions/AllTransactionsTable';
import SidebarLayout from '@/layouts/SidebarLayout';
import { Container, Grid } from '@mui/material';
import Head from 'next/head';

const TNX = () => {
  return (
    <>
      <Head>
        <title>All Transactions</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader title={'transactions'} />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <AllTransactionsTable key="tnx" />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

TNX.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default TNX;
