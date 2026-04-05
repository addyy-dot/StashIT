/**
 * @file Messages.jsx
 * @description Why this file exists: To provide the messages inbox page where students can view all their active conversations.
 * @description Responsibility: Fetches conversations from the backend, shows listing details, identifies the other participant, and routes the student to specific chat threads.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, ChevronRight, Inbox, Tag } from 'lucide-react';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch conversations from the server
  const fetchConversations = async () => {
    try {
      const response = await api.get('/conversations');
      if (response.data.success) {
        setConversations(response.data.conversations);
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setError(err.response?.data?.message || 'Failed to load conversations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* Header Block */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <MessageSquare className="h-7 w-7 text-primary-500 stroke-[2.5]" />
            <span>Chat Inbox</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1.5">
            Connect directly with buyers and sellers on campus to discuss items, prices, and pick-up locations.
          </p>
        </div>

        {/* State Indicators */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium mt-4 text-sm">Loading conversations...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <p className="text-sm font-semibold text-red-500">{error}</p>
            <button
              onClick={fetchConversations}
              className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition"
            >
              Retry Loading
            </button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-xl mx-auto flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-150 flex items-center justify-center text-slate-400">
              <Inbox className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">No Conversations Yet</h3>
              <p className="text-sm text-slate-550 mt-1">
                You haven't initiated or received any messages yet. Start a chat by clicking "Message Seller" on any listing!
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          /* Conversation List */
          <div className="space-y-4">
            {conversations.map((conv) => {
              const otherParticipant = conv.participants.find(
                (p) => p && p._id && p._id.toString() !== (user?._id || user?.id)?.toString()
              ) || { name: 'Unknown User', email: '' };

              const item = conv.item || { title: 'Deleted Listing', price: 0, image: '', status: 'Unavailable' };

              return (
                <Link
                  key={conv._id}
                  to={`/messages/${conv._id}`}
                  className="block bg-white border border-slate-200 hover:border-primary-500 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* User and Listing Information */}
                    <div className="flex items-center space-x-4">
                      {/* Listing Image */}
                      <div className="h-16 w-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-450 bg-slate-100">
                            <Tag className="h-6 w-6" />
                          </div>
                        )}
                      </div>

                      {/* Conversation details */}
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-900">
                            {otherParticipant.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider px-1.5 py-0.5 bg-slate-150 rounded-md">
                            {otherParticipant._id === conv.item?.seller ? 'Seller' : 'Buyer'}
                          </span>
                        </div>
                        <h4 className="text-xs text-slate-500 line-clamp-1">
                          Listing: <span className="font-semibold text-slate-700">{item.title}</span>
                        </h4>
                        <p className="text-xs font-bold text-slate-800">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Meta Action */}
                    <div className="flex items-center justify-between sm:justify-end space-x-4 pt-3 sm:pt-0 border-t border-slate-150 sm:border-t-0">
                      <span className="text-xs text-slate-450 font-medium">
                        Last Active: {formatDate(conv.updatedAt)}
                      </span>
                      <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Messages;
