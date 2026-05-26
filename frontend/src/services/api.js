import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Global memory cache for API GET requests
const routeCache = new Map();

// Helper to clear cache manually (e.g., on logout)
export const clearApiCache = () => {
  routeCache.clear();
};

api.interceptors.request.use((config) => {
  const user = JSON.parse(sessionStorage.getItem('medilink_user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  // Caching Logic: Intercept GET requests and return cached data if available
  if (config.method === 'get') {
    const key = config.url; // Use URL as the cache key
    if (routeCache.has(key)) {
      config.adapter = () => {
        return Promise.resolve({
          data: routeCache.get(key),
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          request: {}
        });
      };
    }
  } else {
    // Invalidate cache on mutations (POST, PUT, DELETE, PATCH)
    routeCache.clear();
  }

  return config;
});

api.interceptors.response.use((response) => {
  // Store successful GET responses in the cache
  if (response.config.method === 'get' && response.status >= 200 && response.status < 300) {
    routeCache.set(response.config.url, response.data);
  }
  return response;
});

export default api;
