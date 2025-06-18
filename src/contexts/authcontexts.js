import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 


 const checkLogin = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/profile'); 
  
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setUser(data); // <--- CAMBIO AQUÍ: setUser(data) en lugar de setUser(data.user)
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error al verificar sesión:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  
  const login = async (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

 
 const logout = async () => {
  try {
    await fetch('/api/logout', {
      method: 'POST',
    });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);