import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';

const PasswordResetSchema = Yup.object().shape({
  password: Yup.string().required('La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir').required('Confirmar la contraseña es requerido'),
});

const ResetPasswordTokenPage = () => {
  const router = useRouter();
  const { token } = router.query;
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.post('http://localhost:3001/api/users/reset-password', {
        token,
        password: values.password
      });
      alert('Su contraseña ha sido restablecida con éxito.');
      router.push('/auth/login');
    } catch (error) {
      alert('Ha ocurrido un error al intentar restablecer su contraseña.');
    }
    setSubmitting(false);
  };

  return (
    <> <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      mt: 14
    }}
  >
    <img src="/schedule-logo.png" alt="Schedule Logo" style={{ maxWidth: '100px', maxHeight: '100%' }} />
  </Box>
      <Head>
        <title>Restablecer Contraseña | MasterMenu</title>
      </Head>
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
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={PasswordResetSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, touched, errors, isSubmitting }) => (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: '100%', maxWidth: 360 }}
            >
              <TextField
                fullWidth
                label="Nueva Contraseña"
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.password}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Confirmar Nueva Contraseña"
                name="confirmPassword"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.confirmPassword}
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                Restablecer Contraseña
              </Button>
            </Box>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default ResetPasswordTokenPage;
