import React, { useEffect } from 'react';
import { Button, Box, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const AddInventoryItem = ({ editingItem, setEditingItem, fetchInventoryItems }) => {
  // Estados para tipos de alimentos y unidades predeterminadas
  const [foodTypes, setFoodTypes] = React.useState([]);
  const [units, setUnits] = React.useState([]);

  // Carga inicial de tipos de alimentos
  useEffect(() => {
    const fetchFoodTypes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/food/types');
        setFoodTypes(response.data);
      } catch (error) {
        console.error('Error al cargar los tipos de alimentos:', error);
      }
    };
    fetchFoodTypes();
  }, []);

  const formik = useFormik({
    initialValues: {
      itemName: editingItem ? editingItem.nombreAlimento : '',
      quantity: editingItem ? editingItem.cantidad : '',
      selectedFoodType: editingItem ? editingItem.tipoAlimento._id : '',
      unit: editingItem ? editingItem.unidad._id : '',
    },
    validationSchema: Yup.object({
      itemName: Yup.string().required('Requerido'),
      quantity: Yup.number().required('Requerido').positive('Debe ser un número positivo'),
      selectedFoodType: Yup.string().required('Requerido'),
      unit: Yup.string().required('Requerido'),
    }),
    onSubmit: async (values) => {
      const itemData = {
        nombreAlimento: values.itemName,
        cantidad: values.quantity,
        tipoAlimento: values.selectedFoodType,
        unidad: values.unit,
      };

      try {
        if (editingItem) {
          await axios.put(`http://localhost:3001/api/inventario/${editingItem._id}`, itemData);
        } else {
          await axios.post('http://localhost:3001/api/inventario', itemData);
        }
        fetchInventoryItems(); // Recargar inventario
        setEditingItem(null); // Finalizar edición
        formik.resetForm();
      } catch (error) {
        console.error('Error al guardar el elemento del inventario:', error);
      }
    },
  });

  // Cargar unidades predeterminadas basadas en el tipo de alimento seleccionado
  useEffect(() => {
    if (formik.values.selectedFoodType) {
      const type = foodTypes.find(t => t._id === formik.values.selectedFoodType);
      if (type && type.unidadesPredeterminadas) {
        setUnits(type.unidadesPredeterminadas);
      } else {
        setUnits([]);
      }
    }
  }, [formik.values.selectedFoodType, foodTypes]);

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        fullWidth
        id="itemName"
        label="Nombre del elemento"
        name="itemName"
        value={formik.values.itemName}
        onChange={formik.handleChange}
        error={formik.touched.itemName && Boolean(formik.errors.itemName)}
        helperText={formik.touched.itemName && formik.errors.itemName}
      />
      <TextField
        margin="normal"
        fullWidth
        name="quantity"
        label="Cantidad"
        type="number"
        id="quantity"
        value={formik.values.quantity}
        onChange={formik.handleChange}
        error={formik.touched.quantity && Boolean(formik.errors.quantity)}
        helperText={formik.touched.quantity && formik.errors.quantity}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="foodType-label">Tipo de Alimento</InputLabel>
        <Select
          labelId="foodType-label"
          id="selectedFoodType"
          name="selectedFoodType"
          value={formik.values.selectedFoodType}
          onChange={formik.handleChange}
          error={formik.touched.selectedFoodType && Boolean(formik.errors.selectedFoodType)}
        >
          {foodTypes.map((type) => (
            <MenuItem key={type._id} value={type._id}>
              {type.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="unit-label">Unidad</InputLabel>
        <Select
          labelId="unit-label"
          id="unit"
          name="unit"
          value={formik.values.unit}
          onChange={formik.handleChange}
          error={formik.touched.unit && Boolean(formik.errors.unit)}
        >
          {units.map((unit) => (
            <MenuItem key={unit._id} value={unit._id}>
              {unit.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={!(formik.isValid && formik.dirty)}
      >
        {editingItem ? 'Actualizar' : 'Agregar al inventario'}
      </Button>
    </Box>
  );
};

export default AddInventoryItem;
