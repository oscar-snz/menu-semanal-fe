import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Paper, Switch, FormControlLabel } from '@mui/material';
import { useRouter } from 'next/router';
import { useAuth } from 'src/hooks/use-auth';
import axios from 'axios'; 

function CardForm() {
  const router = useRouter();
  const { token } = useAuth();
  const config = { headers: { 'Authorization': `Bearer ${token}` } };

  const [cardDetails, setCardDetails] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cardDetails.cardNumber.length !== 16) {
      alert("Por favor ingresa un número de tarjeta válido.");
      return;
    }

   
    const response = await axios.get('http://localhost:3001/api/users/user-data', config); 
    const payload = {
      isTrial: !response.data.hasUsedTrial
    };
   
    
    try {
      await axios.post('http://localhost:3001/api/users/start-subscription', payload, config);
      alert('Transacción procesada con éxito!');
      setTimeout(() => router.push('/'), 3000); 
    } catch (error) {
      console.error('Error procesando el pago:', error.response?.data?.message || 'Ocurrió un error');
      alert('Error procesando el pago. Por favor, intenta nuevamente.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Datos de tarjeta
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cardholder Name"
              variant="outlined"
              name="name"
              value={cardDetails.name}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Card Number"
              variant="outlined"
              name="cardNumber"
              value={cardDetails.cardNumber}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Expiry Date (MM/YY)"
              variant="outlined"
              name="expiry"
              value={cardDetails.expiry}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="CVC"
              variant="outlined"
              name="cvc"
              value={cardDetails.cvc}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Procesar Pago
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default CardForm;
