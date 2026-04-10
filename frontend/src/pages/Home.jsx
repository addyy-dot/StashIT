/**
 * @file Home.jsx
 * @description Why this file exists: To serve as the primary landing page and product catalog browser of the UniThrift campus marketplace.
 * @description Responsibility: Integrates navigation and footer structures, fetches listings from the backend API, provides title-search form queries, category filter tab headers, loading spinners, empty search pages, and paging buttons.
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ListingCard from '../components/ListingCard';
import api from '../utils/api';
import { Search, SlidersHorizontal, BookOpen, AlertTriangle, Gift } from 'lucide-react';

const CATEGORIES = ['All', 'Books', 'Furniture', 'Electronics', 'Sports', 'Hostel Essentials', 'Others'];

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search and Filter States
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch listings from backend whenever category, searchQuery or currentPage changes
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {
          page: currentPage,
          limit: 8, // Fetch 8 items per page
          status: 'Available', // By default, only show items that are still available
        };

        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }

        if (searchQuery) {
          params.search = searchQuery;
        }

        const response = await api.get('/listings', { params });
        const { listings: data, total, pages } = response.data;
        
        setListings(data);
        setTotalItems(total);
        setTotalPages(pages);
      } catch (err) {
        console.error('Failed to retrieve listings:', err);
        setError('Unable to load listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [selectedCategory, searchQuery, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentPage(1); // Reset page to 1 on search queries
  };

  // Sync selectedCategory with searchParams changes (e.g. from Navbar link click)
  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'All';
    if (urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset page to 1 on filter changes
    
    // Sync category URL param
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page transitions
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* GiveAway Corner Info / Announcement Bar */}
      {selectedCategory === 'GiveAway Corner' ? (
        <div className="w-full bg-teal-950/20 border-b border-teal-500/10 text-center py-1.5 px-4 text-[10px] sm:text-xs font-bold text-teal-400 select-none flex items-center justify-center gap-1.5 shadow-inner">
          <Gift className="h-3 w-3 animate-pulse text-teal-400" />
          <span>Grab textbooks, furniture, or hostel essentials donated by your seniors completely free of cost (₹0).</span>
        </div>
      ) : (
        <button
          onClick={() => handleCategorySelect('GiveAway Corner')}
          className="w-full bg-teal-950/15 hover:bg-teal-950/25 border-b border-teal-500/10 text-center py-1.5 px-4 text-[10px] sm:text-xs font-bold text-teal-450 hover:text-teal-350 select-none flex items-center justify-center gap-1.5 transition shadow-inner"
        >
          <Gift className="h-3 w-3 animate-bounce text-teal-450" />
          <span>Grab textbooks, furniture, or hostel essentials donated by your seniors completely free of cost (₹0). Visit GiveAway Corner →</span>
        </button>
      )}

      {/* Hero Search Section */}
      <header className="bg-slate-950 text-white py-7 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h1 className="text-2xl font-extrabold sm:text-3xl md:text-4xl tracking-tight">
            Find What You Need on Campus
          </h1>
          <p className="text-slate-450 text-sm sm:text-base max-w-2xl mx-auto">
            Buy, Sell & Donate within the AIT Community
          </p>

          {/* Search Bar Form */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mt-6">
            <div className="relative flex items-center bg-white rounded-xl shadow-lg overflow-hidden p-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for books, study tables, electronics..."
                className="block w-full pl-11 pr-24 py-3 bg-white text-slate-900 border-none rounded-xl focus:outline-none text-sm placeholder-slate-400"
              />
              <button
                type="submit"
                className="absolute right-1 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition shadow-sm"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </header>

      {/* Main Marketplace Catalog Grid */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        {/* Category Tab Scrollbars */}
        <section className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          <div className="flex space-x-2 min-w-max">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Catalog Results Grid */}
        <section>
          {loading ? (
            // Loading Spinner Page
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium mt-4 text-sm">Searching listings...</p>
            </div>
          ) : error ? (
            // Error Alert Block
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md max-w-xl mx-auto flex items-start space-x-3 mt-10">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          ) : listings.length === 0 ? (
            // Empty Search Layout
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-150 p-8 max-w-xl mx-auto">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 text-slate-450 mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Listings Found</h3>
              <p className="text-sm text-slate-500 mt-1">
                We couldn't find any listings matching your category or search query.
              </p>
              {(searchQuery || selectedCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSearchInput('');
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="mt-6 text-sm font-semibold text-primary-600 hover:text-primary-700 underline"
                >
                  Reset all filters
                </button>
              )}
            </div>
          ) : (
            // Catalog Cards Grid
            <>
              {/* Header section displaying active category label */}
              {selectedCategory === 'GiveAway Corner' ? (
                <div className="mb-6 border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Gift className="text-primary-500 h-5.5 w-5.5 animate-pulse" />
                      <span>GiveAway Corner 🎁</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      All listings in this section are completely free of charge (₹0). Perfect for student needs!
                    </p>
                  </div>
                  <button
                    onClick={() => handleCategorySelect('All')}
                    className="text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline inline-flex items-center"
                  >
                    Go back to Marketplace
                  </button>
                </div>
              ) : (
                /* Recently Added Section Header Badge */
                <div className="flex items-center mb-6">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-150 border border-slate-200/30 text-slate-800 shadow-sm select-none">
                    Recently Added
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-12">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="inline-flex items-center justify-center px-4 py-2 border border-slate-350 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 transition"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="inline-flex items-center justify-center px-4 py-2 border border-slate-350 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 transition"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs text-slate-500">
                        Showing page <span className="font-bold text-slate-750">{currentPage}</span> of{' '}
                        <span className="font-bold text-slate-755">{totalPages}</span> pages ({totalItems} total items)
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-slate-300 bg-white text-xs font-semibold text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition"
                        >
                          Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                          <button
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={`relative inline-flex items-center px-4 py-2 border text-xs font-semibold transition ${
                              currentPage === p
                                ? 'z-10 bg-primary-600 border-primary-600 text-white'
                                : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-slate-300 bg-white text-xs font-semibold text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Home;

/**
 * Line-by-line Explanation:
 * Line 7: Imports react hooks.
 * Line 8-11: Imports components and Axios instances.
 * Line 12: Imports icons.
 * Line 14: Declares standard array list representing core product categories.
 * Line 16: Declares Home component.
 * Line 28: Runs hook querying backend catalog listings upon state modifications.
 * Line 33-36: Sets pagination query constraints.
 * Line 47: Triggers Axios GET `/listings`. Retrieves paginated list matching parameters.
 * Line 64: Form submission handler to update the target search keyword.
 * Line 70: Resets page counts to 1 and modifies category filters on select tabs.
 * Line 75: Page transitions helper. Scrolls page back to header dynamically using `window.scrollTo`.
 * Line 86: Mounts Navbar header.
 * Line 89-114: Renders hero image section banner with text search forms.
 * Line 117-195: Main catalog viewer wrapper displaying horizontal category tab sliders.
 * Line 200-245: Integrates loading spinners, database query error messages, empty catalogs, and ListingCard lists.
 * Line 248-290: Standard desktop and mobile responsive pagination control panels.
 * Line 295: Mounts Footer.
 */
