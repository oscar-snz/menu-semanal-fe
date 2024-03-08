import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosWithInterceptor';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, addDays, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import Head from 'next/head';
import { Button, Typography, Box, Paper } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'next/router';
import useSubscriptionCheck from 'src/hooks/useSubscriptionCheck'; 



const MenuPlanner = () => {
  useSubscriptionCheck();
  const router = useRouter();
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [weeklyMenu, setWeeklyMenu] = useState(null);
  const { token } = useAuth();
  const config = { headers: { 'Authorization': `Bearer ${token}` } };
  const [creatingMenu, setCreatingMenu] = useState(null); 

  function parseDate(dateString) {
    const [datePart] = dateString.split('T'); 
    const [year, month, day] = datePart.split('-').map(Number); 
    return { year, month, day }; 
  }


  const handleCreateMenu = async (dayIdentifier) => {
    setCreatingMenu(dayIdentifier);
    const payload = { date: dayIdentifier };

    try {
      await axios.post('http://localhost:3001/api/weekly-menu', payload, config);
      setCreatingMenu(null);
      fetchWeeklyMenu();
    } catch (error) {
      console.error('Error al crear el menu: ', error) ;
      setCreatingMenu(null); 
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
          const dayIdentifier = format(day, 'yyyy-MM-dd');
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
                  <Button onClick={() => handleCreateMenu(dayIdentifier)}>
             {creatingMenu === dayIdentifier ? <CircularProgress size={24} /> : 'Crear menú para esta fecha'} 
             </Button>
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
