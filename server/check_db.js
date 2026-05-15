const mongoose = require('mongoose');
const Appointment = require('./models/Appointment');
const Doctor = require('./models/Doctor');
const User = require('./models/User'); // Fixed missing import
require('dotenv').config();

async function checkAppointments() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  
  const appointments = await Appointment.find().populate('doctorId').populate('patientId');
  console.log('--- APPOINTMENTS ---');
  appointments.forEach(app => {
    console.log(`Date: ${app.date}`);
    console.log(`Doctor: ${app.doctorId ? app.doctorId.name : 'Unknown'} (${app.doctorId ? app.doctorId.doctorId : 'N/A'})`);
    console.log(`Patient: ${app.patientId ? app.patientId.name : 'Unknown'}`);
    console.log(`-------------------`);
  });

  await mongoose.disconnect();
}

checkAppointments().catch(console.error);
