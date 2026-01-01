const express = require('express');
const { 
    createCategory, getCategories, updateCategory, deleteCategory,
    createService, getServices, updateService, deleteService
} = require('../controllers/service.controller');
const { protect, protectAdmin, authorize } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

// Categories
router.route('/categories')
    .post(protectAdmin, authorize('admin', 'superadmin'), upload.single('image'), createCategory)
    .get(getCategories);

router.route('/categories/:id')
    .put(protectAdmin, authorize('admin', 'superadmin'), updateCategory)
    .delete(protectAdmin, authorize('admin', 'superadmin'), deleteCategory);

// Services
router.route('/services')
    .post(protectAdmin, authorize('admin', 'superadmin'), upload.single('image'), createService)
    .get(getServices);

router.route('/services/:id')
    .put(protectAdmin, authorize('admin', 'superadmin'), updateService)
    .delete(protectAdmin, authorize('admin', 'superadmin'), deleteService);

module.exports = router;
