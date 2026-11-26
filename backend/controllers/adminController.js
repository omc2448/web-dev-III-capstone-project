const Property = require('../models/Property');
const User = require('../models/User');
const Enquiry = require('../models/Enquiry');

// @desc    Get all pending properties awaiting admin approval
// @route   GET /api/admin/pending-properties
// @access  Private (Admin only)
exports.getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'pending' })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or reject a property listing
// @route   PATCH /api/admin/properties/:id/status
// @access  Private (Admin only)
exports.updatePropertyStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved, rejected, or pending' });
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('owner', 'name email');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    res.json({
      success: true,
      message: `Property has been ${status}`,
      property
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Area-wise Average Rent using MongoDB Aggregation Pipeline
// @route   GET /api/admin/analytics/area-average-rent
// @access  Private (Admin only, or Public analytical view)
exports.getAreaWiseAverageRent = async (req, res) => {
  try {
    // MongoDB Aggregation Pipeline to compute area-wise statistics:
    // 1. $match: only approved properties
    // 2. $group: group by 'location.area' and compute avg, min, max rent, and count
    // 3. $project: format output fields and round averageRent
    // 4. $sort: order areas by average rent descending
    const aggregationResult = await Property.aggregate([
      {
        $match: {
          status: 'approved'
        }
      },
      {
        $group: {
          _id: {
            area: '$location.area',
            city: '$location.city'
          },
          averageRent: { $avg: '$rent' },
          minRent: { $min: '$rent' },
          maxRent: { $max: '$rent' },
          totalListings: { $sum: 1 },
          avgBedrooms: { $avg: '$bedrooms' }
        }
      },
      {
        $project: {
          _id: 0,
          area: '$_id.area',
          city: '$_id.city',
          averageRent: { $round: ['$averageRent', 2] },
          minRent: '$minRent',
          maxRent: '$maxRent',
          totalListings: '$totalListings',
          avgBedrooms: { $round: ['$avgBedrooms', 1] }
        }
      },
      {
        $sort: { averageRent: -1 }
      }
    ]);

    res.json({
      success: true,
      totalAreas: aggregationResult.length,
      data: aggregationResult
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get overall admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTenants = await User.countDocuments({ role: 'tenant' });
    const totalOwners = await User.countDocuments({ role: 'owner' });

    const totalProperties = await Property.countDocuments();
    const approvedProperties = await Property.countDocuments({ status: 'approved' });
    const pendingProperties = await Property.countDocuments({ status: 'pending' });
    const rejectedProperties = await Property.countDocuments({ status: 'rejected' });

    const totalEnquiries = await Enquiry.countDocuments();

    // Property types breakdown aggregation
    const typeBreakdown = await Property.aggregate([
      {
        $group: {
          _id: '$propertyType',
          count: { $sum: 1 },
          avgRent: { $avg: '$rent' }
        }
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          count: '$count',
          avgRent: { $round: ['$avgRent', 0] }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        users: { total: totalUsers, tenants: totalTenants, owners: totalOwners },
        properties: {
          total: totalProperties,
          approved: approvedProperties,
          pending: pendingProperties,
          rejected: rejectedProperties
        },
        enquiries: { total: totalEnquiries },
        typeBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
