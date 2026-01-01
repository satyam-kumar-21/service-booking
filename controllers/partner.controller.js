const Partner = require('../models/Partner');
const User = require('../models/User');

// @desc    Register/Update Partner Profile
// @route   POST /api/v1/partners/profile
// @access  Private (Partner/User)
exports.updateProfile = async (req, res, next) => {
    try {
        const { serviceArea, services } = req.body;
        
        let documents = {};
        if (req.files) {
            if (req.files['idProof']) documents.idProof = req.files['idProof'][0].path;
            if (req.files['addressProof']) documents.addressProof = req.files['addressProof'][0].path;
        }

        // Check if user role is partner, if not update it? 
        // Or assume they must change role first? 
        // Let's allow any user to apply to become a partner.
        
        let user = await User.findById(req.user.id);
        if(user.role === 'user') {
            user.role = 'partner';
            await user.save();
        }

        let partner = await Partner.findOne({ user: req.user.id });

        if (!partner) {
            partner = await Partner.create({
                user: req.user.id,
                serviceArea,
                services,
                documents
            });
        } else {
            partner.serviceArea = serviceArea || partner.serviceArea;
            partner.services = services || partner.services;
            
            // Merge existing documents with new ones
            partner.documents = {
                idProof: documents.idProof || partner.documents.idProof,
                addressProof: documents.addressProof || partner.documents.addressProof
            };
            
            await partner.save();
        }

        res.status(200).json({ success: true, data: partner });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Current Partner Profile
// @route   GET /api/v1/partners/me
// @access  Private (Partner)
exports.getPartnerMe = async (req, res, next) => {
    try {
        const partner = await Partner.findOne({ user: req.user.id }).populate('services');
        if(!partner) {
             return res.status(404).json({ success: false, message: 'Partner profile not found' });
        }
        res.status(200).json({ success: true, data: partner });
    } catch (error) {
        next(error);
    }
}
