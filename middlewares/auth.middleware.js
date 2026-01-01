const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Try to find user
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
           return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

const protectAdmin = async (req, res, next) => {
    let token;
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
        // Try to find admin
        req.admin = await Admin.findById(decoded.id).select('-password');
  
        if (!req.admin) {
            return res.status(401).json({ success: false, message: 'Not authorized, admin not found' });
        }
        
        // For compatibility with previous RBAC middleware that expects req.user.role
        req.user = req.admin; 

        next();
      } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: 'Not authorized, token failed' });
      }
    }
  
    if (!token) {
      res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

const protectOrAdmin = async (req, res, next) => {
    let token;
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
        // Try User first
        let user = await User.findById(decoded.id).select('-password');
        if (user) {
            req.user = user;
            return next();
        }

        // Try Admin
        let admin = await Admin.findById(decoded.id).select('-password');
        if (admin) {
            req.admin = admin;
            req.user = admin; // Alias for authorize
            return next();
        }
        
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });

      } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: 'Not authorized, token failed' });
      }
    }
  
    if (!token) {
      res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};

module.exports = { protect, protectAdmin, protectOrAdmin, authorize };
