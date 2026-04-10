/**
 * @file App.jsx
 * @description Why this file exists: This is the main root component of the React application.
 * @description Responsibility: Wraps the entire application with the ToastProvider and AuthProvider states, establishes client-side routing pathways using React Router v6, maps public routes, and protects restricted views (listings CRUD & dashboard) using the ProtectedRoute guard.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import Page Views
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ListingDetail from './pages/ListingDetail';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Messages from './pages/Messages';
import Chat from './pages/Chat';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/giveaway" element={<Navigate to="/?category=GiveAway Corner" replace />} />

            {/* Protected Routes */}
            <Route
              path="/listings/create"
              element={
                <ProtectedRoute>
                  <CreateListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/listings/edit/:id"
              element={
                <ProtectedRoute>
                  <EditListing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages/:conversationId"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />

            {/* Fallback 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

/**
 * Line-by-line Explanation:
 * Line 7: Imports core React.
 * Line 8: Imports Router components from React Router v6.
 * Line 9: Imports global AuthProvider context wrapper.
 * Line 10: Imports ToastProvider wrapper.
 * Line 11: Imports ProtectedRoute guard.
 * Line 23: Root 'App' component declaration.
 * Line 25: Wraps the application inside ToastProvider.
 * Line 26: Wraps the application inside AuthProvider.
 * Line 27: Initializes the client-side Router.
 * Line 28: Wraps route paths in the Routes container.
 */
