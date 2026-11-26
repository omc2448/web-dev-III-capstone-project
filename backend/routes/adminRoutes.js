const express = require('express');
const router = express.Router();
const {
  getPendingProperties,
  updatePropertyStatus,
  getAreaWiseAverageRent,
  getDashboardStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public/Analytic access or protected
router.get('/analytics/area-average-rent', getAreaWiseAverageRent);

// Admin-only protected routes
router.get('/pending-properties', protect, authorize('admin'), getPendingProperties);
router.patch('/properties/:id/status', protect, authorize('admin'), updatePropertyStatus);
router.get('/stats', protect, authorize('admin'), getDashboardStats);

module.exports = router;
