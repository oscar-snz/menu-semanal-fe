import React, { useContext } from 'react';
import Head from 'next/head';
import { Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useAuth } from 'src/hooks/use-auth';

const Page = () => {
  const { user } = useAuth();

  return (
    <>
      <Head>
        <title>Inicio | MasterMenu</title>
      </Head>
      <Typography variant="h4" component="h1" gutterBottom>
        Bienvenido {user?.name}, este es tu menú de hoy:
      </Typography>
      {/* Contenido de la página aquí */}
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Page;
