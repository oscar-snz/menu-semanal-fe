// pages/stock.js
import React from 'react';
import Head from 'next/head';
import { Box, Container, Typography, Button } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import InventoryList from 'src/sections/inventory/inventoryList';
import AddInventoryItem from 'src/sections/inventory/addInventoryItem';
import useSubscriptionCheck from 'src/hooks/useSubscriptionCheck'; 

const StockPage = () => {
  useSubscriptionCheck();
  return (
    <>
      <Head>
        <title>Inventario | MasterMenu</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 3 }}>
            Inventario
          </Typography>
          <InventoryList />
        </Container>
      </Box>
    </>
  );
};

StockPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default StockPage;
