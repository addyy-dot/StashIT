/**
 * @file ProtectedRoute.jsx
 * @description Why this file exists: To restrict access to authorized users for specific client-side paths (e.g. creating/editing listings or looking at dashboard pages).
 * @description Responsibility: Monitors global user auth state. If authorization checks are still loading, it renders a loading indicator. If unauthorized, it redirects the browser to the login screen, preserving the requested route context. If authorized, it renders the target page components.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Higher-Order Route Guard Component
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1. Render a clean loading interface while checking authentication token cache
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          {/* Elegant animate-spin border indicator */}
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm">Verifying session...</p>
        </div>
      </div>
    );
  }

  // 2. Redirect unauthorized users to login, saving the original location for post-login redirection
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Render children components for authorized users
  return children;
};

export default ProtectedRoute;

/**
 * Line-by-line Explanation:
 * Line 7: Imports the React core module.
 * Line 8: Imports Navigate and useLocation hooks from React Router to enable routing operations.
 * Line 9: Imports the useAuth custom context consumer hook.
 * Line 14: Declares ProtectedRoute capturing React 'children'.
 * Line 15: Extracts active user state and verification loading flag from useAuth.
 * Line 16: Extracts the active URL state via useLocation.
 * Line 19-28: Renders a loading layout if the auth state is still initializing on mount.
 * Line 31-33: Redirects unauthorized requests to the `/login` route, appending the target URL to the history redirect stack.
 * Line 36: Mounts protected child components if authorization succeeds.
 */
