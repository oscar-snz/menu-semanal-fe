import React, { useContext } from 'react';
import Head from 'next/head';
import { Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import DailyMenuSlider from 'src/sections/overview/daily-menu-slider'; // Asegúrate de ajustar la ruta de importación correctamente
import { useRouter } from 'next/router';
import useSubscriptionCheck from 'src/hooks/useSubscriptionCheck'; 


const MenuVisualizerPage = () => {
  useSubscriptionCheck();
  const router = useRouter();
  const { date } = router.query;

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
</Typography>
      <DailyMenuSlider selectedDate={date}/>
    </>
  );
};

MenuVisualizerPage.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default MenuVisualizerPage;
