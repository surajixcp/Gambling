const bidService = require('../services/bid.service');

exports.placeBid = async (req, res, next) => {
    try {
        const { marketId, gameTypeId, session, digit, amount } = req.body;

        // Basic Payload Validation
        if (!marketId || !gameTypeId || !session || !digit || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const bid = await bidService.placeBid({
            userId: req.user.id,
            marketId,
            gameTypeId,
            session,
            digit,
            amount
        });

        res.status(201).json({ success: true, data: bid, message: 'Bid placed successfully' });

    } catch (error) {
        next(error);
    }
};

exports.getMyBids = async (req, res, next) => {
    try {
        const { limit, page } = req.query;
        const offset = (page - 1) * limit || 0;
        const bids = await bidService.getUserBids(req.user.id, limit, offset);
        res.json({ success: true, data: bids });
    } catch (error) {
        next(error);
    }
};
