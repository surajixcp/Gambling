const { Market, Result, GameType, sequelize } = require('../../db/models');
const { Op } = require('sequelize');

class MarketsService {
    /**
     * Create a new market
     */
    async createMarket(data) {
        return await Market.create(data);
    }

    /**
     * List all markets (public)
     * Include today's result if available
     */
    async getMarkets() {
        // Basic implementation: fetch all
        // In production: cache this
        const today = new Date().toISOString().split('T')[0];

        const markets = await Market.findAll({
            order: [['open_time', 'ASC']],
            include: [
                {
                    model: Result,
                    as: 'results',
                    where: { date: today },
                    required: false // Left join
                }
            ]
        });

        return markets;
    }

    /**
     * Update market status (Admin)
     */
    async updateMarket(id, data) {
        const market = await Market.findByPk(id);
        if (!market) throw new Error('Market not found');
        return await market.update(data);
    }

    /**
     * Check if market is open for betting
     */
    async isMarketOpen(marketId, session) { // session = 'open' or 'close'
        const market = await Market.findByPk(marketId);
        if (!market) throw new Error('Market not found');

        if (!market.status) return false; // Market disabled
        if (!market.is_open_for_betting) return false; // Betting disabled manually

        const now = new Date();
        // Convert current time to HH:MM:SS
        const currentTime = now.toTimeString().split(' ')[0];

        // Simple time comparison strings works for 24h format
        if (session === 'open') {
            return currentTime < market.open_time;
        } else if (session === 'close') {
            return currentTime < market.close_time;
        }

        return false;
    }
}

module.exports = new MarketsService();
