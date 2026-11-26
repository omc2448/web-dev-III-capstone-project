const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProperties);

// Specific protected routes (must be defined before /:id)
router.get('/my-listings', protect, authorize('owner', 'admin'), getMyProperties);
router.get('/:id', getPropertyById);

// Protected modification routes
router.post('/', protect, authorize('owner', 'admin'), createProperty);
router.put('/:id', protect, authorize('owner', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteProperty);

module.exports = router;
