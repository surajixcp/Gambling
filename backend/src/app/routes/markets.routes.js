const express = require('express');
const router = express.Router();
const marketsController = require('../controllers/markets.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Public request to see markets
router.get('/', marketsController.getMarkets);

// Admin only routes
router.post('/', protect, authorize('admin'), marketsController.createMarket);

module.exports = router;
