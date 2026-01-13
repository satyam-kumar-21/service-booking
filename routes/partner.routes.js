const express = require('express');
const {
    registerPartner,
    loginPartner,
    getPartnerMe,
    updateProfile
} = require('../controllers/partner.controller');
const { protectPartner } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

// Auth Routes
router.post('/auth/register', upload.fields([
    { name: 'idProof', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), registerPartner);

router.post('/auth/login', loginPartner);

// Protected Routes
router.use(protectPartner);

router.get('/me', getPartnerMe);

router.post('/profile', upload.fields([
    { name: 'idProof', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), updateProfile);

module.exports = router;
