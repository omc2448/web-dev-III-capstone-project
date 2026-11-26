import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';
import { 
  Building2, 
  Heart, 
  Calendar, 
  PlusCircle, 
  ShieldCheck, 
  BarChart3, 
  LogOut, 
  User, 
  LogIn, 
  UserPlus 
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { savedPropertyIds } = useSaved();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Project Name */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  RentEasy
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Gurugram Rentals
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links based on user role */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            <Link 
              to="/" 
              className="text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
            >
              Browse Rentals
            </Link>

            {/* Public / Admin Analytics link */}
            <Link 
              to="/analytics" 
              className="flex items-center space-x-1.5 text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
            >
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <span>Area Rates</span>
            </Link>

            {/* Tenant Links */}
            {user && user.role === 'tenant' && (
              <>
                <Link 
                  to="/tenant-dashboard" 
                  className="flex items-center space-x-1.5 text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
                >
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>My Enquiries</span>
                </Link>
                <Link 
                  to="/tenant-dashboard#saved" 
                  className="flex items-center space-x-1.5 text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                  <span>Saved ({savedPropertyIds.size})</span>
                </Link>
              </>
            )}

            {/* Owner Links */}
            {user && user.role === 'owner' && (
              <>
                <Link 
                  to="/owner-dashboard" 
                  className="flex items-center space-x-1.5 text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition"
                >
                  <Building2 className="w-4 h-4 text-emerald-500" />
                  <span>My Listings & Visits</span>
                </Link>
                <Link 
                  to="/owner-dashboard#add-property" 
                  className="flex items-center space-x-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg shadow-sm transition"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Property</span>
                </Link>
              </>
            )}

            {/* Admin Links */}
            {user && user.role === 'admin' && (
              <Link 
                to="/admin-dashboard" 
                className="flex items-center space-x-1.5 text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-3 py-2 rounded-lg transition"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</p>
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'owner' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-lg shadow-sm transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Register</span>
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
