import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/auth_api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await getCurrentUser();
        if (result.success) {
          setUser(result.data);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (userData) => {
    console.log('Login function called with:', userData);
    setUser(userData);  
  };

  const logout = async () => {
    try {
      const { logoutUser } = await import('../services/auth_api');
      await logoutUser();
      setUser(null);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);