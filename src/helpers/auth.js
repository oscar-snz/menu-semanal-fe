// helpers/auth.js
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

// Suponiendo que tienes una clave secreta para validar el JWT
const JWT_SECRET = process.env.JWT_SECRET;

export const verifyUser = (req) => {
    console.log('Cookies recibidas:', req.headers.cookie);
    const cookies = cookie.parse(req.headers.cookie || '');
    console.log('Token extraído de la cookie:', cookies.auth_token);

    const token = cookies.auth_token; // Asume que guardas el token JWT en una cookie llamada 'auth_token'

  if (!token) {
    return { isAuthenticated: false };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Si el token es válido, devuelve el usuario. Ajusta según cómo guardas el usuario en el token
    return { isAuthenticated: true, user: decoded.user };
  } catch (error) {
    console.error('Error al verificar el token JWT:', error);
    return { isAuthenticated: false };
  }
};
