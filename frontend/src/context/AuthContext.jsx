import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import api from '../api/axios';
import { setAxiosToken } from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshSession = async () => {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/auth/refresh',
          {},
          { withCredentials: true }
        );
        
        setAccessToken(response.data.accessToken);
        setAxiosToken(response.data.accessToken);
        
      } catch (error) {
        setAccessToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    refreshSession();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    
    setAccessToken(response.data.accessToken);
    setAxiosToken(response.data.accessToken);
    setUser(response.data.user);
    
    return response.data;
  };

  const register = async (name, email, password, role) => {
    const response = await api.post('/auth/register', { name, email, password, role });
    
    setAccessToken(response.data.accessToken);
    setUser(response.data.user);
    setAxiosToken(response.data.accessToken); 
    
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setAccessToken(null);
      setAxiosToken(null);
      setUser(null);
      window.location.href = '/login'; // Redirect to login page
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);