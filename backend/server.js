require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const savedRoutes = require('./routes/savedRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Project info endpoint
app.get('/', (req, res) => {
  res.json({
    project: 'RentEasy – Property Rental Listing System',
    description: 'Web Development Capstone Project',
    author: {
      name: process.env.STUDENT_NAME || 'Om Chaurasia',
      rollNo: process.env.ROLL_NO || '2501010063',
      institution: process.env.COLLEGE || 'KR Mangalam University',
      semester: '3rd Semester'
    },
    status: 'API Active & Running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      properties: '/api/properties',
      enquiries: '/api/enquiries',
      saved: '/api/saved',
      admin: '/api/admin'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 RentEasy Backend Server running on port ${PORT}`);
  console.log(`🎓 Student: ${process.env.STUDENT_NAME || 'Om Chaurasia'} | Roll: ${process.env.ROLL_NO || '2501010063'}`);
  console.log(`🏫 Institution: ${process.env.COLLEGE || 'KR Mangalam University'}`);
  console.log(`=======================================================`);
});
