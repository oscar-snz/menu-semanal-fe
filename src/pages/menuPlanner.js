import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, addDays, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import Head from 'next/head';
import { Button, Typography, Box, Paper } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'next/router';



const MenuPlanner = () => {
  const router = useRouter();
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [weeklyMenu, setWeeklyMenu] = useState(null);
  const { token } = useAuth();
  const config = { headers: { 'Authorization': `Bearer ${token}` } };

  function parseDate(dateString) {
    const [datePart] = dateString.split('T'); // Extrae solo la parte de la fecha
    const [year, month, day] = datePart.split('-').map(Number); // Convierte a números
    return { year, month, day }; // Devuelve un objeto con las partes
  }


  const handleCreateMenu = async (date) => {
    const payload = { date: format(date, 'yyyy-MM-dd') };

    try {
      const response = await axios.post('http://localhost:3001/api/weekly-menu', payload, config);

      // Aquí puedes manejar la respuesta. Por ejemplo, podrías mostrar un mensaje de éxito.
      console.log(response.data);
      alert('¡Menú creado con éxito!');
      fetchWeeklyMenu();
    } catch (error) {
      console.error('Error al crear el menú:', error);
      // Aquí puedes manejar el error. Por ejemplo, mostrar un mensaje de error.
      alert('Error al crear el menú.');
    }
  };

  const handleViewRecipe = (day) => {
    const formattedDate = format(day, 'yyyy-MM-dd');
    router.push(`/dailyMenuVisualizer/${formattedDate}`); 
  };

  useEffect(() => {
    fetchWeeklyMenu();
  }, [currentWeek]);

  const fetchWeeklyMenu = async () => {
    const weekStart = format(currentWeek, 'yyyy-MM-dd');
    try {
      const response = await axios.get(`http://localhost:3001/api/weekly-menu/byStartDate?weekStart=${weekStart}`, config);
      setWeeklyMenu(response.data);
    } catch (error) {
      console.error('Error fetching weekly menu:', error);
      setWeeklyMenu(null);
    }
  };

  const handlePrevWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Button onClick={handlePrevWeek}>Anterior</Button>
        <Typography>
          {format(currentWeek, 'PP', { locale: es })} - {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'PP', { locale: es })}
        </Typography>
        <Button onClick={handleNextWeek}>Siguiente</Button>
      </Box>
      <Box>
        {Array.from({ length: 7 }).map((_, index) => {
          const day = startOfDay(addDays(startOfWeek(currentWeek, { weekStartsOn: 1 }), index));
          const dailyMenu = weeklyMenu?.dailyMenus.find(menu => {
            const menuDateParts = parseDate(menu.date);
            const dayParts = parseDate(day.toISOString());
            return menuDateParts.year === dayParts.year &&
              menuDateParts.month === dayParts.month &&
              menuDateParts.day === dayParts.day;
          });
          return (
            <Paper key={index} elevation={2} sx={{ mb: 2, p: 2 }}>
              <Typography variant="h6">{format(day, 'PPPP', { locale: es })}</Typography>
              <Box display="flex" justifyContent="space-between">
                {!dailyMenu && (
                  <Button onClick={() => handleCreateMenu(day)}>Crear menú para esta fecha</Button>
                )}
                {dailyMenu && (
                  <Button onClick={() => handleViewRecipe(day)}>Visualizar receta</Button>
                )}
                {dailyMenu?.recipes.map((recipe) => (
                  <React.Fragment key={recipe._id}>
                    <Typography>Desayuno: {recipe.breakfast?.label}</Typography>
                    <Typography>Almuerzo: {recipe.lunch?.label}</Typography>
                    <Typography>Cena: {recipe.dinner?.label}</Typography>
                  </React.Fragment>
                ))}
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};


MenuPlanner.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);
export default MenuPlanner;
