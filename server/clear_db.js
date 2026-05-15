const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/migrant_health';

async function clearData() {
  try {
    // 1. Clear Database
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected. Dropping database...');
    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped successfully.');

    // 2. Clear Uploads Folder
    const uploadsDir = path.join(__dirname, 'uploads');
    if (fs.existsSync(uploadsDir)) {
      console.log('Clearing uploads folder...');
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        fs.unlinkSync(path.join(uploadsDir, file));
      }
      console.log('Uploads folder cleared.');
    }

    console.log('\nSystem reset complete. You can now start the application as a first-time user.');
    process.exit(0);
  } catch (err) {
    console.error('Error during reset:', err);
    process.exit(1);
  }
}

clearData();
