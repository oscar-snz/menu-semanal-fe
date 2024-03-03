import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button, Typography, Box, Paper, List, ListItem, ListItemText } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'next/router';
import Head from 'next/head';


const ShoppingListPage = () => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [shoppingList, setShoppingList] = useState(null);
  const [weeklyMenuExists, setWeeklyMenuExists] = useState(false);
  const { token } = useAuth();
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    checkWeeklyMenuExists();
    fetchShoppingList();
  }, [currentWeek]);

  const checkWeeklyMenuExists = async () => {
    const weekStart = format(currentWeek, 'yyyy-MM-dd');
    try {
      const response = await axios.get(`http://localhost:3001/api/weekly-menu/byStartDate?weekStart=${weekStart}`, config);
      if (response.data) {
        setWeeklyMenuExists(true);
      } else {
        setWeeklyMenuExists(false);
      }
    } catch (error) {
      console.error('Error checking weekly menu:', error);
      setWeeklyMenuExists(false);
    }
  };

  const fetchShoppingList = async () => {
    const weekStart = format(currentWeek, 'yyyy-MM-dd');
    try {
      const response = await axios.get(`http://localhost:3001/api/shoppingList/byStartDate?weekStart=${weekStart}`, config);
      setShoppingList(response.data);
    } catch (error) {
      console.error('Error fetching shopping list:', error);
      setShoppingList(null);
    }
  };

  const handleCreateOrUpdateList = async () => {
    const weekStart = format(currentWeek, 'yyyy-MM-dd');
    if (!weeklyMenuExists) {
      alert('No hay un menú semanal creado para esta semana.');
      return;
    }
    try {
      if (shoppingList) {
        // Aquí iría la lógica para actualizar la lista si ya existe
        console.log('Actualizar lista existente');
      } else {
        // Crea una nueva lista de compras
        const response = await axios.post('http://localhost:3001/api/shoppingList/create', { weekStart }, config);
        console.log(response.data);
        alert('Lista de compras creada con éxito');
      }
      fetchShoppingList(); // Refrescar la lista de compras después de crear o actualizar
    } catch (error) {
      console.error('Error al crear o actualizar la lista de compras:', error);
      alert('Error al manejar la lista de compras.');
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
      <Typography variant="h4" sx={{ mb: 4 }}>Lista de compras para la semana</Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Button onClick={handlePrevWeek}>Anterior</Button>
        <Typography>
          {format(currentWeek, 'PP', { locale: es })} - {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'PP', { locale: es })}
        </Typography>
        <Button onClick={handleNextWeek}>Siguiente</Button>
      </Box>
      {shoppingList ? (
  <Box>
    <Typography variant="h6" sx={{ mb: 2 }}>Lista de compras para esta semana:</Typography>
    <List sx={{
      listStyleType: 'disc', // Aplica marcadores de disco a los elementos de la lista
      marginLeft: '20px', // Ajusta según sea necesario para alinear los elementos de la lista
      '& .MuiListItem-root': { // Aplica estilos a los elementos de la lista
        display: 'list-item'
      }
    }}>
      {shoppingList.items.map((item) => (
        <ListItem key={item._id}>
          <ListItemText primary={`${item.quantity} ${item.measure} ${item.food}`} />
        </ListItem>
      ))}
    </List>
    <Button variant="contained" color="primary" onClick={handleCreateOrUpdateList} sx={{ mt: 2 }}>
      Actualizar lista de compras
    </Button>
  </Box>
) : weeklyMenuExists ? (
  <Button variant="contained" color="primary" onClick={handleCreateOrUpdateList}>
    Crear lista de compras
  </Button>
) : (
  <Typography>No hay un menú semanal creado para esta semana.</Typography>
)}

    </Box>
  );
};

ShoppingListPage.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default ShoppingListPage;
