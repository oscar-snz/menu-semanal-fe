import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Button, Grid, Typography } from '@mui/material';
import axios from '../../utils/axiosWithInterceptor';
import { useAuth } from 'src/hooks/use-auth';
import { dietOptions, healthOptions } from '../../../constants/preferences'; // Asegúrate de que la ruta sea correcta

export const DietAndHealth = () => {
  const [diet, setDiet] = useState('');
  const [healthChecks, setHealthChecks] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { token } = useAuth();
  const config = { headers: { 'Authorization': `Bearer ${token}` } };


  // Carga los datos actuales del usuario
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users/user-data', config); // Ajusta la URL según sea necesario
        setDiet(response.data.diet);
        // Transformar el arreglo de health en un objeto para el estado
        const healthObject = response.data.health.reduce((acc, curr) => ({ ...acc, [curr]: true }), {});
        setHealthChecks(healthObject);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDietChange = (event) => {
    setDiet(event.target.value);
  };

  const handleHealthChange = (event) => {
    setHealthChecks({ ...healthChecks, [event.target.name]: event.target.checked });
  };

  const handleSubmit = async () => {
    setShowSuccessMessage(false);

    const healthArray = Object.entries(healthChecks).filter(([_, value]) => value).map(([key]) => key);

    try {
      await axios.patch('http://localhost:3001/api/users/update-health-type', { health: healthArray }, config); // Ajusta la URL según sea necesario
      // Opcional: mostrar un mensaje de éxito o actualizar el estado/UI según sea necesario
      
      await axios.post('http://localhost:3001/api/users/update-diet-type', {diet}, config);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  };

  return (
    <div>
      <FormControl fullWidth margin="normal">
        <InputLabel id="diet-label">Tipo de Dieta</InputLabel>
        <Select
          labelId="diet-label"
          id="diet"
          value={diet}
          label="Tipo de Dieta"
          onChange={handleDietChange}
        >
          {Object.entries(dietOptions).map(([spanish, english]) => (
            <MenuItem key={english} value={english}>{spanish}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={2}>
        {Object.entries(healthOptions).map(([spanish, english], index) => (
          <Grid item xs={6} key={english}> {/* xs={6} asigna la mitad del ancho, creando 2 columnas */}
            <FormControlLabel
              control={<Checkbox checked={!!healthChecks[english]} onChange={handleHealthChange} name={english} />}
              label={spanish}
            />
          </Grid>
        ))}
      </Grid>

    
    
      <Button onClick={handleSubmit} variant="contained" color="primary" style={{ marginTop: '20px' }}>
        Guardar Cambios
      </Button>

      {showSuccessMessage && (
      <Typography color="green" sx={{ mb: 2 }}>
        Las opciones fueron actualizadas exitosamente.
      </Typography>
    )}
    
    </div>
  );
};
