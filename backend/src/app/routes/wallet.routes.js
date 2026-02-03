const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect); // All wallet routes require auth

router.get('/balance', walletController.getBalance);
router.post('/deposit', walletController.addFunds); // TODO: Restrict this or move to Admin/Webhook
router.post('/withdraw', walletController.requestWithdraw);
router.get('/history', walletController.getHistory);

module.exports = router;
