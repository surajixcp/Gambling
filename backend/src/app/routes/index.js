const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
// const userRoutes = require('./user.routes');
// const walletRoutes = require('./wallet.routes');

router.use('/auth', authRoutes);
// router.use('/user', userRoutes);
// router.use('/wallet', walletRoutes);

module.exports = router;
