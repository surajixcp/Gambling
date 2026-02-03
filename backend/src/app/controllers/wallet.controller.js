const walletService = require('../services/wallet.service');

exports.getBalance = async (req, res, next) => {
    try {
        const wallet = await walletService.getBalance(req.user.id);
        res.json({ success: true, data: wallet });
    } catch (error) {
        next(error);
    }
};

exports.addFunds = async (req, res, next) => {
    try {
        // NOTE: This usually comes from Payment Gateway Webhook or Admin Panel
        // For testing/manual deposit:
        const { amount, referenceId } = req.body;

        // Security check: Only allow admin or secure webhook signature in real app
        // For now, assume this is an Admin route or protected dev route
        // if (req.user.role !== 'admin') return res.status(403).json({error: 'Unauthorized'});

        const wallet = await walletService.addFunds(req.user.id, amount, referenceId);
        res.json({ success: true, data: wallet, message: 'Funds added successfully' });
    } catch (error) {
        next(error);
    }
};

exports.requestWithdraw = async (req, res, next) => {
    try {
        const { amount, bankDetails } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        const request = await walletService.requestWithdraw(req.user.id, amount, bankDetails);
        res.json({ success: true, data: request, message: 'Withdrawal request submitted' });
    } catch (error) {
        next(error);
    }
};

exports.getHistory = async (req, res, next) => {
    try {
        const { limit, page } = req.query;
        const offset = (page - 1) * limit || 0;
        const history = await walletService.getHistory(req.user.id, limit, offset);
        res.json({ success: true, data: history });
    } catch (error) {
        next(error);
    }
};
