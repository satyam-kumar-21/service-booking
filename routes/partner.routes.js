const express = require('express');
const { updateProfile, getPartnerMe } = require('../controllers/partner.controller');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.use(protect);

router.post('/profile', upload.fields([
    { name: 'idProof', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 }
]), updateProfile);
router.get('/me', getPartnerMe);

module.exports = router;
