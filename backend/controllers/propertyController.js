const Property = require('../models/Property');

// @desc    Get public approved properties with filtering, search & sorting
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    const {
      search,
      minRent,
      maxRent,
      bedrooms,
      propertyType,
      city,
      area,
      sortBy
    } = req.query;

    const query = { status: 'approved' };

    // Search keyword in title, description, or area
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.area': { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } }
      ];
    }

    // Range filter: Rent
    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }

    // Bedrooms filter
    if (bedrooms) {
      if (bedrooms === '4+') {
        query.bedrooms = { $gte: 4 };
      } else {
        query.bedrooms = Number(bedrooms);
      }
    }

    // Property Type filter
    if (propertyType && propertyType !== 'All') {
      query.propertyType = propertyType;
    }

    // City & Area filters
    if (city && city !== 'All') {
      query['location.city'] = { $regex: city, $options: 'i' };
    }
    if (area && area !== 'All') {
      query['location.area'] = { $regex: area, $options: 'i' };
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sortBy === 'rent_asc') {
      sortOptions = { rent: 1 };
    } else if (sortBy === 'rent_desc') {
      sortOptions = { rent: -1 };
    } else if (sortBy === 'bedrooms_desc') {
      sortOptions = { bedrooms: -1 };
    }

    const properties = await Property.find(query)
      .populate('owner', 'name email phone')
      .sort(sortOptions);

    res.json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single property details
// @route   GET /api/properties/:id
// @access  Public
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email phone');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.json({
      success: true,
      property
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new property listing (Owner only)
// @route   POST /api/properties
// @access  Private (Owner, Admin)
exports.createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      rent,
      securityDeposit,
      location,
      propertyType,
      bedrooms,
      bathrooms,
      furnishingStatus,
      amenities,
      images,
      availableFrom
    } = req.body;

    const property = await Property.create({
      title,
      description,
      rent,
      securityDeposit: securityDeposit || 0,
      location,
      propertyType,
      bedrooms,
      bathrooms: bathrooms || 1,
      furnishingStatus: furnishingStatus || 'Semi Furnished',
      amenities: amenities || [],
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000'],
      owner: req.user._id,
      availableFrom: availableFrom || Date.now(),
      status: req.user.role === 'admin' ? 'approved' : 'pending' // Admin auto-approves, owner listings require admin review
    });

    res.status(201).json({
      success: true,
      message: req.user.role === 'admin' 
        ? 'Property listed successfully and approved!' 
        : 'Property listed successfully! Pending admin approval before public listing.',
      property
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update property (Owner of property or Admin)
// @route   PUT /api/properties/:id
// @access  Private
exports.updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Check ownership
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this property' });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Property updated successfully',
      property
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Check ownership
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in owner's properties
// @route   GET /api/properties/my-listings
// @access  Private (Owner)
exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
