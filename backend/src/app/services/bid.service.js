const { sequelize, Bid, Wallet, WalletTransaction, GameType, Market } = require('../../db/models');
const marketsService = require('./markets.service');

class BidService {
    /**
     * Place a bid
     * @param {Object} data { userId, marketId, gameTypeId, session, digit, amount }
     */
    async placeBid(data) {
        const { userId, marketId, gameTypeId, session, digit, amount } = data;

        // 1. Validate Amount
        if (amount < 10) throw new Error('Minimum bid amount is 10');

        // 2. Check Market Status
        const isOpen = await marketsService.isMarketOpen(marketId, session);
        if (!isOpen) throw new Error('Market is closed for betting');

        const transaction = await sequelize.transaction();
        try {
            // 3. Check Wallet Balance & Deduct
            const wallet = await Wallet.findOne({ where: { user_id: userId }, transaction });
            if (!wallet) throw new Error('Wallet not found');

            if (parseFloat(wallet.balance) < amount) {
                throw new Error('Insufficient wallet balance');
            }

            const newBalance = parseFloat(wallet.balance) - parseFloat(amount);
            await wallet.update({ balance: newBalance }, { transaction });

            // 4. Record Wallet Transaction
            await WalletTransaction.create({
                wallet_id: wallet.id,
                amount: amount,
                type: 'bid',
                description: `Bid on Market ${marketId} (${session}) - ${digit}`,
                status: 'success'
            }, { transaction });

            // 5. Create Bid Record
            const bid = await Bid.create({
                user_id: userId,
                market_id: marketId,
                game_type_id: gameTypeId,
                session,
                digit,
                amount,
                status: 'pending'
            }, { transaction });

            await transaction.commit();
            return bid;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Get User Bids
     */
    async getUserBids(userId, limit = 50, offset = 0) {
        return await Bid.findAndCountAll({
            where: { user_id: userId },
            include: [
                { model: Market, as: 'market', attributes: ['name'] },
                { model: GameType, as: 'game_type', attributes: ['name', 'rate'] }
            ],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });
    }
}

module.exports = new BidService();
