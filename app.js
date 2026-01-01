const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Rate Limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import Routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/v1/auth', authRoutes);

const serviceRoutes = require('./routes/service.routes');
app.use('/api/v1', serviceRoutes);

const adminRoutes = require('./routes/admin.routes');
app.use('/api/v1/admin', adminRoutes);

const partnerRoutes = require('./routes/partner.routes');
app.use('/api/v1/partners', partnerRoutes);

const bookingRoutes = require('./routes/booking.routes');
app.use('/api/v1/bookings', bookingRoutes);

const notificationRoutes = require('./routes/notification.routes');
app.use('/api/v1/notifications', notificationRoutes);

// Swagger Docs
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));



// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

module.exports = app;
