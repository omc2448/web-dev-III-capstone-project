const express = require('express');
const router = express.Router();
const {
  toggleSaveProperty,
  getSavedProperties,
  checkIsSaved
} = require('../controllers/savedController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/:propertyId', protect, authorize('tenant'), toggleSaveProperty);
router.get('/', protect, authorize('tenant'), getSavedProperties);
router.get('/check/:propertyId', protect, checkIsSaved);

module.exports = router;
