const Enquiry = require('../models/Enquiry');
const Property = require('../models/Property');

// @desc    Submit an enquiry / schedule visit (Tenant only)
// @route   POST /api/enquiries
// @access  Private (Tenant)
exports.createEnquiry = async (req, res) => {
  try {
    const { propertyId, message, visitDate, phone } = req.body;

    if (!propertyId || !message) {
      return res.status(400).json({ success: false, message: 'Property ID and message are required' });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Prevent owner from enquiring about their own property
    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot enquiry on your own property' });
    }

    const enquiry = await Enquiry.create({
      property: propertyId,
      tenant: req.user._id,
      owner: property.owner,
      message,
      visitDate: visitDate || null,
      phone: phone || req.user.phone || ''
    });

    const populatedEnquiry = await Enquiry.findById(enquiry._id)
      .populate('property', 'title location rent images')
      .populate('owner', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Enquiry & visit request sent successfully to the property owner!',
      enquiry: populatedEnquiry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get enquiries made by logged-in tenant
// @route   GET /api/enquiries/my-enquiries
// @access  Private (Tenant)
exports.getMyEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ tenant: req.user._id })
      .populate('property', 'title location rent images bedrooms propertyType')
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enquiries.length,
      enquiries
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get enquiries received by logged-in owner
// @route   GET /api/enquiries/received
// @access  Private (Owner)
exports.getReceivedEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({ owner: req.user._id })
      .populate('property', 'title location rent images')
      .populate('tenant', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enquiries.length,
      enquiries
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Owner updates status (accepted, rejected) or notes for an enquiry / visit request
// @route   PATCH /api/enquiries/:id/status
// @access  Private (Owner)
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { status, ownerNotes } = req.body;

    if (!['accepted', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    // Check if the current user is the owner of the property
    if (enquiry.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to respond to this enquiry' });
    }

    enquiry.status = status;
    if (ownerNotes !== undefined) {
      enquiry.ownerNotes = ownerNotes;
    }
    await enquiry.save();

    res.json({
      success: true,
      message: `Enquiry status updated to '${status}'`,
      enquiry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
