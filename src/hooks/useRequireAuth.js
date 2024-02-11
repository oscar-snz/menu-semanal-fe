import { useEffect } from 'react';
import { useRouter } from 'next/router';

export const useRequireAuth = (redirectUrl = '/auth/login') => {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined") {
    const token = localStorage.getItem('token');

    if (!token) {
      // Guarda la ruta actual antes de redirigir
      sessionStorage.setItem('urlBeforeLogin', router.asPath);

      // Redirige al usuario a la página de inicio de sesión
      router.push(redirectUrl);
    }else{
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
}
  }, [router, redirectUrl]);
  return auth;
};
