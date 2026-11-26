import React from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

const SearchFilterBar = ({ filters, setFilters, onSearch, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-5 md:p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Main Search Input */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Search by area (e.g. Sohna Road, Golf Course, Cyber City) or property keywords..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 md:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm shadow-sm transition duration-200 flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            <button
              type="button"
              onClick={onReset}
              title="Reset Filters"
              className="px-4 py-3 border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-medium transition duration-200 flex items-center space-x-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Detailed Filters: Range for Rent, Bedrooms, Property Type & Sorting */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-100">
          
          {/* Min Rent */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Min Rent (₹)</label>
            <input
              type="number"
              name="minRent"
              value={filters.minRent}
              onChange={handleChange}
              placeholder="Min ₹ (e.g. 10000)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          {/* Max Rent */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Max Rent (₹)</label>
            <input
              type="number"
              name="maxRent"
              value={filters.maxRent}
              onChange={handleChange}
              placeholder="Max ₹ (e.g. 50000)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          {/* Bedrooms Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Bedrooms (BHK)</label>
            <select
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
            >
              <option value="">Any Bedrooms</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4+">4+ BHK</option>
            </select>
          </div>

          {/* Property Type Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Property Type</label>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
            >
              <option value="All">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="Independent House">Independent House</option>
              <option value="Villa">Villa</option>
              <option value="Studio">Studio</option>
              <option value="PG / Co-living">PG / Co-living</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Sort Results</label>
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
            >
              <option value="newest">Latest Listed</option>
              <option value="rent_asc">Rent: Low to High</option>
              <option value="rent_desc">Rent: High to Low</option>
              <option value="bedrooms_desc">Bedrooms: Most First</option>
            </select>
          </div>

        </div>

      </form>
    </div>
  );
};

export default SearchFilterBar;
