import Footer from '@/components/Footer';
import SidebarLayout from '@/layouts/SidebarLayout';
import Head from 'next/head';

import { Container, Grid } from '@mui/material';

import AddProduct from '@/content/Management/Users/details/AddProduct';

function ManagementUserProfile() {
  return (
    <>
      <Head>
        <title>Create a Product</title>
      </Head>
      <Container sx={{ mt: 3 }} maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12} md={8}>
            <AddProduct />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

ManagementUserProfile.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ManagementUserProfile;
