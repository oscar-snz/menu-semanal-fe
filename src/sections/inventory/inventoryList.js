import React, { useEffect, useState } from 'react';
import {Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios'; // Asumiendo que estás utilizando axios para las llamadas a la API
import AddInventoryItem from './addInventoryItem';
import { useAuth } from 'src/hooks/use-auth';


const InventoryList = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const { token } = useAuth();


const config = {
  headers: {
    'Authorization': `Bearer ${token}`
  }
};
  const fetchInventoryItems = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/inventario', config);
      setInventoryItems(response.data);
    } catch (error) {
      console.error('Error al cargar el inventario:', error);
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);
  
  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/inventario/articulo/${id}`, config);
      fetchInventoryItems(); // Recargar el inventario después de eliminar
    } catch (error) {
      console.error('Error al eliminar el elemento del inventario:', error);
    }
  };

  if (inventoryItems.length === 0) {
    return (
      <>
        <AddInventoryItem editingItem={editingItem} setEditingItem={setEditingItem} fetchInventoryItems={fetchInventoryItems} />
        <Typography sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
          No hay elementos en el inventario.
        </Typography>
      </>
    );
  }

  return (
    <>
      <AddInventoryItem editingItem={editingItem} setEditingItem={setEditingItem} fetchInventoryItems={fetchInventoryItems} />
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Unidad</TableCell>
              <TableCell>Tipo de alimento</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {inventoryItems.map((inventoryItem) => (
    inventoryItem.articulos.map((articulo, index) => (
      <TableRow key={articulo._id || index}>
        <TableCell>{articulo.nombreAlimento}</TableCell>
        <TableCell>{articulo.cantidad}</TableCell>
        <TableCell>{articulo.unidad.nombre} ({articulo.unidad.abreviatura})</TableCell>
        <TableCell>{articulo.tipoAlimento.nombre}</TableCell>
        <TableCell>
          <Button onClick={() => handleEdit(articulo)}>Editar</Button>
          <Button onClick={() => handleDelete(articulo._id)}>Eliminar</Button>
        </TableCell>
      </TableRow>
    ))
  ))}
</TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default InventoryList;
