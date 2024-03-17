import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Snackbar, Alert, } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import React, { useState } from 'react'


import {
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';

const Page = () => {
  const [loginFailed, setLoginFailure] = useState(false);

  const router = useRouter();
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required')
    }),
    onSubmit: async (values) => {
      try {
        await auth.signIn(values.email, values.password);
        router.push('/');
      } catch (err) {
        setLoginFailure(true);
        const errorMessage = err.response?.data?.message || 'El correo electronico o contraseña son incorrectos';
        setSubmitting(false);
        setErrors({ submit: errorMessage });
        setOpenSnackbar(true);
      }
    }
  });



  return (
    <>
      <Head>
        <title>
          Login | MasterMenu
        </title>
      </Head>
      <Snackbar open={loginFailed} autoHideDuration={6000} onClose={() => setLoginFailure(false)}>
        <Alert onClose={() => setLoginFailure(false)} severity="error">
          Inicio de sesión fallido. Por favor, verifica tus credenciales.
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
          backgroundColor: 'background.paper',
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{
                mb: 3,
                alignItems: 'center'
              }}
            >
  <Typography variant="h4" sx={{ mt: 4, mb: 4 }}> 
                Inicio de Sesion
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                ¿No tienes una cuenta?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/register"
                  underline="hover"
                  variant="subtitle2"
                >
                  Registro
                </Link>
              </Typography>
            </Stack>

            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Email Address"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="email"
                  value={formik.values.email}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Continue
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;
