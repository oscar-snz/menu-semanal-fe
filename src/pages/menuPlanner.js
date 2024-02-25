import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import Head from 'next/head';
import { Button, Typography, Box, Paper } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';


const MenuPlanner = () => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [weeklyMenu, setWeeklyMenu] = useState(null);
  const { token } = useAuth();
  const config = { headers: { 'Authorization': `Bearer ${token}` } };

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
      {weeklyMenu ? (
        <Box>
          {weeklyMenu.dailyMenus.map((dailyMenu) => (
            <Paper key={dailyMenu._id} elevation={2} sx={{ mb: 2, p: 2 }}>
              <Typography variant="h6">{format(new Date(dailyMenu.date), 'PPPP', { locale: es })}</Typography>
              <Box display="flex" justifyContent="space-between">
              {dailyMenu.recipes.map((recipe) => (
                <React.Fragment key={recipe._id}>
                  {recipe.breakfast && (
                    <Typography>Desayuno: {recipe.breakfast.label}</Typography>
                  )}
                  {recipe.lunch && (
                    <Typography>Almuerzo: {recipe.lunch.label}</Typography>
                  )}
                  {recipe.dinner && (
                    <Typography>Cena: {recipe.dinner.label}</Typography>
                  )}
                </React.Fragment>
                ))}
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        <Typography>Cargando menú o no disponible...</Typography>
      )}
    </Box>
  );
};

MenuPlanner.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);
export default MenuPlanner;
