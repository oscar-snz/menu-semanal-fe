import React, { useEffect, useState } from 'react';
import { Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useAuth } from 'src/hooks/use-auth'; // Asegúrate de importar correctamente tu hook de autenticación
import AddFamilyMember from './addFamilyMember';


const FamilyMemberList = ({familyMembers, fetchFamilyMembers, wantsToAddFamilyMembers}) => {
  const [editingItem, setEditingItem] = useState(null);
  const { token } = useAuth(); 

  

  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

 const handleDelete = async (memberId) => {
    try {
      await axios.delete(`http://localhost:3001/api/users/deleteFamilyMember/${memberId}`, config);
      // Actualiza la lista de miembros de la familia eliminando el miembro borrado
      fetchFamilyMembers();
    } catch (error) {
      console.error('Error al eliminar miembro de la familia:', error);
    }
  };

  if (!wantsToAddFamilyMembers) {
    return (
      <Typography sx={{ mt: 2, textAlign: 'center' }}>
        Active el plan familiar para ver o agregar personas a la familia.
      </Typography>
    );
  }

  return (
    <List>
      {familyMembers.length > 0 ? (
        familyMembers.map((member) => (
            <ListItem key={member._id}>
            <ListItemText primary={member.name} secondary={`Edad: ${member.age}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(member._id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="No hay miembros de la familia agregados" />
        </ListItem>
      )}
    </List>
  );
};

export default FamilyMemberList;
