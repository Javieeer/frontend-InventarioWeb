// src/context/authContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

/* Manejar los eventos */
export const AuthProvider = ({ children }) => {

  /* Declaramos los estados necesarios */
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Obtenemos el usuario actual y sus datos */
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  /* Objetenemos los datos del usuario desde user.auth */
  useEffect(() => {
    const getUserData = async () => {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error al obtener datos del usuario:', error);
        } else {
          setUserData(data);
        }
      } catch (err) {
        console.error('Error inesperado al obtener datos:', err);
      }
    };

    if (user) {
      getUserData();
    }
    setLoading(false);
    
  }, [user]);

  /* Funcion para iniciar sesión */
  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message);
    }
  };

  /* Funcion para cerrar sesión */
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error.message);
    } else {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
