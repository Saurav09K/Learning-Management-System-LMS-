import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { refreshAccessToken, setAxiosToken } from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = () => {
    setAccessToken(null);
    setAxiosToken(null);
    setUser(null);
  };

  useEffect(() => {
    window.addEventListener('auth:session-expired', clearSession);

    return () => {
      window.removeEventListener('auth:session-expired', clearSession);
    };
  }, []);

  useEffect(() => {
    const refreshSession = async () => {
      try {
        const data = await refreshAccessToken();
        
        setAccessToken(data.accessToken);
        setAxiosToken(data.accessToken);

        setUser(data.user);
        
      } catch {
        clearSession();
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
      clearSession();
      window.location.assign('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
