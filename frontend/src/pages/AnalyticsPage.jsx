import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  MapPin, 
  TrendingUp, 
  Building2, 
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AnalyticsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/analytics/area-average-rent');
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to load area analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top back link */}
      <Link 
        to="/" 
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Property Listings</span>
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>MongoDB Aggregation Analytics Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Gurugram Area-wise Average Rent Market Insights
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Data aggregated in real time via MongoDB Aggregation Pipeline ($match, $group, $project, $sort). 
            Compare prevailing average rentals, minimum to maximum pricing spreads, and average bedroom configurations across sectors.
          </p>
        </div>
      </div>

      {/* Aggregation Highlights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-slate-400">Highest Avg Rent Area</p>
              <h3 className="text-base font-bold text-slate-900">
                {data.length > 0 ? data[0].area : 'Calculating...'}
              </h3>
            </div>
          </div>
          <p className="text-2xl font-extrabold text-blue-600">
            {data.length > 0 ? `₹${data[0].averageRent.toLocaleString('en-IN')}` : '—'}
          </p>
          <p className="text-xs text-slate-500 mt-1">Average monthly rate</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-slate-400">Total Analyzed Areas</p>
              <h3 className="text-base font-bold text-slate-900">{data.length} Neighborhoods</h3>
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">
            {data.reduce((acc, curr) => acc + curr.totalListings, 0)} Units
          </p>
          <p className="text-xs text-slate-500 mt-1">Aggregated verified listings</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-slate-400">Technical Spec</p>
              <h3 className="text-base font-bold text-slate-900">Mongoose Aggregation</h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Uses <code className="text-purple-600 font-bold">$avg</code> on <code className="text-purple-600 font-bold">rent</code> grouped by <code className="text-purple-600 font-bold">location.area</code>.
          </p>
          <p className="text-[11px] text-purple-700 font-semibold mt-1">Om Chaurasia (2501010063)</p>
        </div>
      </div>

      {/* Area Statistics Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span>Area-Wise Rental Rates Comparison Table</span>
        </h2>

        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">Computing area averages...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50">
                  <th className="py-3.5 px-4">Area & Neighborhood</th>
                  <th className="py-3.5 px-4">City</th>
                  <th className="py-3.5 px-4">Average Rent</th>
                  <th className="py-3.5 px-4">Lowest Rent</th>
                  <th className="py-3.5 px-4">Highest Rent</th>
                  <th className="py-3.5 px-4">Avg Bedrooms</th>
                  <th className="py-3.5 px-4">Sample Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-4 font-bold text-slate-900 flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span>{row.area}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-600">{row.city}</td>
                    <td className="py-4 px-4 font-extrabold text-blue-600 text-base">
                      ₹{row.averageRent.toLocaleString('en-IN')}<span className="text-xs text-slate-400 font-normal">/mo</span>
                    </td>
                    <td className="py-4 px-4 text-slate-700">₹{row.minRent.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-4 text-slate-700">₹{row.maxRent.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-4 font-semibold text-slate-800">{row.avgBedrooms} BHK</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700">
                        {row.totalListings} {row.totalListings === 1 ? 'Listing' : 'Listings'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AnalyticsPage;
