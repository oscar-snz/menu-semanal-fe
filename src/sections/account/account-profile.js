import React from 'react';
import { useAuth } from 'src/hooks/use-auth';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';

const defaultUser = {
  avatar: '/assets/avatars/avatar-marcus-finn.png',
  timezone: 'GTM-7'
};

export const AccountProfile = () => {
  const { user } = useAuth(); // Extrae el usuario del contexto de autenticación
  return (
  <Card>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Avatar
          src={defaultUser.avatar}
          sx={{
            height: 80,
            mb: 2,
            width: 80
          }}
        />
        <Typography
          gutterBottom
          variant="h5"
        >
          {user.name}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {defaultUser.timezone}
        </Typography>
      </Box>
    </CardContent>
    <Divider />
    <CardActions>
      <Button
        fullWidth
        variant="text"
      >
        Subir foto
      </Button>
    </CardActions>
  </Card>
);
        };
