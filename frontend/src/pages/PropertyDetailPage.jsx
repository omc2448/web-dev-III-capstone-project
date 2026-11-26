import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Heart, 
  Calendar, 
  ShieldCheck, 
  Send, 
  User, 
  Phone, 
  Mail, 
  Sparkles,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { isSaved, toggleSave } = useSaved();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Enquiry & Visit Form State
  const [enquiryForm, setEnquiryForm] = useState({
    message: '',
    visitDate: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/properties/${id}`);
        const data = await res.json();
        if (data.success) {
          setProperty(data.property);
        } else {
          setError(data.message || 'Property not found');
        }
      } catch (err) {
        setError('Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!token || !user) {
      alert('Please log in as a Tenant to send an enquiry or book a visit.');
      navigate('/login');
      return;
    }

    if (user.role !== 'tenant') {
      alert('Only registered Tenants can send enquiries to property owners.');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitFeedback(null);

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: property._id,
          message: enquiryForm.message,
          visitDate: enquiryForm.visitDate ? new Date(enquiryForm.visitDate) : null,
          phone: enquiryForm.phone || user.phone
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmitFeedback({
          type: 'success',
          message: data.message || 'Your enquiry and visit request have been sent to the owner!'
        });
        setEnquiryForm({ message: '', visitDate: '', phone: '' });
      } else {
        setSubmitFeedback({
          type: 'error',
          message: data.message || 'Could not send enquiry'
        });
      }
    } catch (err) {
      setSubmitFeedback({
        type: 'error',
        message: 'Network error submitting enquiry.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-slate-600 text-sm">Loading property information...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800">{error || 'Property not found'}</h2>
        <Link to="/" className="inline-block mt-4 text-blue-600 hover:underline font-semibold text-sm">
          ← Back to All Rentals
        </Link>
      </div>
    );
  }

  const saved = isSaved(property._id);
  const formattedRent = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(property.rent);

  const formattedDeposit = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(property.securityDeposit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Back button */}
      <Link 
        to="/" 
        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Property Listings</span>
      </Link>

      {/* Main Grid: Left Details & Right Enquiry Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Media & Specifications (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Image */}
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 shadow-md">
            <img 
              src={property.images && property.images[0] ? property.images[0] : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000'} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 backdrop-blur text-white">
                {property.propertyType}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
                {property.furnishingStatus}
              </span>
            </div>

            {(!user || user.role === 'tenant') && (
              <button
                onClick={() => toggleSave(property._id)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 backdrop-blur flex items-center justify-center text-slate-700 hover:text-rose-600 shadow-md transition"
              >
                <Heart className={`w-5 h-5 ${saved ? 'text-rose-500 fill-rose-500' : 'text-slate-600'}`} />
              </button>
            )}
          </div>

          {/* Heading and Location */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{property.title}</h1>
                <p className="text-sm text-slate-500 flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                  {property.location?.address}, {property.location?.area}, {property.location?.city} - {property.location?.zipCode}
                </p>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-600">{formattedRent}</span>
                <span className="text-xs text-slate-500 font-medium block">Monthly Rent</span>
              </div>
            </div>

            {/* Quick Specs badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 block font-medium">Bedrooms</span>
                <span className="text-base font-bold text-slate-800">{property.bedrooms} BHK</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 block font-medium">Bathrooms</span>
                <span className="text-base font-bold text-slate-800">{property.bathrooms} Baths</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 block font-medium">Security Deposit</span>
                <span className="text-base font-bold text-slate-800">{formattedDeposit}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 block font-medium">Furnishing</span>
                <span className="text-base font-bold text-slate-800">{property.furnishingStatus}</span>
              </div>
            </div>

            {/* Description */}
            <div className="pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">Description</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities list */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">Amenities & Facilities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                      <span>{amenity}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Owner Card & Enquiry / Visit Form (1 col) */}
        <div className="space-y-6">
          
          {/* Owner Info Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Listed By Property Owner</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg">
                {property.owner?.name ? property.owner.name[0] : 'O'}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{property.owner?.name || 'Verified Owner'}</p>
                <p className="text-xs text-slate-500 flex items-center mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                  <span>Verified Identity</span>
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
              {property.owner?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{property.owner.phone}</span>
                </div>
              )}
              {property.owner?.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{property.owner.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Enquiry & Visit Request Form */}
          <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-md">
            <div className="flex items-center space-x-2 mb-1">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Enquire or Book a Visit</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Send your message directly to the owner and propose a visit date.
            </p>

            {submitFeedback && (
              <div className={`p-3 rounded-xl text-xs mb-4 ${
                submitFeedback.type === 'success' 
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}>
                {submitFeedback.message}
              </div>
            )}

            <form onSubmit={handleEnquirySubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Proposed Visit Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={enquiryForm.visitDate}
                  onChange={(e) => setEnquiryForm(prev => ({ ...prev, visitDate: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={enquiryForm.phone}
                  onChange={(e) => setEnquiryForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Message to Owner</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Hi, I am interested in renting this property. Can we schedule a visit or discuss lease terms?"
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-sm transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Send Enquiry & Request Visit'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PropertyDetailPage;
