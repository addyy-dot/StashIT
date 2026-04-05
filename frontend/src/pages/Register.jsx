/**
 * @file Register.jsx
 * @description Why this file exists: To provide the user registration interface for AIT students to register for a UniThrift marketplace account.
 * @description Responsibility: Renders a form capture block for registering student details (name, regNo, year, email, password, confirmPassword), performs client-side field validation, makes registration requests to AuthContext, shows errors, and persists tokens to localstorage on successful signup.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UserPlus, User, Mail, Lock, ShieldCheck, Award, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    regNo: '',
    year: '1', // default to first year student
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, error, setError, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Redirect to marketplace home if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
    // Clean up global context auth errors on mount
    return () => {
      if (setError) setError(null);
    };
  }, [user, navigate, setError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSubmitting(true);

    const { name, regNo, year, email, password, confirmPassword } = formData;

    // 1. Basic validation: checking empty fields
    if (!name || !regNo || !year || !email || !password || !confirmPassword) {
      setValidationError('Please fill in all registration fields.');
      setSubmitting(false);
      return;
    }

    // 2. Client-side email domain check
    if (!/^[a-zA-Z0-9._%+-]+@aitpune\.edu\.in$/.test(email)) {
      setValidationError('Access restricted: Please register with your official @aitpune.edu.in college email.');
      setSubmitting(false);
      return;
    }

    // 3. Password length validation
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      setSubmitting(false);
      return;
    }

    // 4. Confirm password validation
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      setSubmitting(false);
      return;
    }

    // 5. Trigger context registration helper
    const result = await register(name, regNo, year, email, password);
    setSubmitting(false);

    if (result.success) {
      showToast('Registration successful! Welcome to StashIT.', 'success');
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600">
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Create Account</h2>
          <p className="mt-2 text-sm text-slate-500">
            Register with AIT Pune credentials
          </p>
        </div>

        {/* Form Error Banner */}
        {(validationError || error) && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-red-700">{validationError || error}</p>
          </div>
        )}

        {/* Registration Form */}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Registration Number & Year Container */}
            <div className="grid grid-cols-2 gap-4">
              {/* Registration Number */}
              <div>
                <label htmlFor="regNo" className="block text-sm font-medium text-slate-700">
                  Reg No (Roll No)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Award className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="regNo"
                    name="regNo"
                    type="text"
                    required
                    value={formData.regNo}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                    placeholder="20123"
                  />
                </div>
              </div>

              {/* Year Dropdown */}
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-slate-700">
                  Year of Study
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-slate-300 bg-white rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                >
                  <option value="1">1st Year (FE)</option>
                  <option value="2">2nd Year (SE)</option>
                  <option value="3">3rd Year (TE)</option>
                  <option value="4">4th Year (BE)</option>
                </select>
              </div>
            </div>

            {/* Email Address */}
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
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>

        {/* Redirect Footer */}
        <div className="text-center mt-4">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;

/**
 * Line-by-line Explanation:
 * Line 7: Imports hooks.
 * Line 8: Imports router utilities.
 * Line 9: Imports useAuth context hook.
 * Line 10: Imports icons.
 * Line 12: Declares Register page component.
 * Line 13-20: Declares registration state object for fields parameters.
 * Line 26: Custom hook bindings.
 * Line 29-37: Auto-redirects already-logged-in sessions.
 * Line 39-44: Shared input change handler updating matching state attributes.
 * Line 46: Form submit handler.
 * Line 54-58: Basic empty checks.
 * Line 61-65: RegEx checker forcing official college emails.
 * Line 68-72: Checks password length.
 * Line 75-79: Verifies that verifyPassword matches password.
 * Line 82: Invokes register helper inside AuthContext provider.
 * Line 103-108: Render alerts.
 * Line 114-131: Renders name input field.
 * Line 136-168: Grid layout rendering Registration Number and Class Study Year dropdown fields.
 * Line 171-188: Renders campus email.
 * Line 191-226: Renders Password and Password check verification input fields.
 * Line 230-237: Renders form action submit button.
 */
