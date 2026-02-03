const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
// const userRoutes = require('./user.routes');
const walletRoutes = require('./wallet.routes');
const marketsRoutes = require('./markets.routes');
const bidsRoutes = require('./bids.routes');

router.use('/auth', authRoutes);
// router.use('/user', userRoutes);
router.use('/wallet', walletRoutes);
router.use('/markets', marketsRoutes);
router.use('/bids', bidsRoutes);

module.exports = router;
