/**
 * @file ToastContext.jsx
 * @description Why this file exists: To provide a global, reusable Toast notification system across the application for success/error feedback.
 * @description Responsibility: Stores active toast messages and alert states, exports a trigger hook (`showToast`) to launch timed banners, and displays an animated, responsive overlay toast container in the DOM layout.
 */

import React, { createContext, useContext, useState } from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  /**
   * Triggers a toast notification alert.
   * @param {string} message - Message text.
   * @param {'success'|'error'} type - Style modifier.
   */
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    // Auto-dismiss the alert banner after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const closeToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-55 max-w-sm w-full bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden transform animate-bounce-short transition duration-300">
          <div className="p-4 flex items-start space-x-3">
            {/* Conditional Status Icons */}
            {toast.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            )}

            {/* Content text */}
            <div className="flex-grow">
              <p className="text-xs font-bold text-slate-900">
                {toast.type === 'success' ? 'Success' : 'Error'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{toast.message}</p>
            </div>

            {/* Manual Dismiss Button */}
            <button
              onClick={closeToast}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {/* Progress Indicator line */}
          <div
            className={`h-1 transition-all duration-3000 ease-linear ${
              toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
            }`}
            style={{ animation: 'progress 3s linear' }}
          ></div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be consumed within a ToastProvider');
  }
  return context;
};

/**
 * Line-by-line Explanation:
 * Line 7: Imports core react.
 * Line 8: Imports icons.
 * Line 10: Creates ToastContext.
 * Line 12: Declares ToastProvider.
 * Line 19: Exposes `showToast` method setting message parameters, and triggers `setTimeout` logic clearing target alerts after 3 seconds.
 * Line 30-74: Renders floating alert overlays at the bottom-right viewport container (`fixed bottom-5 right-5 z-55`) on active toast notifications.
 * Line 77: Exposes `useToast` hook for simple consumer actions.
 */
