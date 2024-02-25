import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';
import { DietAndHealth } from 'src/sections/settings/diet-and-health';
import { SettingsPassword } from 'src/sections/settings/settings-password';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

const Page = () => (
  <>
    <Head>
      <title>
        Ajustes | MasterMenu
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Typography variant="h4">
            Ajustes
          </Typography>
          <Typography variant = "h5" >
          Dieta y restricciones alimenticias
          </Typography>
          <DietAndHealth />
          <SettingsPassword />
        </Stack>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
