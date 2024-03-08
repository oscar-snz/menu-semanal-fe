import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Typography } from '@mui/material';
import CardForm from 'src/components/CardForm'

const PaymentPage = () => {
  
  return (
    <>
      <Head>
        <title>Inicio | MasterMenu</title>
      </Head>
      <Typography
  variant="h6"
  component="h1"
  sx={{
    marginTop: '16px', 
    marginRight: 'auto', 
    marginLeft: '16px', 
    textAlign: 'right' 
  }}
>
 </Typography>
      <CardForm />
    </>
  );
};


export default PaymentPage;
