// Script để chạy seeder (dùng khi cần seed dữ liệu)
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/education_portal';

// Kết nối MongoDB
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected for seeding');
    
    // Import và chạy seeder
    try {
      const seeder = require('./data/seeder.js');
      console.log('✅ Seeder completed successfully');
      process.exit(0);
    } catch (error) {
      console.error('❌ Seeder error:', error.message);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
