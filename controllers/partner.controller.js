const Partner = require('../models/Partner');
const { generateToken } = require('../utils/generateToken');

// @desc    Register Partner
// @route   POST /api/v1/partners/auth/register
// @access  Public
exports.registerPartner = async (req, res, next) => {
    try {
        const { name, email, mobile, password, serviceType, serviceArea } = req.body;

        let documents = {};
        let image = '';

        if (req.files) {
            if (req.files['idProof']) documents.idProof = req.files['idProof'][0].path;
            if (req.files['addressProof']) documents.addressProof = req.files['addressProof'][0].path;
            if (req.files['image']) image = req.files['image'][0].path;
        }

        let parsedServiceArea = {};
        if (serviceArea) {
            try {
                parsedServiceArea = JSON.parse(serviceArea);
            } catch (error) {
                return res.status(400).json({ success: false, message: 'Invalid JSON format for serviceArea. Make sure it is wrapped in { }' });
            }
        }

        // Check if partner exists (email or mobile)
        const partnerExists = await Partner.findOne({ $or: [{ email }, { mobile }] });
        if (partnerExists) {
            return res.status(400).json({ success: false, message: 'Partner already exists with this email or mobile' });
        }

        // Validate Service Type (Service ID)
        const service = await require('../models/Service').findById(serviceType);
        if (!service) {
            return res.status(404).json({ success: false, message: 'Service Type (Service) not found' });
        }

        const partner = await Partner.create({
            name,
            email,
            mobile,
            password,
            serviceType,
            serviceArea: parsedServiceArea,
            documents,
            image, // Add image here
            isApproved: false // Requires admin approval
        });

        const token = partner.getSignedJwtToken();

        res.status(201).json({
            success: true,
            token,
            data: {
                _id: partner._id,
                name: partner.name,
                email: partner.email,
                role: partner.role,
                isApproved: partner.isApproved
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login Partner
// @route   POST /api/v1/partners/auth/login
// @access  Public
exports.loginPartner = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Check for partner
        const partner = await Partner.findOne({ email }).select('+password');

        if (!partner) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await partner.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check approval status?
        // Maybe allow login but restrict actions if not approved?
        // User said "admin if they direct register". Implies blocking or waiting.
        // Let's allow login so they can check status.

        const token = partner.getSignedJwtToken();

        res.status(200).json({
            success: true,
            token,
            data: {
                _id: partner._id,
                name: partner.name,
                email: partner.email,
                role: partner.role,
                isApproved: partner.isApproved
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Current Partner Profile
// @route   GET /api/v1/partners/me
// @access  Private (Partner)
exports.getPartnerMe = async (req, res, next) => {
    try {
        const partner = await Partner.findById(req.partner.id); // req.partner set by middleware
        res.status(200).json({ success: true, data: partner });
    } catch (error) {
        next(error);
    }
}

// @desc    Update Profile
// @route   PUT /api/v1/partners/profile
// @access  Private (Partner)
exports.updateProfile = async (req, res, next) => {
    try {
        const { serviceArea, serviceType, name, mobile, isActive } = req.body;

        let documents = {};
        if (req.files) {
            if (req.files['idProof']) documents.idProof = req.files['idProof'][0].path;
            if (req.files['addressProof']) documents.addressProof = req.files['addressProof'][0].path;
        }

        let partner = await Partner.findById(req.partner.id);

        if (!partner) {
            return res.status(404).json({ success: false, message: 'Partner not found' });
        }

        if (name) partner.name = name;
        if (mobile) partner.mobile = mobile;
        if (serviceType) partner.serviceType = serviceType;
        if (isActive !== undefined) partner.isActive = isActive;

        if (serviceArea) {
            const parsedArea = typeof serviceArea === 'string' ? JSON.parse(serviceArea) : serviceArea;
            partner.serviceArea = parsedArea;
        }

        if (req.files) {
            partner.documents = {
                idProof: documents.idProof || partner.documents.idProof,
                addressProof: documents.addressProof || partner.documents.addressProof
            };

            if (req.files['image']) {
                partner.image = req.files['image'][0].path;
            }
        }

        await partner.save();

        res.status(200).json({ success: true, data: partner });
    } catch (error) {
        next(error);
    }
};
