import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, List, ListItem, ListItemText, ListItemIcon, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'next/router';

const SubscriptionLandingPage = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isSubscribed: false,
    hasUsedTrial: false,
    trialEndDate: null,
    subscriptionEndDate: null
  });
  const { token } = useAuth();
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const router = useRouter();

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users/user-data', config);
        setSubscriptionStatus(response.data);
      } catch (error) {
        console.error('Error fetching subscription status:', error);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  const handleSubscriptionSubmit = async () => {
    router.push("/payment")
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: 4, mt: 8 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
      ¡Bienvenido a MasterMenu Premium!
      </Typography>
      {subscriptionStatus.hasUsedTrial ? (
        <>
          <Typography paragraph textAlign="center">
            Para continuar usando nuestros servicios y disfrutar de todas nuestras características premium, se requiere una suscripción.
          </Typography>
          <Box display="flex" justifyContent="center">
            <Button variant="contained" color="primary" onClick={handleSubscriptionSubmit}>
              Suscribirse Ahora
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography paragraph textAlign="center">
            Con MasterMenu Premium, obtendrás acceso completo a:
          </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutlineIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Recetas exclusivas" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutlineIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Planificación de comidas semanales para ti y tu familia" />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <CheckCircleOutlineIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="No compres de más! Nuestra lista de compras se crea de acuerdo a tu inventario existente." />
        </ListItem>
      </List>
      <Typography paragraph textAlign="center">
            ¡Disfruta de 30 días de prueba gratuita ingresando tu tarjeta de crédito!
          </Typography>
          <Box display="flex" justifyContent="center">
            <Button variant="contained" color="primary" onClick={handleSubscriptionSubmit}>
              Comenzar Prueba Gratis
            </Button>
          </Box>
          </>
      )}
    </Paper>
  );
};

export default SubscriptionLandingPage;
