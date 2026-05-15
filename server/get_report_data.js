const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Hospital = require('./models/Hospital');
const HealthRecord = require('./models/HealthRecord');
require('dotenv').config();

async function getData() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const hospital = await Hospital.findOne({ hospitalId: 'H0001' });
  const doctor = await Doctor.findOne({ doctorId: 'DOC0001' }).populate('hospitalId');
  const patient = await User.findOne({ name: /SHAJINI/i }); // Assuming SHAJINI is the migrant
  
  console.log('Hospital:', JSON.stringify(hospital, null, 2));
  console.log('Doctor:', JSON.stringify(doctor, null, 2));
  console.log('Patient:', JSON.stringify(patient, null, 2));
  
  const record = await HealthRecord.findOne({ patientId: patient ? patient._id : null }).populate('doctorId hospitalId');
  console.log('Health Record:', JSON.stringify(record, null, 2));

  await mongoose.disconnect();
}

getData().catch(console.error);
