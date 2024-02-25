import React, { useContext } from 'react';
import Head from 'next/head';
import { Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useAuth } from 'src/hooks/use-auth';
import DailyMenuSlider from 'src/sections/overview/daily-menu-slider'; // Asegúrate de ajustar la ruta de importación correctamente



const Page = () => {
  const { user } = useAuth();

  return (
    <>
      <Head>
        <title>Inicio | MasterMenu</title>
      </Head>
      <Typography
  variant="h6"
  component="h1"
  sx={{
    marginTop: '16px', // ajusta esto según necesites
    marginRight: 'auto', // esto empujará el texto hacia la derecha
    marginLeft: '16px', // ajusta esto según necesites
    textAlign: 'right' // alinea el texto a la derecha
  }}
>
  Bienvenido {user?.name}, este es tu menú de hoy:
</Typography>
      <DailyMenuSlider />
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Page;
