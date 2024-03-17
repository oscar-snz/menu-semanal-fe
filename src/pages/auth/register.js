import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, Snackbar, Alert, Typography, Box, Stack, Link } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import React, { useState } from 'react'

const Page = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      submit: null
    },
    validationSchema: Yup.object({
      name: Yup
        .string()
        .max(50, 'El nombre no puede exeder los 50 caracteres')
        .required('El nombre es requerido'),
      email: Yup
        .string()
        .email('Debe ser un correo válido')
        .max(255)
        .required('El correo es requerido'),
      password: Yup
        .string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(255)
        .required('La contraseña es requerida'),
      confirmPassword: Yup
        .string()
        .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
        .required('La confirmación de contraseña es requerida'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await signUp(values.name, values.email, values.password);
        setRegistrationSuccess(true); // Simula un registro exitoso
        setOpenSnackbar(true); // Muestra el Snackbar
        setSnackbarMessage('Registro exitoso. Redirigiendo...'); // Mensaje de éxito
        setTimeout(() => router.push('/'), 3000); // Redirige después de 3 segundos
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Error al registrar el usuario.';
        setSubmitting(false);
        setErrors({ submit: errorMessage });
        setSnackbarMessage(errorMessage);
        setOpenSnackbar(true);
      }
    }
  });

  return (
    <>
      <Head>
        <title>
          Register | MasterMenu
        </title>
      </Head>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={registrationSuccess ? "success" : "error"} sx={{ width: '100%' }}>
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
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Register
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                ¿Ya tienes una cuenta?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Iniciar Sesion
                </Link>
              </Typography>
            </Stack>

            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Nombre"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Correo Electronico"
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
                  label="Contraseña"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                  autoComplete='current-password'
                />
                <TextField
                  error={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                  fullWidth
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  label="Confirmar contraseña"
                  name="confirmPassword"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.confirmPassword}
                  autoComplete="new-password"
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
                disabled={!formik.isValid || formik.isSubmitting}
              >
                Registrar
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
