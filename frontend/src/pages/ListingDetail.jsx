/**
 * @file ListingDetail.jsx
 * @description Why this file exists: To display detailed information of a single item listing and connect buyers to student sellers.
 * @description Responsibility: Fetches single listing records by ID parameters from backend database, renders product details (images, descriptions, category attributes), display verified seller profile details (name, email, roll number, study class), and provides student-contact mail links.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Tag, User, Mail, ArrowLeft, AlertTriangle, MessageSquare } from 'lucide-react';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isSeller = user && listing && user._id === listing.seller._id;

  const handleMessageSeller = async () => {
    if (!user) {
      showToast('Please sign in to message the seller', 'error');
      navigate('/login', { state: { from: { pathname: `/listings/${id}` } } });
      return;
    }
    try {
      const response = await api.post('/conversations', {
        sellerId: listing.seller._id,
        listingId: listing._id,
      });
      if (response.data.success) {
        const conversationId = response.data.conversation._id;
        navigate(`/messages/${conversationId}`);
      }
    } catch (err) {
      console.error('Failed to start conversation:', err);
      showToast(err.response?.data?.message || 'Failed to start conversation', 'error');
    }
  };

  // Fetch listing details from the server when component mounts
  useEffect(() => {
    const fetchListingDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/listings/${id}`);
        setListing(response.data.listing);
      } catch (err) {
        console.error('Failed to fetch listing detail:', err);
        setError(err.response?.data?.message || 'Listing not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetail();
  }, [id]);

  const getConditionColor = (cond) => {
    switch (cond) {
      case 'New':
        return 'bg-emerald-100 text-emerald-800 border-emerald-250';
      case 'Like New':
        return 'bg-teal-100 text-teal-800 border-teal-250';
      case 'Good':
        return 'bg-sky-100 text-sky-800 border-sky-250';
      case 'Fair':
        return 'bg-amber-100 text-amber-800 border-amber-250';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        {/* Back Link Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-650 hover:text-primary-600 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Dynamic State Layout Renderings */}
        {loading ? (
          // Loading spinner
          <div className="py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium mt-4 text-sm">Loading details...</p>
          </div>
        ) : error ? (
          // Error Display
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-xl mx-auto">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-500 mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Error Loading Listing</h3>
            <p className="text-sm text-slate-500 mt-1">{error}</p>
            <Link to="/" className="mt-6 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700 underline">
              Return to Marketplace
            </Link>
          </div>
        ) : !listing ? (
          // No Listing Found Layout
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-xl mx-auto">
            <h3 className="text-lg font-bold text-slate-900">Listing Not Found</h3>
            <p className="text-sm text-slate-500 mt-1">This listing might have been removed by the owner.</p>
          </div>
        ) : (
          // Content Layout
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8">
            
            {/* Product Image Panel (Left) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="aspect-video w-full rounded-xl bg-slate-100 overflow-hidden relative border border-slate-250">
                {listing.status === 'Sold' && (
                  <div className="absolute top-4 right-4 z-10 bg-slate-950/90 text-white font-extrabold text-sm uppercase px-3 py-1 rounded-full backdrop-blur-sm tracking-wider">
                    Sold
                  </div>
                )}
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Product Details Panel (Right) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              
              {/* Product Info Block */}
              <div className="space-y-4">
                
                {/* Badges Container */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                    <Tag className="h-3.5 w-3.5 mr-0.5 text-slate-400" />
                    <span>{listing.category}</span>
                  </span>
                  <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-lg border ${getConditionColor(listing.condition)}`}>
                    {listing.condition}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {listing.title}
                </h1>

                {/* Price */}
                <div className="flex flex-col">
                  <p className="text-3xl font-black text-slate-900">
                    ₹{listing.price.toLocaleString('en-IN')}
                  </p>
                  {listing.price === 0 && (
                    <span className="text-sm font-bold text-primary-500 uppercase tracking-wider mt-1 select-none">
                      FREE
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="pt-4 border-t border-slate-150">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-sm text-slate-650 leading-relaxed whitespace-pre-wrap">
                    {listing.description}
                  </p>
                </div>

              </div>

              {/* Seller Contact Card Block */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4 mt-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                  <h3 className="text-sm font-bold text-slate-800">
                    Seller Details
                  </h3>
                </div>

                {/* Seller Details Info */}
                <div className="space-y-2 text-xs text-slate-650">
                  <p>
                    <span className="font-semibold text-slate-550 mr-1">Name:</span>
                    <span className="font-bold text-slate-800">{listing.seller.name}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-slate-550 mr-1">Study Year:</span>
                    <span className="font-bold text-slate-800">
                      {listing.seller.year} Year (
                      {listing.seller.year === 1
                        ? 'FE'
                        : listing.seller.year === 2
                        ? 'SE'
                        : listing.seller.year === 3
                        ? 'TE'
                        : 'BE'}
                      )
                    </span>
                  </p>
                </div>

                {/* Contact CTA Button */}
                <div className="pt-2">
                  {listing.status === 'Sold' ? (
                    <button
                      disabled
                      className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-slate-300 text-slate-550 text-sm font-bold rounded-lg cursor-not-allowed transition"
                    >
                      Item Sold
                    </button>
                  ) : (
                    <div className="space-y-2">
                      {!isSeller && (
                        <button
                          onClick={handleMessageSeller}
                          className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-lg transition shadow-sm space-x-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Message Seller</span>
                        </button>
                      )}
                      <a
                        href={`mailto:${listing.seller.email}?subject=Interested in your StashIT listing: ${encodeURIComponent(listing.title)}`}
                        className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-slate-150 hover:bg-slate-200 border border-slate-200 text-slate-800 hover:text-primary-500 font-bold text-sm rounded-lg transition shadow-sm space-x-2"
                      >
                        <Mail className="h-4 w-4" />
                        <span>Email Seller</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default ListingDetail;

/**
 * Line-by-line Explanation:
 * Line 7: Imports hooks.
 * Line 8: Imports useParams / useNavigate / Link router helpers.
 * Line 9-11: Imports custom layouts and HTTP configurations.
 * Line 12: Imports icons.
 * Line 14: Declares ListingDetail component.
 * Line 15: Extracts the Dynamic parameter ID from the URL path.
 * Line 21-36: Runs initialization hook querying dynamic parameters endpoint GET `/listings/:id` on mount.
 * Line 38-51: Selects badge styling depending on wear states.
 * Line 59: Navigates back one step in route history via `navigate(-1)`.
 * Line 69-73: Displays loading indicators.
 * Line 75-87: Styled error layout fallback when records are missing.
 * Line 102-140: Product Details UI wrapper. Fits item banner cover images and status cards side-by-side using grids.
 * Line 161-197: Verified Seller contact card. Renders name strings, student study-year decodes, and a mailto contact link.
 */
