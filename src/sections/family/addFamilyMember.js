import React, { useState, useEffect } from 'react';
import { Typography, Box, Button, TextField, FormControl, FormHelperText, Switch, FormGroup, FormControlLabel } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from '../../utils/axiosWithInterceptor';
import { useAuth } from 'src/hooks/use-auth';
import FamilyMemberList from './familyMemberList';

const AddFamilyMember = ({ fetchFamilyMembers, wantsToAddFamilyMembers }) => {
  const { token } = useAuth();
  
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  
  const formik = useFormik({
    initialValues: {
      memberName: '',
      age: ''
    },
    validationSchema: Yup.object({
      memberName: Yup.string().required('El nombre del miembro es obligatorio'),
      age: Yup.number().required("La edad es obligatoria")
    }),
    onSubmit: async (values) => {
      try {
        await axios.post('http://localhost:3001/api/users/add-family-member', {
          name: values.memberName,
          age: values.age
        }, config);
        fetchFamilyMembers();
        formik.resetForm();
      } catch (error) {
        console.error('Error al agregar el miembro de la familia:', error);
      }
    },
    enableReinitialize: true,
  });

  if (!wantsToAddFamilyMembers) {
    // Opcionalmente, puedes regresar null o algún mensaje indicativo.
    return null;
  }

  return (
    <>    
      
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
      <FormControl fullWidth margin="normal" error={formik.touched.memberName && Boolean(formik.errors.memberName)}>
        <TextField
          id="memberName"
          name="memberName"
          label="Nombre del miembro de la familia"
          value={formik.values.memberName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          helperText={formik.touched.memberName && formik.errors.memberName}
          margin="normal"
          required
        />
        <TextField
           id="age"
           name="age"
           label="Edad"
           value={formik.values.age}
           onChange={formik.handleChange}
           onBlur={formik.handleBlur}
           helperText={formik.touched.age && formik.errors.age}
           margin="normal"
           required
        />
        { formik.touched.age && formik.errors.age &&(
          <FormHelperText error={true}>{formik.errors.memberName}</FormHelperText>
        )}
      </FormControl>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={!formik.isValid || formik.isSubmitting}
      >
        Agregar miembro
      </Button>
      
    </Box>
  
  </>
  );
};

export default AddFamilyMember;
