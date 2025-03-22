import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create a custom axios instance for API calls
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add Authorization token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        // If token refresh is successful, update token and retry the original request
        const newToken = response.data.access_token;
        localStorage.setItem('token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, log the user out
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to make API requests with fallback to mock data
export const apiRequest = async <T>(
  endpoint: string,
  method: 'get' | 'post' | 'put' | 'delete' = 'get',
  data?: any,
  mockData?: T,
  config?: any
): Promise<T> => {
  try {
    let response;
    
    switch (method) {
      case 'get':
        response = await apiClient.get(endpoint, config);
        break;
      case 'post':
        response = await apiClient.post(endpoint, data, config);
        break;
      case 'put':
        response = await apiClient.put(endpoint, data, config);
        break;
      case 'delete':
        response = await apiClient.delete(endpoint, config);
        break;
    }
    
    return response.data;
  } catch (error) {
    console.error(`API ${method.toUpperCase()} request to ${endpoint} failed:`, error);
    
    // If mockData is provided, use it as fallback
    if (mockData !== undefined) {
      console.log(`Using mock data for ${endpoint}`);
      return mockData;
    }
    
    // Otherwise, throw the error
    throw error;
  }
};

export default apiClient;
