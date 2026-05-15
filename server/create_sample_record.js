const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Hospital = require('./models/Hospital');
const HealthRecord = require('./models/HealthRecord');
require('dotenv').config();

async function createRecord() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const hospital = await Hospital.findOne({ hospitalId: 'H0001' });
  const doctor = await Doctor.findOne({ doctorId: 'DOC0001' });
  const patient = await User.findOne({ name: /SHAJINI/i });
  
  if (!patient || !doctor || !hospital) {
    console.error('Missing data. Make sure Hospital H0001, Doctor DOC0001 and Patient SHAJINI exist.');
    process.exit(1);
  }

  const newRecord = new HealthRecord({
    patientId: patient._id,
    doctorId: doctor._id,
    hospitalId: hospital._id,
    diagnosis: 'Acute Lumbar Strain (Lower Back Pain)',
    prescription: '1. Tab. Paracetamol 500mg (TID for 3 days)\n2. Tab. Ibuprofen 400mg (BID after food)\n3. Complete bed rest for 2 days.\n4. Apply warm compress to the affected area.',
    date: new Date()
  });

  await newRecord.save();
  console.log('Health Record created successfully!');
  await mongoose.disconnect();
}

createRecord().catch(console.error);
