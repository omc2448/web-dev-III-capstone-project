import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { 
  Calendar, 
  Heart, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Phone, 
  Building2,
  ExternalLink 
} from 'lucide-react';

const TenantDashboard = () => {
  const { user, token } = useAuth();
  const { savedPropertyIds } = useSaved();
  const [activeTab, setActiveTab] = useState('enquiries');
  
  // Data states
  const [enquiries, setEnquiries] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/enquiries/my-enquiries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries(data.enquiries);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSaved = async () => {
    try {
      const res = await fetch('/api/saved', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSavedProperties(data.savedProperties);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchEnquiries(), fetchSaved()]);
      setLoading(false);
    };

    if (token) loadAll();
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-200">Tenant Control Center</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Hello, {user?.name}</h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1">
              Track your property enquiries, scheduled in-person visit dates, and shortlisted homes.
            </p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 bg-white text-blue-700 font-bold rounded-xl text-xs hover:bg-blue-50 transition shadow-sm"
          >
            Explore More Properties
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-8 space-x-6">
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'enquiries'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Enquiries & Visits ({enquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'saved'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Shortlist ({savedProperties.length})</span>
        </button>
      </div>

      {/* Tab 1: Enquiries & Visit Requests */}
      {activeTab === 'enquiries' && (
        <div>
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">Loading enquiries...</div>
          ) : enquiries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No Enquiries Yet</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                You haven't scheduled any property visits or sent enquiries yet.
              </p>
              <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">
                Browse Rental Properties
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enquiries.map((enq) => (
                <div key={enq._id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Left: Property snippet */}
                    <div className="flex items-start space-x-4">
                      <img
                        src={enq.property?.images && enq.property.images[0] ? enq.property.images[0] : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000'}
                        alt=""
                        className="w-20 h-20 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                      />
                      <div>
                        <Link 
                          to={`/properties/${enq.property?._id}`}
                          className="text-base font-bold text-slate-900 hover:text-blue-600 transition flex items-center space-x-1"
                        >
                          <span>{enq.property?.title}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {enq.property?.location?.area}, {enq.property?.location?.city} • ₹{enq.property?.rent?.toLocaleString('en-IN')}/mo
                        </p>
                        
                        <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 max-w-xl">
                          <span className="font-semibold text-slate-700">Your Message:</span> "{enq.message}"
                        </div>
                      </div>
                    </div>

                    {/* Right: Visit Date & Status */}
                    <div className="flex flex-col sm:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0">
                      <div>
                        {enq.status === 'accepted' && (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Visit Accepted by Owner</span>
                          </span>
                        )}
                        {enq.status === 'pending' && (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Awaiting Owner Review</span>
                          </span>
                        )}
                        {enq.status === 'rejected' && (
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Declined</span>
                          </span>
                        )}
                      </div>

                      {enq.visitDate && (
                        <p className="text-xs text-slate-600 mt-2">
                          <span className="font-semibold text-slate-800">Visit Date:</span> {new Date(enq.visitDate).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      )}

                      {enq.ownerNotes && (
                        <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded mt-1.5 font-medium">
                          Owner Note: {enq.ownerNotes}
                        </p>
                      )}

                      <p className="text-[11px] text-slate-400 mt-1">
                        Owner: {enq.owner?.name} {enq.owner?.phone ? `(${enq.owner.phone})` : ''}
                      </p>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Shortlist */}
      {activeTab === 'saved' && (
        <div>
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">Loading wishlist...</div>
          ) : savedProperties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No Saved Properties</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Click the heart icon on any property card to save it for quick reference later.
              </p>
              <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">
                Explore Properties
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((item) => (
                <PropertyCard key={item._id} property={item.property} />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default TenantDashboard;
