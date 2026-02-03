const marketsService = require('../services/markets.service');

exports.getMarkets = async (req, res, next) => {
    try {
        const markets = await marketsService.getMarkets();
        res.json({ success: true, data: markets });
    } catch (error) {
        next(error);
    }
};

exports.createMarket = async (req, res, next) => {
    try {
        const market = await marketsService.createMarket(req.body);
        res.status(201).json({ success: true, data: market });
    } catch (error) {
        next(error);
    }
};

// ... other admin methods (update, delete)
