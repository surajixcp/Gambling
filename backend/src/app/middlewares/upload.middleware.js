const multer = require('multer');
const { storage, isCloudinaryConfigured } = require('../../config/cloudinary');

const upload = multer({ storage: storage });

// Wrapper to prevent upload if not configured
const uploadMiddleware = (req, res, next) => {
    if (!isCloudinaryConfigured && req.path.includes('profile-pic')) {
        console.warn("Upload attempted but Cloudinary is not configured.");
        return res.status(500).json({ success: false, error: 'Server storage not configured' });
    }
    return upload.single('image')(req, res, next);
};

// Export original upload for flexibility if needed, but mainly use wrapper for routes
module.exports = upload;
