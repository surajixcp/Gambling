const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect); // All wallet routes require auth

router.get('/balance', walletController.getBalance);
router.post('/deposit', walletController.addFunds); // Admin/System
router.post('/deposit-request', walletController.requestDeposit); // Manual UPI
router.post('/razorpay/order', walletController.createRazorpayOrder); // Auto UPI - Step 1
router.post('/razorpay/verify', walletController.verifyRazorpayPayment); // Auto UPI - Step 2
router.post('/withdraw', walletController.requestWithdraw);
router.get('/history', walletController.getHistory);

module.exports = router;
