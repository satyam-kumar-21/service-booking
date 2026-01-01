const express = require('express');
const { getMyNotifications, markAsRead } = require('../controllers/notification.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', getMyNotifications);
router.put('/:id/read', markAsRead);

module.exports = router;
