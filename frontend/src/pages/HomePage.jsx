import React, { useState, useEffect } from 'react';
import SearchFilterBar from '../components/SearchFilterBar';
import PropertyCard from '../components/PropertyCard';
import { Building2, Search, Sparkles, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    minRent: '',
    maxRent: '',
    bedrooms: '',
    propertyType: 'All',
    sortBy: 'newest'
  });

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.minRent) params.append('minRent', filters.minRent);
      if (filters.maxRent) params.append('maxRent', filters.maxRent);
      if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
      if (filters.propertyType && filters.propertyType !== 'All') params.append('propertyType', filters.propertyType);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      const res = await fetch(`/api/properties?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProperties(data.properties);
      } else {
        setError(data.message || 'Failed to fetch properties');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server. Please verify the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filters.sortBy, filters.propertyType, filters.bedrooms]);

  const handleSearch = () => {
    fetchProperties();
  };

  const handleReset = () => {
    setFilters({
      search: '',
      minRent: '',
      maxRent: '',
      bedrooms: '',
      propertyType: 'All',
      sortBy: 'newest'
    });
    // Will refetch via effect
  };

  return (
    <div className="min-h-screen">
      
      {/* Hero Banner Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-16 md:py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative max-w-7xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>KR Mangalam University – Web Development Capstone</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
            Find Your Ideal Rental Home in <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">Gurugram & NCR</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto">
            Discover verified apartments, independent villas, studio pads, and co-living spaces with real-time enquiries, visit booking, and area average rent analytics.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs text-slate-300">
            <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Owner & Admin Verified Listings</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Direct Visit Scheduling</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>MongoDB Aggregation Area Analytics</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-16">
        
        {/* Search & Filter Component */}
        <SearchFilterBar
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Available Rental Properties
            </h2>
            <p className="text-xs text-slate-500">
              Showing {properties.length} approved {properties.length === 1 ? 'property' : 'properties'} ready for occupancy
            </p>
          </div>

          <Link
            to="/analytics"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg transition"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Check Area-wise Average Rent Rates</span>
          </Link>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-80 border border-slate-200 p-4 space-y-4">
                <div className="bg-slate-200 h-44 rounded-xl"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center text-rose-700 text-sm">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && properties.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No Properties Found</h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              Try adjusting your search criteria, widening the rent range, or resetting filters.
            </p>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Property Cards Grid */}
        {!loading && !error && properties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}

      </main>

    </div>
  );
};

export default HomePage;
