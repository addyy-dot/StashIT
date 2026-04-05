/**
 * @file Chat.jsx
 * @description Why this file exists: To provide the active chat window page between buyer and seller.
 * @description Responsibility: Loads message history from the backend, displays message threads with custom color schemes for sender/recipient, supports sending new messages, and includes manual refresh functionality.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Send, RefreshCw, ArrowLeft, Tag, MessageSquare } from 'lucide-react';

const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);

  // Scroll to the bottom of the chat list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch conversation and messages on mount or manual refresh
  const fetchChatData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      // 1. Fetch messages
      const msgResponse = await api.get(`/messages/${conversationId}`);
      if (msgResponse.data.success) {
        setMessages(msgResponse.data.messages);
      }

      // 2. Fetch all user conversations to find metadata of this specific conversation
      const convsResponse = await api.get('/conversations');
      if (convsResponse.data.success) {
        const found = convsResponse.data.conversations.find((c) => c._id === conversationId);
        if (found) {
          setConversation(found);
        } else {
          setError('Conversation not found in your inbox.');
        }
      }
    } catch (err) {
      console.error('Failed to load chat data:', err);
      setError(err.response?.data?.message || 'Failed to retrieve chat history.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChatData(true);
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchChatData(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    setSending(true);
    const textToSend = newMessageText.trim();
    setNewMessageText(''); // Optimistically clear input

    try {
      const response = await api.post('/messages', {
        conversationId,
        text: textToSend,
      });

      if (response.data.success) {
        // Append new message directly to state
        setMessages((prev) => [...prev, response.data.message]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      showToast(err.response?.data?.message || 'Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Identify who the other participant is
  const otherParticipant = conversation?.participants?.find(
    (p) => p && p._id && p._id.toString() !== (user?._id || user?.id)?.toString()
  ) || { name: 'Chat Member', email: '' };

  const listingItem = conversation?.item || { title: 'Deleted Listing', price: 0, image: '', status: 'Unavailable' };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow flex flex-col">
        {/* Navigation / Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/messages')}
            className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-650 hover:text-primary-600 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Inbox</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-150 border border-slate-200 text-slate-800 hover:text-primary-500 hover:border-primary-500 font-bold text-xs rounded-lg transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync'}</span>
          </button>
        </div>

        {/* Chat Interface Container */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm flex-grow">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium mt-4 text-sm">Loading chat room...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex-grow flex flex-col items-center justify-center">
            <p className="text-sm font-semibold text-red-500 mb-4">{error}</p>
            <button
              onClick={() => fetchChatData(true)}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition"
            >
              Retry Loading
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px] flex-grow">
            {/* Listing details header banner */}
            <div className="bg-slate-950 p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-lg bg-slate-850 border border-slate-200 overflow-hidden flex-shrink-0">
                  {listingItem.image ? (
                    <img
                      src={listingItem.image}
                      alt={listingItem.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-450 bg-slate-100">
                      <Tag className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {listingItem.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-semibold text-slate-800">
                      ₹{listingItem.price.toLocaleString('en-IN')}
                    </span>
                    <span>•</span>
                    <span>Chatting with <span className="font-bold text-slate-900">{otherParticipant.name}</span></span>
                  </div>
                </div>
              </div>

              {/* View listing link */}
              {conversation?.item && (
                <Link
                  to={`/listings/${listingItem._id}`}
                  className="text-xs font-semibold text-primary-500 hover:text-primary-600 border border-primary-500/30 hover:border-primary-500 px-3 py-1.5 rounded-lg transition"
                >
                  View Listing
                </Link>
              )}
            </div>

            {/* Messages Scroll viewport */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 p-6">
                  <MessageSquare className="h-8 w-8 text-slate-300" />
                  <p className="text-sm font-medium text-slate-500">No messages yet.</p>
                  <p className="text-xs text-slate-400 text-center max-w-xs">
                    Introduce yourself and align on price, pickup location or time to grab this item!
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = (msg.sender?._id || msg.sender)?.toString() === (user?._id || user?.id)?.toString();
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                          isMe
                            ? 'bg-primary-600 text-white rounded-tr-none'
                            : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none'
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{msg.text}</p>
                        <div
                          className={`text-[9px] mt-1 text-right font-medium ${
                            isMe ? 'text-slate-900/60' : 'text-slate-450'
                          }`}
                        >
                          {formatDate(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Form messaging input deck */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-slate-200 bg-white flex items-center space-x-2"
            >
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Type your message here..."
                disabled={sending}
                className="flex-grow bg-slate-50 border border-slate-250 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500 transition"
              />
              <button
                type="submit"
                disabled={!newMessageText.trim() || sending}
                className="p-2.5 rounded-xl text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 shadow-sm transition flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Chat;
