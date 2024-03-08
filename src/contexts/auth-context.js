import { createContext, useContext, useState, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'; 

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState("");
  

  const initialize = async () => {
    if (initialized.current) {
      return;
    }
  
    initialized.current = true;
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      // Asegúrate de cargar y parsear la información de suscripción
      const user = storedUser ? JSON.parse(storedUser) : null;
  
      if (user && storedToken) {
        setCurrentUser(user);
        setToken(storedToken);
        dispatch({ type: HANDLERS.INITIALIZE, payload: user });
      } else {
        dispatch({ type: HANDLERS.INITIALIZE });
      }
    }
  };



  useEffect(
    () => {
      initialize();
   },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // const skip = () => {
  //   try {
  //     window.sessionStorage.setItem('authenticated', 'true');
  //   } catch (err) {
  //     console.error(err);
  //   }

  //   const user = {
  //     id: '5e86809283e28b96d2d38537',
  //     avatar: '/assets/avatars/avatar-anika-visser.png',
  //     name: 'Anika Visser',
  //     email: 'anika.visser@devias.io'
  //   };

  //   dispatch({
  //     type: HANDLERS.SIGN_IN,
  //     payload: user
  //   });
  // };

  const signIn = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password,
      }, {
        withCredentials: true
      });

      const { user, token } = response.data;
      
      if (typeof window !== "undefined") {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ ...user}));
        setToken(token);
        setCurrentUser({ ...user });
        dispatch({
          type: HANDLERS.SIGN_IN,
          payload: { ...user }
        });
      }
    } catch(err) {
      console.error('Error en signIn:', err);
      throw err;
    };
  }

  const signUp = async (name, email, password) => {
    try {
    const response = await axios.post('http://localhost:3001/api/users/register', {
      name,
      email,
      password,
    });
  
  const { user, token } = response.data; // Asume que el backend envía el token y los datos del usuario
  if (typeof window !== "undefined") {
    localStorage.setItem('token', token); // Almacena el token en localStorage
    localStorage.setItem('user', JSON.stringify(user)); // Almacena los datos del usuario en localStorage
  }

  dispatch({
    type: HANDLERS.SIGN_IN,
    payload: user,
  });
  } catch (err) {
  console.error(err);
  throw err; // Para poder manejar este error en el componente
  }
  };

  const signOut = () => {
    setCurrentUser(null);
    setToken("");
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };
  if (typeof window !== "undefined") {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  }
  return (
    <AuthContext.Provider
      value={{
        ...state,
        currentUser,
        token,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);

export default useSubscriptionCheck;
