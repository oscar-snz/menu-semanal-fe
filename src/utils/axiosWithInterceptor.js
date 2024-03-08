import axios from 'axios';
import Router from 'next/router';

const axiosInstance = axios.create({
  // Aquí puedes configurar otros aspectos de Axios si lo necesitas
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    
    if (error.response && error.response.status ===401){
      Router.push('/auth/login');
      
    }else if (error.response && error.response.status === 403) {
      // Si recibes un 403, redirige al usuario a la página de suscripción
      Router.push('/subscription');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
