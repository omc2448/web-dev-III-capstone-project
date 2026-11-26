const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  rent: {
    type: Number,
    required: [true, 'Monthly rent is required'],
    min: [0, 'Rent cannot be negative']
  },
  securityDeposit: {
    type: Number,
    default: 0
  },
  location: {
    area: {
      type: String,
      required: [true, 'Area / Neighborhood is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      default: 'Haryana'
    },
    address: {
      type: String,
      required: [true, 'Full address is required']
    },
    zipCode: {
      type: String,
      default: ''
    }
  },
  propertyType: {
    type: String,
    enum: ['Apartment', 'Independent House', 'Villa', 'Studio', 'PG / Co-living'],
    default: 'Apartment'
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
    min: 1
  },
  bathrooms: {
    type: Number,
    default: 1
  },
  furnishingStatus: {
    type: String,
    enum: ['Fully Furnished', 'Semi Furnished', 'Unfurnished'],
    default: 'Semi Furnished'
  },
  amenities: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    default: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending' // Admin must approve before it goes public
  },
  availableFrom: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search & aggregation performance
propertySchema.index({ 'location.area': 1, rent: 1 });
propertySchema.index({ status: 1, rent: 1, bedrooms: 1 });

module.exports = mongoose.model('Property', propertySchema);
