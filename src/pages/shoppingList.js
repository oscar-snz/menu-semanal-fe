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
  const [inventory, setInventory] = useState([]);
  const { token } = useAuth();
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const levenshteinDistance = (a, b) => {
    if (!a.length) return b.length;
    if (!b.length) return a.length;
  
    const matrix = [];
  
    // Increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
  
    // Increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
  
    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) == a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                                  Math.min(matrix[i][j - 1] + 1, // insertion
                                           matrix[i - 1][j] + 1)); // deletion
        }
      }
    }
  
    return matrix[b.length][a.length];
  };

  
  const pluralizeWord = (word, quantity) => {
    const lastChar = word[word.length - 1].toLowerCase();
    const vowels = ['a', 'e', 'i', 'o', 'u'];
  
    if (quantity >= 2) {
      if (vowels.includes(lastChar)) {
        return word + 's';
      } else {
        return word + 'es';
      }
    }
    return word;
  };

  
  // Paso 2 y 3: Comprobar artículo en inventario y generar mensaje
  const checkItemInInventory = (item) => {
    let message = '';
    const threshold = 0.8; // Umbral para considerar una coincidencia
    let hasMatch = false; // Para rastrear si encontramos alguna coincidencia
    
    inventory.forEach(inventoryItem => {
      const similarity = 1 - levenshteinDistance(item.food.toLowerCase(), inventoryItem.nombreAlimento.toLowerCase()) / Math.max(item.food.length, inventoryItem.nombreAlimento.length);
      
      if (similarity >= threshold) {
        hasMatch = true; // Marcamos que encontramos una coincidencia
        const itemMeasurePluralized = pluralizeWord(item.measure, item.quantity);
        const inventoryMeasurePluralized = pluralizeWord(inventoryItem.unidad.nombre, inventoryItem.cantidad);
        
        if (item.measure === inventoryItem.unidad.nombre && item.quantity <= inventoryItem.cantidad) {
          // Caso: Tienes suficiente en inventario
          message = `Tienes suficiente ${inventoryItem.nombreAlimento}, tienes ${inventoryItem.cantidad} ${inventoryMeasurePluralized} en tu inventario.`;
        } else {
          // Caso: Necesitas más pero tienes algo en inventario
          message = `Necesitas ${item.quantity} ${itemMeasurePluralized} de ${item.food}, pero tienes ${inventoryItem.cantidad} ${inventoryMeasurePluralized} en tu inventario.`;
        }
      }
    });
    
    return message;
  };
  
  

  useEffect(() => {
    checkWeeklyMenuExists();
    fetchShoppingList();
    fetchInventory();
  }, [currentWeek]);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/inventario`, config);
      setInventory(response.data[0].articulos);
    } catch (error) {
      setInventory([]);
      console.error('Error fetching inventory:', error);
    }
  };

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
  <ListItem key={item._id} alignItems="flex-start">
    <ListItemText
      primary={
        <React.Fragment>
          <Typography component="span" variant="body1">
            {`${item.quantity} ${pluralizeWord(item.measure, item.quantity)} ${item.food}`}
          </Typography>
        </React.Fragment>
      }
      secondary={
        checkItemInInventory(item) && (
          <Typography component="div" variant="body2" style={{ marginTop: '4px' }}>
            {checkItemInInventory(item)}
          </Typography>
        )
      }
    />
  </ListItem>
))}
      <ListItem>
      
      </ListItem>
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
