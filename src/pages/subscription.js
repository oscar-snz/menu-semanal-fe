import React, { useEffect, useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import CreditCardForm from '../components/CreditCardForm';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth';

const SubscriptionLandingPage = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isSubscribed: false,
    hasUsedTrial: false,
    trialEndDate: null,
    subscriptionEndDate: null
  });
  const { token } = useAuth();
  const config = { headers: { Authorization: `Bearer ${token}` } };

  
  useEffect(() => {
    // Simula una función que consulta el estado de la suscripción
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

  const handleSubscriptionSubmit = async (cardDetails) => {
    console.log('Detalles de la tarjeta:', cardDetails);
    // Determina si debemos iniciar un periodo de prueba o una suscripción basado en el estado actual
    try {
      if (!subscriptionStatus.isSubscribed && !subscriptionStatus.hasUsedTrial) {
        // Inicia el periodo de prueba
        await axios.post('http://localhost:3001/api/users/start-trial', config);
        alert('Tu periodo de prueba ha comenzado!');
      } else {
        // Inicia una suscripción
        await axios.post('http://localhost:3001/api/users/start-subscription', config, { cardDetails });
        alert('Tu suscripción ha sido activada!');
      }
    } catch (error) {
      console.error('Error handling subscription:', error);
      alert('Ocurrió un error al procesar tu suscripción.');
    }
  };

  return (
    <Box sx={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom>
        ¡Bienvenido a MasterMenu Premium!
      </Typography>
      <Typography paragraph>
        Con MasterMenu Premium, obtendrás acceso completo a recetas exclusivas, planificación de comidas personalizada, y mucho más.
      </Typography>
      <Typography paragraph>
        ¡Disfruta de 30 días de prueba gratuita ingresando tu tarjeta de crédito!
      </Typography>
      <CreditCardForm onSubmit={handleSubscriptionSubmit} />
    </Box>
  );
};

export default SubscriptionLandingPage;
