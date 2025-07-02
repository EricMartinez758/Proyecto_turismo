import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
   
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [user, setUser] = useState(() => {
    
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true); 


  const checkLogin = async () => {
    try {
   
      const res = await fetch('/api/profile');

      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setUser(data);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(data)); 
      } else {
        
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error al verificar sesión:', error);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    } finally {
      setLoading(false); 
    }
  };

  
  useEffect(() => {
    checkLogin();
  }, []);

  
  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData); // userData ahora incluye id, correo, y role
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData)); // Persiste el usuario completo
  };

  
  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
      });
     
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error al cerrar sesión en el frontend:', error);
      
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);