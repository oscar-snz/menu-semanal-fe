import React, { useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  Box,
  Button,
  Link,
  TextField,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Correo inválido').required('Correo requerido'),
});

const ResetPasswordPage = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const router = useRouter();

  const handleSubmit = async (values) => {
    try {
      await axios.post('http://localhost:3001/api/users/request-reset-password', { email: values.email });
      setSnackbarMessage('Si tu correo está registrado, recibirás un enlace para restablecer tu contraseña.');
      setSnackbarSeverity('success');
    } catch (error) {
      setSnackbarMessage('Error al enviar el correo. Por favor, inténtalo de nuevo.');
      setSnackbarSeverity('error');
    }
    setOpenSnackbar(true);
  };

  return (
    <>
      <Head>
        <title>Restablecer contraseña | MasterMenu</title>
      </Head>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 14
        }}
      >
        <img src="/schedule-logo.png" alt="Schedule Logo" style={{ maxWidth: '100px', maxHeight: '100%' }} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8
        }}
      >
        <Typography variant="h4" sx={{ mb: 4 }}>
          Restablecer Contraseña
        </Typography>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={ResetPasswordSchema}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: '100%', maxWidth: 360 }}
            >
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                type="email"
                value={values.email}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Enviar
              </Button>
              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Link component={NextLink} href="/auth/login" variant="body2">
                  Volver al inicio de sesión
                </Link>
              </Box>
            </Box>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default ResetPasswordPage;
