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
        if (result.success && result.data && typeof result.data !== 'string' && typeof result.data === 'object') {
          setUser(result.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);  // Force stop loading after 3 seconds
    }, 3000);
    return () => clearTimeout(timer);
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