const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Hospital = require('./models/Hospital');
const HealthRecord = require('./models/HealthRecord');
require('dotenv').config();

async function createReports() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const hospital = await Hospital.findOne({ hospitalId: 'H0001' });
  const doctor = await Doctor.findOne({ doctorId: 'DOC0001' });
  const patient = await User.findOne({ name: /SHAJINI/i });

  // 1. MRI Scan Report (Back Pain)
  const mriRecord = new HealthRecord({
    patientId: patient._id,
    doctorId: doctor._id,
    hospitalId: hospital._id,
    diagnosis: 'MRI LUMBAR SPINE - ACUTE STRAIN',
    prescription: 'TECHNICAL FINDINGS:\n- Spine Alignment: Normal cervical/lumbar curvature.\n- Vertebral Levels: L4-L5 shows minor disc bulge.\n- Soft Tissue: Mild swelling/inflammation at L5 level.\n- Mobility: Restricted due to muscle spasms.\n\nADVICE:\n- Physiotherapy (Short-wave diathermy)\n- Tab. Naproxen 500mg BID',
    date: new Date()
  });

  // 2. Blood Test Report (Fever)
  const bloodRecord = new HealthRecord({
    patientId: patient._id,
    doctorId: doctor._id,
    hospitalId: hospital._id,
    diagnosis: 'HEMATOLOGY & BIO-CHEMISTRY REPORT',
    prescription: 'LAB OBSERVATIONS:\n- WBC Count: 11,500 cells/mcL (Elevated)\n- Platelet Count: 2.1 Lakhs (Normal)\n- ESR: 25 mm/hr (High)\n- CRP: Positive (Indicates active infection)\n\nIMPRESSION:\n- Viral Fever with secondary bacterial infection.\n- Tab. Amoxicillin 500mg TID',
    date: new Date()
  });

  await mriRecord.save();
  await bloodRecord.save();
  
  console.log('MRI and Blood Test reports created successfully!');
  await mongoose.disconnect();
}

createReports().catch(console.error);
