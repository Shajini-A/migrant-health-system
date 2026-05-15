const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
require('dotenv').config();

async function checkDoctor() {
  await mongoose.connect(process.env.MONGO_URI);
  const doctors = await Doctor.find().populate('hospitalId');
  console.log('Doctors in DB:', JSON.stringify(doctors, null, 2));
  await mongoose.disconnect();
}

checkDoctor().catch(console.error);
