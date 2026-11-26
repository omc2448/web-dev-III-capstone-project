import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Heart, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useSaved } from '../context/SavedContext';
import { useAuth } from '../context/AuthContext';

const PropertyCard = ({ property }) => {
  const { isSaved, toggleSave } = useSaved();
  const { user } = useAuth();
  const saved = isSaved(property._id);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(property._id);
  };

  const formattedRent = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(property.rent);

  const imageUrl = property.images && property.images.length > 0 
    ? property.images[0] 
    : 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      
      {/* Property Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img 
          src={imageUrl} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-900/80 backdrop-blur-md text-white shadow-sm">
            {property.propertyType}
          </span>
          {property.furnishingStatus && (
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-blue-600/90 backdrop-blur-md text-white">
              {property.furnishingStatus}
            </span>
          )}
        </div>

        {/* Favorite Save Button */}
        {(!user || user.role === 'tenant') && (
          <button
            onClick={handleHeartClick}
            aria-label="Save Property"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-rose-600 shadow-md transition hover:scale-110 active:scale-95"
          >
            <Heart className={`w-5 h-5 ${saved ? 'text-rose-500 fill-rose-500' : 'text-slate-600'}`} />
          </button>
        )}

        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg shadow-md border border-slate-100">
            <span className="text-base font-extrabold text-blue-600">{formattedRent}</span>
            <span className="text-xs text-slate-500 font-medium"> / month</span>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center text-xs font-medium text-slate-500 mb-2">
            <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500 flex-shrink-0" />
            <span className="truncate">{property.location?.area}, {property.location?.city}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
            {property.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {property.description}
          </p>
        </div>

        <div>
          {/* Key specs */}
          <div className="flex items-center space-x-4 py-3 border-y border-slate-100 text-xs text-slate-600 mb-4">
            <div className="flex items-center space-x-1.5">
              <Bed className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-800">{property.bedrooms}</span>
              <span>BHK</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Bath className="w-4 h-4 text-slate-400" />
              <span className="font-semibold text-slate-800">{property.bathrooms}</span>
              <span>Baths</span>
            </div>
          </div>

          {/* Card Action Link */}
          <Link
            to={`/properties/${property._id}`}
            className="w-full flex items-center justify-center space-x-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white transition duration-200"
          >
            <span>View Details & Schedule Visit</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PropertyCard;
