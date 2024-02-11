import React, { useCallback, useState } from 'react';
import { useAuth } from 'src/hooks/use-auth'; 

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';

const countries = [
  {
    value: 'honduras',
    label: 'Honduras'
  },
  {
    value: 'estados unidos',
    label: 'USA'
  },
  {
    value: 'mexico',
    label: 'Mexico'
  },
  {
    value: 'el salvador',
    label: 'El Salvador'
  }
];

export const AccountProfileDetails = () => {
  const { user } = useAuth(); // Extrae el usuario del contexto de autenticación

  const [values, setValues] = useState({
    name: user?.name,
    email: user?.email,
    phone: user?.phone || '',
    country: user?.country || ''
  });

  const handleChange = useCallback(
    (event) => {
      setValues((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          subheader="La informacion puede ser editada"
          title="Profile"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  helperText="Por favor indique su nombre."
                  label="Name"
                  name="name"
                  onChange={handleChange}
                  required
                  value={values.name}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
               <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                 value={values.email}
                 
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Seleccione Pais"
                  name="country"
                  onChange={handleChange}
                  required
                  select
                  SelectProps={{ native: true }}
                  value={values.country}
                  InputLabelProps={{
                    shrink: true
                  }}
                >
                  {countries.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Numero de telefono"
                  name="phone"
                  onChange={handleChange}
                  type="number"
                  value={values.phone}
                />
              </Grid>
                            
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
