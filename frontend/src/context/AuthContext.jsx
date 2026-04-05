/**
 * @file AuthContext.jsx
 * @description Why this file exists: To provide a global state provider for managing user authentication state (login, registration, logout, and token persistence) across the React app.
 * @description Responsibility: Stores user data and token strings in state, auto-loads cached credentials from localStorage on startup, sends auth API requests via Axios, handles auth errors, and exports a custom hook for easy access by UI components.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

// Create the authentication context object
const AuthContext = createContext(null);

/**
 * Authentication Provider component wrapping the React application tree
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load cached user credentials from localStorage on component mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedAuth = localStorage.getItem('stashit_auth');
        if (storedAuth) {
          const parsedAuth = JSON.parse(storedAuth);
          if (parsedAuth && parsedAuth.user) {
            setUser(parsedAuth.user);
          }
        }
      } catch (err) {
        console.error('Failed to parse cached authentication state:', err.message);
        localStorage.removeItem('stashit_auth');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Logs in an existing student user
   * @param {string} email - Campus email address
   * @param {string} password - User password
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      const authData = { token, user: userData };
      
      // Update state and save to localStorage
      setUser(userData);
      localStorage.setItem('stashit_auth', JSON.stringify(authData));
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Registers a new student user
   * @param {Object} registrationData - Student registration details
   */
  const register = async (name, regNo, year, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', { name, regNo, year: Number(year), email, password });
      const { token, user: userData } = response.data;
      
      const authData = { token, user: userData };
      
      // Update state and save to localStorage
      setUser(userData);
      localStorage.setItem('stashit_auth', JSON.stringify(authData));
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Please check your inputs.';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logs out the active user and clears cached credentials
   */
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('stashit_auth');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Reusable custom hook to access the Authentication Context values.
 * @returns {Object} Auth context values (user, login, register, logout, etc.)
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be consumed within an AuthProvider');
  }
  return context;
};

/**
 * Line-by-line Explanation:
 * Line 8: Imports context hooks from React.
 * Line 9: Imports Axios api wrapper instance.
 * Line 12: Instantiates AuthContext default state.
 * Line 17: Declares AuthProvider wrapper component.
 * Line 18-20: Declares state properties tracking active user profile, loading state, and error logs.
 * Line 23-41: Initiates component did mount hook. Checks localstorage for valid JSON auth strings, sets user profiles, and flags loading states as false.
 * Line 47: Declares `login` method taking email and password credentials.
 * Line 51: Calls API endpoint POST `/auth/login`. On success, sets user state, caches JWT/user JSON data structure inside localStorage, and returns success true flag.
 * Line 56-58: Intercepts error responses. Checks for custom messages returned from express server middleware and updates auth errors state.
 * Line 68: Declares `register` method mapping user inputs.
 * Line 72: Submits user registration dataset to POST `/auth/register`. On success, logs user in.
 * Line 89: Declares `logout` which resets user profiles to null and clears localStorage.
 * Line 95-108: Renders the Context Provider boundary enclosing React children.
 * Line 114-120: Custom `useAuth` hook wrapper to expose context fields safely.
 */
