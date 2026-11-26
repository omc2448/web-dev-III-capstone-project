const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getMyEnquiries,
  getReceivedEnquiries,
  updateEnquiryStatus
} = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Tenant routes
router.post('/', protect, authorize('tenant'), createEnquiry);
router.get('/my-enquiries', protect, authorize('tenant'), getMyEnquiries);

// Owner routes
router.get('/received', protect, authorize('owner', 'admin'), getReceivedEnquiries);
router.patch('/:id/status', protect, authorize('owner', 'admin'), updateEnquiryStatus);

module.exports = router;
