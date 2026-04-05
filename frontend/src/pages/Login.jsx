/**
 * @file Login.jsx
 * @description Why this file exists: To provide the authentication interface for existing student users to log in to the UniThrift marketplace.
 * @description Responsibility: Handles email and password inputs, performs validation on form submission (such as checking email domain), runs the login context method, manages loading states, renders error alerts, and redirects users to their target destination or dashboard page on successful login.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, error, setError, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine redirection target (fallback to marketplace home)
  const from = location.state?.from?.pathname || '/';

  // Redirect to target path if user is already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
    // Clean up global context auth errors on mount
    return () => {
      if (setError) setError(null);
    };
  }, [user, navigate, from, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSubmitting(true);

    // 1. Basic validation checks
    if (!email || !password) {
      setValidationError('Please fill in all input fields.');
      setSubmitting(false);
      return;
    }

    // 2. Validate campus email domain on client side
    if (!/^[a-zA-Z0-9._%+-]+@aitpune\.edu\.in$/.test(email)) {
      setValidationError('Access restricted: Please enter your official @aitpune.edu.in college email.');
      setSubmitting(false);
      return;
    }

    // 3. Trigger context login call
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      showToast('Login successful! Welcome back to StashIT.', 'success');
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600">
            <LogIn className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Sign In</h2>
          <p className="mt-2 text-sm text-slate-500">
            Access your campusthrift student profile
          </p>
        </div>

        {/* Form Error Display */}
        {(validationError || error) && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-red-700">{validationError || error}</p>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                AIT Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder="rollno_branch@aitpune.edu.in"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* Redirect Footer */}
        <div className="text-center mt-4">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;

/**
 * Line-by-line Explanation:
 * Line 7: Imports core React and hooks.
 * Line 8: Imports Router hooks and Link components.
 * Line 9: Imports global useAuth custom hook.
 * Line 10: Imports icons from Lucide React to create a premium UI.
 * Line 12: Declares Login page component.
 * Line 18: Accesses global login actions, user state, and auth context properties.
 * Line 26-37: Auto-redirects already-authenticated users. Cleans up errors on component mounting.
 * Line 39: Declares form handler.
 * Line 45-49: Validates parameters. If fields are empty, sets validation errors state.
 * Line 52-56: Performs regex check. Email must strictly end with `@aitpune.edu.in`.
 * Line 59: Calls context `login()` action.
 * Line 80-85: Renders form validation and server-side errors inside a styled red alert banner.
 * Line 95-112: Renders Email input field with search icons and placeholder values.
 * Line 115-132: Renders Password field.
 * Line 136-143: Renders Submit button with active loading states.
 */
