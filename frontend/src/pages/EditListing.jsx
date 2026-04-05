/**
 * @file EditListing.jsx
 * @description Why this file exists: To provide AIT students with a form layout to edit their existing item listings.
 * @description Responsibility: Fetches existing item listing fields by ID on mount, pre-populates form input fields, validates user modifications, submits a PUT request to update listing text fields, handles query state transitions, and redirects back to the dashboard page on success.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';
import { Save, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['Books', 'Furniture', 'Electronics', 'Sports', 'Hostel Essentials', 'Others'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Form parameters state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Books',
    condition: 'Good',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch listing details on mount to pre-fill the form fields
  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/listings/${id}`);
        const { title, description, price, category, condition } = response.data.listing;
        setFormData({
          title,
          description,
          price: String(price),
          category,
          condition,
        });
      } catch (err) {
        console.error('Failed to retrieve listing details for editing:', err);
        setError(err.response?.data?.message || 'Listing not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const { title, description, price, category, condition } = formData;

    // 1. Basic validation
    if (!title || !description || !price || !category || !condition) {
      setError('Please fill in all listing details.');
      setSubmitting(false);
      return;
    }

    try {
      // 2. Submit PUT request to update listing text fields
      await api.put(`/listings/${id}`, {
        title,
        description,
        price: Number(price),
        category,
        condition,
      });
      showToast('Listing updated successfully!', 'success');
      // Redirect back to seller dashboard after successful modification
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to update listing:', err);
      setError(err.response?.data?.message || 'Failed to update listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link to="/dashboard" className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-650 hover:text-primary-600 transition">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Card Form Wrapper */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8">
          
          <div className="border-b border-slate-150 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Edit Listing</h1>
            <p className="text-sm text-slate-500 mt-1">Modify the listing attributes and update your post.</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Loading state indicator */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium mt-4 text-xs">Fetching listing details...</p>
            </div>
          ) : (
            // Edit Form
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-bold text-slate-700">
                  Listing Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  maxLength={100}
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>

              {/* Category & Condition Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Category Select */}
                <div>
                  <label htmlFor="category" className="block text-sm font-bold text-slate-700">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-slate-300 bg-white rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition Select */}
                <div>
                  <label htmlFor="condition" className="block text-sm font-bold text-slate-700">
                    Condition
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-slate-300 bg-white rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  >
                    {CONDITIONS.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Input */}
              <div>
                <label htmlFor="price" className="block text-sm font-bold text-slate-700">
                  Price (INR)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  required
                  min={0}
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>

              {/* Description Input */}
              <div>
                <label htmlFor="description" className="block text-sm font-bold text-slate-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-150">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto flex justify-center items-center py-2 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed space-x-1.5"
                >
                  <Save className="h-4 w-4" />
                  <span>{submitting ? 'Saving Changes...' : 'Save Changes'}</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditListing;

/**
 * Line-by-line Explanation:
 * Line 7: Imports hooks.
 * Line 8: Imports router param hook.
 * Line 9-11: Imports layout elements and api Axios controllers.
 * Line 12: Imports icons.
 * Line 14-15: Categories and Conditions static helper lists.
 * Line 17: Declares EditListing page component.
 * Line 18: Extracts dynamic listing ID parameter from URL paths.
 * Line 22-28: Declares local states.
 * Line 34-53: Hook triggers GET `/listings/:id` on mount to fetch active listing details and pre-fill form fields.
 * Line 56-61: Custom state synchronizer.
 * Line 63: Form submission handler.
 * Line 69-73: Verifies inputs presence.
 * Line 77-84: Sends PUT `/listings/:id` containing modified attributes.
 * Line 95: Mounts Navbar.
 * Line 122: Renders loading spinner if details query is unresolved.
 * Line 128-198: Maps inputs pre-filled with listing parameters.
 * Line 201-212: Action button displaying save status animation.
 */
