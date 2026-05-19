import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL, 
  withCredentials: true, 
});

let currentAccessToken = null;
let refreshPromise = null;

export const setAxiosToken = (token) => {
  currentAccessToken = token;
};

export const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true })
      .then(({ data }) => {
        setAxiosToken(data.accessToken);
        return data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// Request Interceptor
api.interceptors.request.use((config) => {
  if (currentAccessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${currentAccessToken}`;
  }
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    return response; 
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true; 
      
      try {
        const data = await refreshAccessToken();

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        setAxiosToken(null);
        window.dispatchEvent(new Event('auth:session-expired'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
