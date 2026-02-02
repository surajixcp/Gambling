const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
    try {
        const { phone, mpin, full_name, device_token } = req.body;

        // Basic validation
        if (!phone || !mpin) {
            return res.status(400).json({ success: false, error: 'Phone and MPIN are required' });
        }

        const result = await authService.register({ phone, mpin, full_name, device_token });

        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { phone, mpin } = req.body;

        if (!phone || !mpin) {
            return res.status(400).json({ success: false, error: 'Phone and MPIN are required' });
        }

        const result = await authService.login(phone, mpin);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: error.message
        });
    }
};
