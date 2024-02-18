// pages/family.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Container, Typography, Switch, FormControlLabel, FormGroup } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import AddFamilyMember from 'src/sections/family/addFamilyMember'; // Asegúrate de que la ruta sea correcta y el nombre del import inicie con mayúscula
import FamilyMemberList from 'src/sections/family/familyMemberList';
import { useAuth } from 'src/hooks/use-auth';
import axios from 'axios';



const FamilyPage = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [wantsToAddFamilyMembers, setWantsToAddFamilyMembers] = useState(true);
  const { token } = useAuth();
  const config = { headers: { 'Authorization': `Bearer ${token}` } };

  const fetchFamilyMembers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/users/family-members', config);
      setFamilyMembers(response.data.familyMembers)
      setWantsToAddFamilyMembers(response.data.wantsToAddFamilyMembers);   
    } catch (error) {
      console.error('Error fetching family preference:', error);
    }
  };

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const toggleFamilyPlan = async (checked) => {
    try {
      await axios.patch('http://localhost:3001/api/users/update-family-preference', { wantsToAddFamilyMembers: checked }, config);
      setWantsToAddFamilyMembers(checked);
    } catch (error) {
      console.error('Error updating family preference:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Gestionar Familia | MasterMenu</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 3 }}>
            Gestionar Familia
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={!!wantsToAddFamilyMembers}
                  onChange={(e) => toggleFamilyPlan(e.target.checked)}
                  color="primary"
                />
              }
              label={wantsToAddFamilyMembers ? "Plan familiar activado" : "¿Desea activar el plan familiar?"}
            />
          </FormGroup>
          {wantsToAddFamilyMembers === false && (
            <Typography sx={{ mt: 2, textAlign: 'center' }}>
              Active el plan familiar para agregar personas a la familia.
            </Typography>
          )}
          {wantsToAddFamilyMembers && (
            <>
              <AddFamilyMember fetchFamilyMembers={fetchFamilyMembers} wantsToAddFamilyMembers={wantsToAddFamilyMembers} />
          <FamilyMemberList familyMembers={familyMembers} fetchFamilyMembers={fetchFamilyMembers} wantsToAddFamilyMembers={wantsToAddFamilyMembers} />
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

FamilyPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default FamilyPage;