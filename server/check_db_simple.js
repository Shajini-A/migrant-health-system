const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
require('dotenv').config();

async function countApps() {
  await mongoose.connect(process.env.MONGO_URI);
  const count = await Appointment.countDocuments();
  console.log(`Total appointments: ${count}`);
  const apps = await Appointment.find();
  console.log(JSON.stringify(apps, null, 2));
  await mongoose.disconnect();
}

countApps().catch(console.error);
