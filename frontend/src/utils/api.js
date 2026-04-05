/**
 * @file api.js
 * @description Why this file exists: To centralize and configure a global Axios instance for making backend API calls.
 * @description Responsibility: Sets the default base URL for the backend API, configures timeout limits, and sets up a request interceptor that automatically attaches the user's JWT authorization token (if present in localStorage) to outgoing HTTP headers.
 */

import axios from 'axios';

// Create a pre-configured instance of Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000, // 15 seconds request timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach JWT authorization headers
api.interceptors.request.use(
  (config) => {
    // Retrieve the serialized user credentials state from localStorage
    const storedAuth = localStorage.getItem('stashit_auth');
    
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      // If the JWT token exists inside the credentials state, attach it to headers
      if (parsedAuth && parsedAuth.token) {
        config.headers.Authorization = `Bearer ${parsedAuth.token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

/**
 * Line-by-line Explanation:
 * Line 7: Imports the Axios HTTP request utility.
 * Line 10: Calls axios.create to initialize a custom request client.
 * Line 11: Configures VITE_API_URL environment base endpoint with local port 5000 fallback.
 * Line 12-15: Declares a 15-second request timeout limit and sets default JSON content type headers.
 * Line 19: Hooks a pre-request interceptor to process outgoing calls dynamically.
 * Line 20-30: Fetches the stored authentication string `unithrift_auth` from client localStorage. Parses it, checks for `token` property, and appends `Bearer <token>` to the Authorization header dynamically.
 * Line 32-34: Handles and forwards configuration parsing errors.
 * Line 37: Exports the customized Axios API client.
 */
