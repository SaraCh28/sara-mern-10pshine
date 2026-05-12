import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        localStorage.setItem('token', token);
        try {
          // Fallback to token payload first for immediate UI
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser({ id: payload.id, email: payload.email, name: payload.name });
          
          // Then fetch fresh data from server
          const data = await authService.getMe();
          if (data && data.data && data.data.user) {
            setUser(data.data.user);
          }
        } catch (e) {
          console.error('Auth initialization error', e);
          // If token is truly invalid (e.g., expired), the interceptor or getMe might fail
          // But we don't necessarily logout on every network error.
          // We'll trust the interceptor to handle 401s.
        }
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = (userData, userToken) => {
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
