const express = require('express');
const { 
    getAllUsers, toggleUserStatus, 
    getAllPartners, approvePartner,
    getDashboardStats
} = require('../controllers/admin.controller');
const { registerAdmin, loginAdmin, getAdminMe } = require('../controllers/adminAuth.controller');
const { protectAdmin, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Admin Auth
router.post('/auth/register', registerAdmin);
router.post('/auth/login', loginAdmin);
router.get('/auth/me', protectAdmin, getAdminMe);

// Protect all following routes
router.use(protectAdmin);
router.use(authorize('admin', 'superadmin'));

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id/status', toggleUserStatus);

// Partner Management
router.get('/partners', getAllPartners);
router.put('/partners/:id/approval', approvePartner);

// Stats
router.get('/stats', getDashboardStats);

module.exports = router;
