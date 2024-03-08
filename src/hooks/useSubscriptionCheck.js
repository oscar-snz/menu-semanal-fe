// src/hooks/useSubscriptionCheck.js
import { useEffect } from 'react';
import { useAuth } from './use-auth'; // Asegúrate de que la ruta sea correcta
import { useRouter } from 'next/router';
import axios from 'axios'; 


const useSubscriptionCheck = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { token } = useAuth();
  const config = { headers: { 'Authorization': `Bearer ${token}` } };


  useEffect(() => async() =>{
    const response = await axios.get('http://localhost:3001/api/users/user-data', config); 

    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (user && !response.data.isSubscribed) {
      router.push('/subscription');
    }
  }, [user, router]);
};

export default useSubscriptionCheck;
