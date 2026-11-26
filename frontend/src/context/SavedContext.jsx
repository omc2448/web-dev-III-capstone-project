import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const SavedContext = createContext();

export const SavedProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [savedPropertyIds, setSavedPropertyIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch saved property IDs whenever user is logged in as tenant
  useEffect(() => {
    const fetchSaved = async () => {
      if (!user || user.role !== 'tenant' || !token) {
        setSavedPropertyIds(new Set());
        return;
      }

      try {
        setLoading(true);
        const res = await fetch('/api/saved', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.savedProperties) {
          const ids = new Set(data.savedProperties.map(item => item.property?._id || item.property));
          setSavedPropertyIds(ids);
        }
      } catch (err) {
        console.error('Error fetching saved properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [user, token]);

  const toggleSave = async (propertyId) => {
    if (!token || !user) {
      alert('Please log in as a Tenant to save properties to your shortlist!');
      return false;
    }
    if (user.role !== 'tenant') {
      alert('Only Tenants can save properties to a personal shortlist.');
      return false;
    }

    try {
      const res = await fetch(`/api/saved/${propertyId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setSavedPropertyIds(prev => {
          const next = new Set(prev);
          if (data.isSaved) {
            next.add(propertyId);
          } else {
            next.delete(propertyId);
          }
          return next;
        });
        return data.isSaved;
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
    }
    return false;
  };

  const isSaved = (propertyId) => {
    return savedPropertyIds.has(propertyId);
  };

  return (
    <SavedContext.Provider value={{ savedPropertyIds, isSaved, toggleSave, loading }}>
      {children}
    </SavedContext.Provider>
  );
};

export const useSaved = () => useContext(SavedContext);
