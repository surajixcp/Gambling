const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Wallet, sequelize } = require('../../db/models');

/**
 * Service to handle Authentication logic
 */
class AuthService {
    /**
     * Register a new user
     * @param {Object} data - { phone, mpin, full_name, device_token }
     */
    async register(data) {
        const transaction = await sequelize.transaction();
        try {
            const { phone, mpin, full_name, device_token } = data;

            // Check if user exists
            const existingUser = await User.findOne({ where: { phone } });
            if (existingUser) {
                throw new Error('Phone number already registered');
            }

            // Create User
            const mpin_hash = await bcrypt.hash(mpin, 10);
            const user = await User.create({
                phone,
                mpin_hash,
                full_name,
                device_token,
                role: 'user',
                status: 'active'
            }, { transaction });

            // Create User Wallet
            await Wallet.create({
                user_id: user.id,
                balance: 0.00,
                bonus: 50.00 // Sign up bonus example
            }, { transaction });

            await transaction.commit();

            const token = user.getSignedJwtToken();
            return { user, token };

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Login user
     * @param {string} phone
     * @param {string} mpin
     */
    async login(phone, mpin) {
        const user = await User.findOne({
            where: { phone },
            include: [{ model: Wallet, as: 'wallet' }]
        });

        if (!user) {
            throw new Error('Invalid credentials');
        }

        if (user.status === 'blocked') {
            throw new Error('Your account is blocked. Contact support.');
        }

        // Verify MPIN
        // Note: Assuming mpin_hash stored properly
        const isMatch = await bcrypt.compare(mpin, user.mpin_hash);

        if (!isMatch) {
            throw new Error('Invalid MPIN');
        }

        const token = user.getSignedJwtToken();
        return { user, token };
    }

    /**
     * Verify OTP (Stub - Integrate Firebase Admin later)
     */
    async verifyOtp(phone, otp) {
        // TODO: Implement actual Firebase verify
        if (otp === '123456') return true; // Mock
        return false;
    }
}

module.exports = new AuthService();
