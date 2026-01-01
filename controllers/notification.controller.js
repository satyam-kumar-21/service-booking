const Notification = require('../models/Notification');

// @desc    Get My Notifications
// @route   GET /api/v1/notifications
// @access  Private
exports.getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark Notification as Read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if(!notification) return res.status(404).json({success: false, message: 'Notification not found'});
        
        // Ensure ownership
        if(notification.recipient.toString() !== req.user.id) {
            return res.status(403).json({success: false, message: 'Not authorized'});
        }

        notification.read = true;
        await notification.save();

        res.status(200).json({success: true, data: notification});
    } catch (error) {
        next(error);
    }
}
