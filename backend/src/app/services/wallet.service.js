const { sequelize, User, Wallet, WalletTransaction, WithdrawRequest } = require('../../db/models');

class WalletService {
    /**
     * Get user wallet balance
     */
    async getBalance(userId) {
        const wallet = await Wallet.findOne({ where: { user_id: userId } });
        if (!wallet) throw new Error('Wallet not found');
        return wallet;
    }

    /**
     * Request Deposit (User initiated)
     */
    async requestDeposit(userId, amount, paymentDetails) {
        const transaction = await sequelize.transaction();
        try {
            const wallet = await Wallet.findOne({ where: { user_id: userId }, transaction });
            if (!wallet) throw new Error('Wallet not found');

            // Record Transaction as PENDING (Do not add balance yet)
            const walletTxn = await WalletTransaction.create({
                wallet_id: wallet.id,
                amount: amount,
                type: 'deposit',
                description: `Deposit Request (${paymentDetails.method})`,
                reference_id: paymentDetails.utr, // Store UTR/Ref
                status: 'pending',
                metadata: paymentDetails // Store full details if needed
            }, { transaction });

            await transaction.commit();
            return walletTxn;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Add funds (Admin manual or Payment Gateway callback)
     * Uses atomic transaction
     */
    async addFunds(userId, amount, referenceId, description = 'Deposit') {
        const transaction = await sequelize.transaction();
        try {
            const wallet = await Wallet.findOne({ where: { user_id: userId }, transaction });
            if (!wallet) throw new Error('Wallet not found');

            // Update Balance
            const newBalance = parseFloat(wallet.balance) + parseFloat(amount);
            await wallet.update({ balance: newBalance }, { transaction });

            // Record Transaction
            await WalletTransaction.create({
                wallet_id: wallet.id,
                amount: amount,
                type: 'deposit',
                description,
                reference_id: referenceId,
                status: 'success'
            }, { transaction });

            await transaction.commit();
            return wallet;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Request Withdrawal
     */
    async requestWithdraw(userId, amount, bankDetails) {
        const transaction = await sequelize.transaction();
        try {
            const wallet = await Wallet.findOne({ where: { user_id: userId }, transaction });
            if (!wallet) throw new Error('Wallet not found');

            if (parseFloat(wallet.balance) < parseFloat(amount)) {
                throw new Error('Insufficient balance');
            }

            // Deduct balance immediately or freeze it? 
            // Requirement says "After approval, payment processed". 
            // Usually best practice is to deduct immediately to prevent double spend.
            const newBalance = parseFloat(wallet.balance) - parseFloat(amount);
            await wallet.update({ balance: newBalance }, { transaction });

            // Create Request
            const request = await WithdrawRequest.create({
                user_id: userId,
                amount,
                bank_details: bankDetails,
                status: 'pending'
            }, { transaction });

            // Record Transaction
            await WalletTransaction.create({
                wallet_id: wallet.id,
                amount: amount,
                type: 'withdraw',
                description: 'Withdrawal Request',
                reference_id: request.id.toString(),
                status: 'pending' // Pending until approved
            }, { transaction });

            await transaction.commit();
            return request;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Get Transaction History
     */
    async getHistory(userId, limit = 20, offset = 0) {
        const wallet = await Wallet.findOne({ where: { user_id: userId } });
        if (!wallet) throw new Error('Wallet not found');

        return await WalletTransaction.findAndCountAll({
            where: { wallet_id: wallet.id },
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });
    }
}

module.exports = new WalletService();
