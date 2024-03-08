// src/hooks/useSubscriptionCheck.js
import { useEffect } from 'react';
import { useAuth } from './use-auth'; // Asegúrate de que la ruta sea correcta
import { useRouter } from 'next/router';

const useSubscriptionCheck = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {

    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (user && !user.isSubscribed) {
      router.push('/subscription');
    }
  }, [user, router]);
};

export default useSubscriptionCheck;
