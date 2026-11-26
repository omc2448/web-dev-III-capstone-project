import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  BarChart3, 
  Users, 
  Building2, 
  Calendar, 
  TrendingUp,
  MapPin,
  Clock,
  Bed
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [areaAnalytics, setAreaAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const [statsRes, pendingRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/pending-properties', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/analytics/area-average-rent')
      ]);

      const statsData = await statsRes.json();
      const pendingData = await pendingRes.json();
      const analyticsData = await analyticsRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (pendingData.success) setPendingProperties(pendingData.properties);
      if (analyticsData.success) setAreaAnalytics(analyticsData.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAdminData();
  }, [token]);

  const handleUpdateStatus = async (id, status) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/properties/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setPendingProperties(prev => prev.filter(p => p._id !== id));
        fetchAdminData(); // Refresh stats and aggregations
      } else {
        alert(data.message || 'Status update failed');
      }
    } catch (err) {
      alert('Error updating listing status');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-slate-500 text-sm">Loading admin dashboard & running MongoDB aggregations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Administrative Oversight Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome, Administrator {user?.name}</h1>
            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              Verify pending rental submissions and monitor area rental aggregations across Gurugram.
            </p>
          </div>
          <div className="text-right bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
            <p className="text-[10px] uppercase tracking-wider text-purple-200 font-bold">College Roll No</p>
            <p className="text-sm font-mono font-bold text-white">2501010063</p>
            <p className="text-[10px] text-purple-300">KR Mangalam University</p>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-4 h-4" /></div>
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">{stats.users.total}</p>
            <p className="text-[11px] text-slate-500 mt-1">
              {stats.users.tenants} Tenants • {stats.users.owners} Owners
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Approved Listings</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 className="w-4 h-4" /></div>
            </div>
            <p className="text-2xl font-extrabold text-emerald-600 mt-2">{stats.properties.approved}</p>
            <p className="text-[11px] text-slate-500 mt-1">Active on public portal</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending Approvals</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Clock className="w-4 h-4" /></div>
            </div>
            <p className="text-2xl font-extrabold text-amber-600 mt-2">{stats.properties.pending}</p>
            <p className="text-[11px] text-slate-500 mt-1">Awaiting your approval</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Enquiries</span>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Calendar className="w-4 h-4" /></div>
            </div>
            <p className="text-2xl font-extrabold text-purple-600 mt-2">{stats.enquiries.total}</p>
            <p className="text-[11px] text-slate-500 mt-1">Visit requests scheduled</p>
          </div>
        </div>
      )}

      {/* Module 1: Pending Approvals Queue */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>Pending Property Approvals Queue ({pendingProperties.length})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review owner-submitted rental listings before making them publicly discoverable.
            </p>
          </div>
        </div>

        {pendingProperties.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p>All property listings are reviewed and up to date!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingProperties.map((prop) => (
              <div key={prop._id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={prop.images && prop.images[0] ? prop.images[0] : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000'}
                    alt=""
                    className="w-20 h-20 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{prop.title}</h3>
                    <p className="text-xs text-slate-500 flex items-center mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 mr-1" />
                      {prop.location?.area}, {prop.location?.city} • {prop.bedrooms} BHK {prop.propertyType}
                    </p>
                    <p className="text-xs font-bold text-blue-600 mt-1">
                      Rent: ₹{prop.rent.toLocaleString('en-IN')}/mo • Owner: {prop.owner?.name} ({prop.owner?.email})
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-1">{prop.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end md:self-center">
                  <Link
                    to={`/properties/${prop._id}`}
                    className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 transition"
                  >
                    View Listing
                  </Link>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(prop._id, 'approved')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleUpdateStatus(prop._id, 'rejected')}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition flex items-center space-x-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Module 2: MongoDB Aggregation Pipeline - Area-wise Average Rent */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Area-wise Average Rent (MongoDB Aggregation Pipeline)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Live calculation using MongoDB <code className="bg-slate-100 text-indigo-700 px-1 py-0.5 rounded font-mono font-bold">$match</code>, <code className="bg-slate-100 text-indigo-700 px-1 py-0.5 rounded font-mono font-bold">$group ($avg, $min, $max)</code>, and <code className="bg-slate-100 text-indigo-700 px-1 py-0.5 rounded font-mono font-bold">$sort</code>.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-auto">
            {areaAnalytics.length} Areas Aggregated
          </span>
        </div>

        {areaAnalytics.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No approved properties yet to compute area statistics.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                  <th className="py-3 px-4">Area & City</th>
                  <th className="py-3 px-4">Average Rent (₹)</th>
                  <th className="py-3 px-4">Rent Range (Min - Max)</th>
                  <th className="py-3 px-4">Avg Bedrooms</th>
                  <th className="py-3 px-4">Active Listings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {areaAnalytics.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        <div>
                          <p className="font-bold text-slate-900">{item.area}</p>
                          <p className="text-[11px] text-slate-400">{item.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-blue-600 text-sm">
                        ₹{item.averageRent.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 block">per month</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      ₹{item.minRent.toLocaleString('en-IN')} — ₹{item.maxRent.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {item.avgBedrooms} BHK
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        {item.totalListings} {item.totalListings === 1 ? 'unit' : 'units'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </section>

    </div>
  );
};

export default AdminDashboard;
