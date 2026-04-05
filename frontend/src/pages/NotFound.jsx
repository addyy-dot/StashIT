/**
 * @file NotFound.jsx
 * @description Why this file exists: To provide a clean, styled 404 fallback page when paths are unrecognized.
 * @description Responsibility: Renders a structured page showing path errors and dynamic routes routing back to the homepage.
 */

import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4 p-8 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-6xl font-extrabold text-primary-500">404</h1>
        <h2 className="text-2xl font-bold text-slate-900">Page Not Found</h2>
        <p className="text-slate-500">The page you are looking for does not exist or has been moved.</p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

/**
 * Line-by-line Explanation:
 * Line 7: Imports React.
 * Line 8: Imports Link.
 * Line 10: Declares NotFound 404 page component.
 * Line 12-19: Renders large 404 code and heading.
 * Line 20-27: Provides redirection button leading back to the marketplace root.
 */
