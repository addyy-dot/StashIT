/**
 * @file CreateListing.jsx
 * @description Why this file exists: To provide AIT students with a form interface to publish a new second-hand item listing on the marketplace.
 * @description Responsibility: Captures product text fields and file uploads (with dynamic client-side image previewing), constructs a multipart/form-data payload, submits it to the backend listings API via Axios, handles query loading/errors, and redirects to the user dashboard page on successful creation.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';
import { PlusCircle, Image as ImageIcon, IndianRupee, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const CATEGORIES = ['Books', 'Furniture', 'Electronics', 'Sports', 'Hostel Essentials', 'GiveAway Corner', 'Others'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];

const CreateListing = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Form parameters state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Books',
    condition: 'Good',
    image: null,
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic image size validation (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file is too large. Max size limit is 5MB.');
        return;
      }
      
      setFormData({
        ...formData,
        image: file,
      });

      // Generate local Object URL for immediate UI rendering preview
      setImagePreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { title, description, price, category, condition, image } = formData;

    // 1. Validate fields presence
    if (!title || !description || !price || !category || !condition) {
      setError('Please fill in all listing details.');
      setLoading(false);
      return;
    }

    // 2. Validate image file is present
    if (!image) {
      setError('Please select an item image file.');
      setLoading(false);
      return;
    }

    // 3. Construct standard Multipart FormData payload
    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('price', Number(price));
    data.append('category', category);
    data.append('condition', condition);
    data.append('image', image);

    try {
      await api.post('/listings', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showToast('Listing published successfully!', 'success');
      // Redirect to user dashboard after successful submission
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to submit listing:', err);
      setError(err.response?.data?.message || 'Failed to publish listing. Please try again.');
    } finally {
      setLoading(false);
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
            <h1 className="text-2xl font-bold text-slate-900">Publish New Listing</h1>
            <p className="text-sm text-slate-500 mt-1">Fill in the details to list your item on the marketplace.</p>
          </div>

          {/* Form Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Submit Form */}
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
                placeholder="e.g., Semester 3 Engineering Textbooks"
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>

            {/* Category and Condition Container */}
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
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee className="h-4 w-4 text-slate-450" />
                </div>
                <input
                  id="price"
                  name="price"
                  type="number"
                  required
                  min={0}
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="250"
                  className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                />
              </div>
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
                placeholder="Describe your item's condition, usage history, and negotiation details..."
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>

            {/* Image File Input and Preview Box */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Item Image</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Upload Action Card */}
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-primary-400 transition cursor-pointer relative bg-slate-50">
                  <div className="space-y-1 text-center flex flex-col items-center">
                    <ImageIcon className="mx-auto h-10 w-10 text-slate-400" />
                    <div className="flex text-sm text-slate-600">
                      <label
                        htmlFor="image-upload"
                        className="relative cursor-pointer rounded-md font-semibold text-primary-600 hover:text-primary-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, JPEG up to 5MB</p>
                  </div>
                </div>

                {/* Local Preview Box */}
                <div className="border border-slate-200 rounded-xl flex items-center justify-center bg-slate-50 overflow-hidden min-h-[140px] relative">
                  {imagePreviewUrl ? (
                    <img
                      src={imagePreviewUrl}
                      alt="Upload Preview"
                      className="w-full h-full object-cover max-h-[160px]"
                    />
                  ) : (
                    <p className="text-xs font-semibold text-slate-400">Image preview will appear here</p>
                  )}
                </div>

              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 border-t border-slate-150">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex justify-center items-center py-2 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed space-x-1.5"
              >
                <PlusCircle className="h-4 w-4" />
                <span>{loading ? 'Publishing...' : 'Publish Listing'}</span>
              </button>
            </div>

          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateListing;

/**
 * Line-by-line Explanation:
 * Line 7: Imports hooks.
 * Line 8: Imports router hooks.
 * Line 9-11: Imports custom layouts and API Axios controllers.
 * Line 12: Imports icons.
 * Line 14-15: Declares Categories and Wear Condition static helper arrays.
 * Line 17: Declares CreateListing page component.
 * Line 21-28: Sets local states.
 * Line 38-43: Handler syncing field parameter edits.
 * Line 45-63: Reads selected images. Runs size validation checks (<5MB), sets data state, and generates a client-side Object URL for local browser previewing.
 * Line 65: Submits forms.
 * Line 72-84: Runs validation checks to verify text and image parameters are set before submitting.
 * Line 87-94: Constructs a standard `FormData` payload. Appends raw text parameters and the binary file buffer.
 * Line 96-103: Pushes FormData to Axios POST `/listings` with `multipart/form-data` content type headers.
 * Line 106-109: Catch blocks route API error messages into error states.
 * Line 114: Mounts Navbar.
 * Line 130-220: Styled form mapping listing title, category select fields, wear state select lists, and price inputs with custom Rupee icons.
 * Line 222-259: Grid container presenting upload file cards beside the dynamic image preview panel.
 * Line 262-273: Action button showing loading status animations.
 */
