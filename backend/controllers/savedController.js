const SavedProperty = require('../models/SavedProperty');

// @desc    Toggle saving/bookmarking a property (Tenant only)
// @route   POST /api/saved/:propertyId
// @access  Private (Tenant)
exports.toggleSaveProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const existing = await SavedProperty.findOne({
      tenant: req.user._id,
      property: propertyId
    });

    if (existing) {
      await SavedProperty.findByIdAndDelete(existing._id);
      return res.json({
        success: true,
        isSaved: false,
        message: 'Property removed from saved shortlist'
      });
    }

    await SavedProperty.create({
      tenant: req.user._id,
      property: propertyId
    });

    res.status(201).json({
      success: true,
      isSaved: true,
      message: 'Property added to your saved shortlist'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get tenant's saved properties
// @route   GET /api/saved
// @access  Private (Tenant)
exports.getSavedProperties = async (req, res) => {
  try {
    const saved = await SavedProperty.find({ tenant: req.user._id })
      .populate({
        path: 'property',
        populate: { path: 'owner', select: 'name email phone' }
      })
      .sort({ savedAt: -1 });

    // Filter out properties that might have been deleted
    const validSaved = saved.filter(item => item.property != null);

    res.json({
      success: true,
      count: validSaved.length,
      savedProperties: validSaved
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check if a specific property is saved
// @route   GET /api/saved/check/:propertyId
// @access  Private
exports.checkIsSaved = async (req, res) => {
  try {
    const saved = await SavedProperty.findOne({
      tenant: req.user._id,
      property: req.params.propertyId
    });

    res.json({
      success: true,
      isSaved: !!saved
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
