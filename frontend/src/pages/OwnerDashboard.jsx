import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  PlusCircle, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Edit, 
  MapPin, 
  Clock, 
  Bed, 
  AlertCircle,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

const OwnerDashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('listings');
  const [myProperties, setMyProperties] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state for Creating/Editing Property
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rent: '',
    securityDeposit: '',
    propertyType: 'Apartment',
    bedrooms: '2',
    bathrooms: '2',
    furnishingStatus: 'Semi Furnished',
    area: '',
    city: 'Gurugram',
    state: 'Haryana',
    address: '',
    zipCode: '',
    amenities: '24/7 Power Backup, Lift, Security, Parking',
    images: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Response notes for enquiry
  const [ownerNoteInput, setOwnerNoteInput] = useState({});

  const fetchMyProperties = async () => {
    try {
      const res = await fetch('/api/properties/my-listings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMyProperties(data.properties);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReceivedEnquiries = async () => {
    try {
      const res = await fetch('/api/enquiries/received', {
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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMyProperties(), fetchReceivedEnquiries()]);
      setLoading(false);
    };

    if (token) loadData();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      rent: '',
      securityDeposit: '',
      propertyType: 'Apartment',
      bedrooms: '2',
      bathrooms: '2',
      furnishingStatus: 'Semi Furnished',
      area: '',
      city: 'Gurugram',
      state: 'Haryana',
      address: '',
      zipCode: '',
      amenities: '24/7 Power Backup, Lift, Security, Parking',
      images: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prop) => {
    setEditingId(prop._id);
    setFormData({
      title: prop.title,
      description: prop.description,
      rent: prop.rent,
      securityDeposit: prop.securityDeposit || '',
      propertyType: prop.propertyType,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      furnishingStatus: prop.furnishingStatus,
      area: prop.location?.area || '',
      city: prop.location?.city || 'Gurugram',
      state: prop.location?.state || 'Haryana',
      address: prop.location?.address || '',
      zipCode: prop.location?.zipCode || '',
      amenities: prop.amenities ? prop.amenities.join(', ') : '',
      images: prop.images && prop.images.length > 0 ? prop.images[0] : ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      setFormError('');

      const amenitiesArray = formData.amenities
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0);

      const imagesArray = formData.images
        .split(',')
        .map(i => i.trim())
        .filter(i => i.length > 0);

      const payload = {
        title: formData.title,
        description: formData.description,
        rent: Number(formData.rent),
        securityDeposit: Number(formData.securityDeposit || 0),
        propertyType: formData.propertyType,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        furnishingStatus: formData.furnishingStatus,
        location: {
          area: formData.area,
          city: formData.city,
          state: formData.state,
          address: formData.address,
          zipCode: formData.zipCode
        },
        amenities: amenitiesArray,
        images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000']
      };

      const url = editingId ? `/api/properties/${editingId}` : '/api/properties';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchMyProperties();
      } else {
        setFormError(data.message || 'Operation failed');
      }
    } catch (err) {
      setFormError('Failed to save property listing');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property listing?')) return;

    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setMyProperties(prev => prev.filter(p => p._id !== id));
      } else {
        alert(data.message || 'Delete failed');
      }
    } catch (err) {
      alert('Error deleting property');
    }
  };

  const handleUpdateEnquiryStatus = async (enquiryId, status) => {
    try {
      const note = ownerNoteInput[enquiryId] || '';
      const res = await fetch(`/api/enquiries/${enquiryId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, ownerNotes: note })
      });
      const data = await res.json();
      if (data.success) {
        fetchReceivedEnquiries();
      } else {
        alert(data.message || 'Could not update enquiry status');
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-900 rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">Owner Portal</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Manage Your Properties</h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              Add new rental units, track admin approval status, and manage visits requested by tenants.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white text-emerald-800 font-bold rounded-xl text-xs hover:bg-emerald-50 transition shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List New Property</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-8 space-x-6">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'listings'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>My Listings ({myProperties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-3 text-sm font-bold flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'enquiries'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Received Enquiries & Visits ({enquiries.length})</span>
        </button>
      </div>

      {/* Tab 1: My Listings */}
      {activeTab === 'listings' && (
        <div>
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">Loading properties...</div>
          ) : myProperties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No Properties Listed Yet</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                You haven't listed any properties for rent yet.
              </p>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
              >
                Create First Listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProperties.map((prop) => (
                <div key={prop._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-[16/10] bg-slate-100">
                      <img
                        src={prop.images && prop.images[0] ? prop.images[0] : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000'}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        {prop.status === 'approved' && (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-600 text-white shadow-sm flex items-center space-x-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Live & Approved</span>
                          </span>
                        )}
                        {prop.status === 'pending' && (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500 text-white shadow-sm flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending Admin Approval</span>
                          </span>
                        )}
                        {prop.status === 'rejected' && (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-rose-600 text-white shadow-sm flex items-center space-x-1">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <p className="text-base font-bold text-slate-900 line-clamp-1">{prop.title}</p>
                      <p className="text-xs text-slate-500 flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        {prop.location?.area}, {prop.location?.city}
                      </p>
                      <p className="text-sm font-extrabold text-emerald-700">
                        ₹{prop.rent.toLocaleString('en-IN')}/month
                      </p>
                      <div className="text-xs text-slate-600 flex items-center space-x-3 pt-1">
                        <span>{prop.bedrooms} BHK</span>
                        <span>•</span>
                        <span>{prop.propertyType}</span>
                        <span>•</span>
                        <span>{prop.furnishingStatus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between mt-3">
                    <Link
                      to={`/properties/${prop._id}`}
                      className="text-xs text-slate-600 hover:text-emerald-700 font-semibold flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </Link>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(prop)}
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(prop._id)}
                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Received Enquiries */}
      {activeTab === 'enquiries' && (
        <div>
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">Loading enquiries...</div>
          ) : enquiries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No Enquiries Received</h3>
              <p className="text-xs text-slate-500 mt-1">
                You haven't received any enquiries from prospective tenants yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {enquiries.map((enq) => (
                <div key={enq._id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Left: Tenant & Property details */}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-bold text-slate-900 text-sm">Tenant: {enq.tenant?.name}</span>
                        <span className="text-xs text-slate-400">({enq.tenant?.email} • {enq.phone || enq.tenant?.phone || 'No phone'})</span>
                      </div>
                      
                      <p className="text-xs font-semibold text-emerald-800">
                        Property: {enq.property?.title} (₹{enq.property?.rent?.toLocaleString('en-IN')}/mo)
                      </p>

                      <div className="mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-700 max-w-xl">
                        <span className="font-semibold text-slate-800">Message:</span> "{enq.message}"
                      </div>

                      {enq.visitDate && (
                        <p className="text-xs font-semibold text-slate-700 mt-2 flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          <span>Proposed In-Person Visit: {new Date(enq.visitDate).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </p>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col sm:items-end space-y-2 border-t lg:border-t-0 pt-3 lg:pt-0">
                      <div>
                        {enq.status === 'accepted' && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            ✓ You Accepted This Visit
                          </span>
                        )}
                        {enq.status === 'rejected' && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                            ✕ You Declined This Visit
                          </span>
                        )}
                        {enq.status === 'pending' && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                            Awaiting Your Decision
                          </span>
                        )}
                      </div>

                      {/* Reply Note Input */}
                      <input
                        type="text"
                        placeholder="Optional note / confirmation time..."
                        value={ownerNoteInput[enq._id] !== undefined ? ownerNoteInput[enq._id] : (enq.ownerNotes || '')}
                        onChange={(e) => setOwnerNoteInput({ ...ownerNoteInput, [enq._id]: e.target.value })}
                        className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateEnquiryStatus(enq._id, 'accepted')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Accept Visit</span>
                        </button>
                        <button
                          onClick={() => handleUpdateEnquiryStatus(enq._id, 'rejected')}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-rose-600 hover:text-white text-slate-700 rounded-lg text-xs font-semibold transition flex items-center space-x-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingId ? 'Edit Property Listing' : 'List New Rental Property'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3 mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Property Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Spacious 2 BHK Flat near Cyber City"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  rows="3"
                  placeholder="Detailed description of flat, features, nearby landmarks..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Rent (₹)</label>
                  <input
                    type="number"
                    name="rent"
                    required
                    placeholder="25000"
                    value={formData.rent}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Security Deposit (₹)</label>
                  <input
                    type="number"
                    name="securityDeposit"
                    placeholder="50000"
                    value={formData.securityDeposit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Property Type</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Villa">Villa</option>
                    <option value="Studio">Studio</option>
                    <option value="PG / Co-living">PG / Co-living</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    min="1"
                    required
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    name="bathrooms"
                    min="1"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Furnishing</label>
                  <select
                    name="furnishingStatus"
                    value={formData.furnishingStatus}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Fully Furnished">Fully Furnished</option>
                    <option value="Semi Furnished">Semi Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Area / Neighborhood</label>
                  <input
                    type="text"
                    name="area"
                    required
                    placeholder="e.g. Sohna Road, Golf Course Road"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    placeholder="Gurugram"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Street Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="e.g. Tower 3, Flat 501, Palm Grove Enclave"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amenities (comma-separated)</label>
                <input
                  type="text"
                  name="amenities"
                  placeholder="Power Backup, Lift, Security, Parking, Gym, Balcony"
                  value={formData.amenities}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  name="images"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.images}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : editingId ? 'Update Listing' : 'Submit Listing for Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default OwnerDashboard;
