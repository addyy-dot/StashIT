/**
 * @file Navbar.jsx
 * @description Why this file exists: To serve as the global sticky navigation header for the application.
 * @description Responsibility: Renders brand logo links, displays navigation options based on authorization state (hides/shows dashboard links), handles user logging states, and renders profile headers.
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, User, LogOut, LayoutDashboard, MessageSquare, Home, Plus, Gift } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Brand Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-primary-600 hover:opacity-90 transition">
              <ShoppingBag className="h-6 w-6 stroke-[2.5]" />
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Stash<span className="text-primary-600">IT</span>
              </span>
            </Link>
          </div>

          {/* Navigation Action Anchors */}
          <div className="flex items-center space-x-4">
            
            {/* Marketplace Link */}
            <Link
              to="/"
              className="flex items-center space-x-1.5 text-sm font-medium text-slate-600 hover:text-primary-600 px-3 py-2 rounded-lg transition hover:bg-slate-50"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Marketplace</span>
            </Link>

            {/* GiveAway Link for Guest Users */}
            {!user && (
              <Link
                to="/?category=GiveAway Corner"
                className="flex items-center space-x-1.5 text-sm font-medium text-slate-600 hover:text-primary-600 px-3 py-2 rounded-lg transition hover:bg-slate-50"
              >
                <Gift className="h-4 w-4 text-teal-500" />
                <span className="hidden sm:inline">GiveAway</span>
              </Link>
            )}

            
            {user ? (
              // Authenticated User UI Items
              <>
                {/* Dashboard Button */}
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1.5 text-sm font-medium text-slate-600 hover:text-primary-600 px-3 py-2 rounded-lg transition hover:bg-slate-50"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">My Listings</span>
                </Link>

                {/* Messages Button */}
                <Link
                  to="/messages"
                  className="flex items-center space-x-1.5 text-sm font-medium text-slate-600 hover:text-primary-600 px-3 py-2 rounded-lg transition hover:bg-slate-50"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Messages</span>
                </Link>

                {/* GiveAway Link for Authenticated Users */}
                <Link
                  to="/?category=GiveAway Corner"
                  className="flex items-center space-x-1.5 text-sm font-medium text-slate-600 hover:text-primary-600 px-3 py-2 rounded-lg transition hover:bg-slate-50"
                >
                  <Gift className="h-4 w-4 text-teal-500" />
                  <span className="hidden sm:inline">GiveAway</span>
                </Link>

                {/* Sell Item CTA Button */}
                <Link
                  to="/listings/create"
                  className="inline-flex items-center justify-center px-3.5 py-1.5 border border-transparent text-sm font-extrabold rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition space-x-1 hover:scale-[1.03]"
                >
                  <Plus className="h-4 w-4 stroke-[3]" />
                  <span>Sell Item</span>
                </Link>

                {/* Profile Banner */}
                <div className="flex items-center space-x-2 border-l border-slate-200 pl-4 py-1">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-sm font-semibold text-slate-700">
                    {user.name}
                  </span>
                </div>

                {/* Sign Out Trigger */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm font-medium text-red-600 hover:text-red-700 px-3 py-2 rounded-lg transition hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              // Unauthenticated Guest UI Items
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-700 hover:text-primary-600 px-3 py-2 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition"
                >
                  Register
                </Link>
              </>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

/**
 * Line-by-line Explanation:
 * Line 7: Imports React.
 * Line 8: Imports Router links.
 * Line 9: Imports global authentication custom hook.
 * Line 10: Imports icons.
 * Line 12: Declares Navbar component.
 * Line 16-19: Logout handler, calling logout logic and routing users to login page.
 * Line 22: Makes the navigation header sticky (`sticky top-0 z-50`) to keep it visible while scrolling.
 * Line 27-34: Brand logo wrapper.
 * Line 41-48: Renders link routing to My Listings page. Hidden on mobile viewports for compact screen layout.
 * Line 51-58: Renders circular avatar profile badge with first letter of user name.
 * Line 61-67: Renders red-styled Sign Out button triggering the logout method.
 * Line 71-85: Renders default guest action buttons for non-logged-in sessions.
 */
