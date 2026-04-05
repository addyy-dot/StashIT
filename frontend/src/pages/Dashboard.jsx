/**
 * @file Dashboard.jsx
 * @description Why this file exists: To provide AIT student sellers with a unified control panel to manage their listings.
 * @description Responsibility: Fetches active user listings from the server on mount, displays them in a grid, provides buttons to mark items as sold (via PATCH calls) or delete them (via DELETE calls) with a confirmation dialog, and routes users to the editing form.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';
import { LayoutDashboard, PlusCircle, CheckCircle, Edit, Trash2, Tag, AlertTriangle, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const { showToast } = useToast();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete Confirmation Modal States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch the current user's listings
  const fetchMyListings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/listings/my');
      setListings(response.data.listings);
    } catch (err) {
      console.error('Failed to fetch user listings:', err);
      setError('Failed to load your listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  // Mark listing as Sold handler
  const handleMarkAsSold = async (id) => {
    try {
      const response = await api.patch(`/listings/${id}/sold`);
      if (response.data.success) {
        showToast('Item status updated to Sold!', 'success');
        // Sync state: update the listing status in state directly
        setListings(
          listings.map((item) =>
            item._id === id ? { ...item, status: 'Sold' } : item
          )
        );
      }
    } catch (err) {
      console.error('Failed to mark listing as sold:', err);
      alert('Error: Unable to update listing status.');
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteTargetId(null);
    setShowDeleteModal(false);
  };

  // Handle actual listing delete action
  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      const response = await api.delete(`/listings/${deleteTargetId}`);
      if (response.data.success) {
        showToast('Listing deleted successfully!', 'success');
        // Remove listing from state directly
        setListings(listings.filter((item) => item._id !== deleteTargetId));
        closeDeleteModal();
      }
    } catch (err) {
      console.error('Failed to delete listing:', err);
      alert('Error: Unable to delete listing.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        {/* Dashboard Title & Actions header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5 mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Seller Dashboard</h1>
              <p className="text-sm text-slate-500 mt-0.5">Manage your active listings and sales status.</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/listings/create"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition space-x-1.5"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add New Listing</span>
            </Link>
          </div>
        </div>

        {/* Content Views */}
        {loading ? (
          // Loading Spinner
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium mt-4 text-sm">Loading dashboard details...</p>
          </div>
        ) : error ? (
          // Error alert
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md max-w-xl mx-auto flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        ) : listings.length === 0 ? (
          // Empty State Layout
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 max-w-xl mx-auto shadow-sm">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 text-slate-400 mb-4">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Listings Yet</h3>
            <p className="text-sm text-slate-500 mt-1">
              You haven't listed any items for sale. Start earning by publishing your first listing!
            </p>
            <div className="mt-6">
              <Link
                to="/listings/create"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition"
              >
                + Create First Listing
              </Link>
            </div>
          </div>
        ) : (
          // Listings Grid Manager
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                {/* Product Cover image */}
                <div className="relative aspect-video w-full bg-slate-100 overflow-hidden border-b border-slate-150">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                  {/* Status Overlay */}
                  <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm ${
                      item.status === 'Available'
                        ? 'bg-emerald-550/90 text-white'
                        : 'bg-slate-950/90 text-white'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Info Text Area */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1 text-xs font-semibold text-slate-450">
                      <Tag className="h-3.5 w-3.5 mr-0.5" />
                      <span>{item.category}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-lg font-black text-slate-900">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Operational Action CTA Buttons */}
                  <div className="flex flex-col space-y-2 pt-3 border-t border-slate-150">
                    
                    {/* Conditional: Mark as Sold */}
                    {item.status === 'Available' && (
                      <button
                        onClick={() => handleMarkAsSold(item._id)}
                        className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition shadow-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-emerald-100" />
                        <span>Mark as Sold</span>
                      </button>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      {/* Edit Button */}
                      <Link
                        to={`/listings/edit/${item._id}`}
                        className="flex items-center justify-center space-x-1 py-2 px-3 bg-slate-150 hover:bg-slate-200 border border-slate-200 text-slate-800 hover:text-primary-500 font-bold text-xs rounded-lg transition"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Link>

                      {/* Delete Button */}
                      <button
                        onClick={() => openDeleteModal(item._id)}
                        className="flex items-center justify-center space-x-1 py-2 px-3 bg-red-950/20 hover:bg-red-900/40 border border-red-900/30 hover:border-red-900/60 text-red-400 hover:text-red-300 font-bold text-xs rounded-lg transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      {/* Delete Confirmation Modal Overlay */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={closeDeleteModal}></div>

          {/* Modal Content container */}
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-100 transform transition-all text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-650">
              <AlertTriangle className="h-6 w-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Delete Listing</h3>
              <p className="text-sm text-slate-550 leading-relaxed">
                Are you sure you want to permanently delete this item listing? This action will remove the listing and purge its image from storage. It cannot be undone.
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="w-1/2 py-2 px-4 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="w-1/2 py-2 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-red-650 hover:bg-red-750 transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;

/**
 * Line-by-line Explanation:
 * Line 7: Imports react hooks.
 * Line 8: Imports Link.
 * Line 9-11: Imports layout elements and api Axios utility.
 * Line 12: Imports icons.
 * Line 14: Declares Dashboard component.
 * Line 19-21: Declares delete confirmation dialog states.
 * Line 24: Async method querying current user's listings GET `/listings/my`.
 * Line 43: Runs hook fetching user items list on component mount.
 * Line 47: Mark listing as sold handler. Issues PATCH `/listings/:id/sold`. Updates state items list.
 * Line 63: Modal helper methods. Opens target delete dialogs.
 * Line 76: Handles item deletion confirmation. Requests DELETE `/listings/:id`. Deletes listing and clears delete target IDs on success.
 * Line 95: Mounts Navbar.
 * Line 98-114: Dashboard title section and create action trigger shortcuts.
 * Line 117-142: Renders loading states and empty state layouts.
 * Line 144-213: Maps the listings grid. Displays pricing, status labels (Available/Sold), and management buttons.
 * Line 219-250: Styled delete confirmation warning modal overlay popup.
 * Line 252: Mounts Footer.
 */
