const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/renteasy', {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️  Please ensure your local MongoDB service is running (mongod or MongoDB Service in services.msc).');
  }
};

module.exports = connectDB;
