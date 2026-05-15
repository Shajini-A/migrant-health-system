const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }, // Optional if past record uploaded by migrant
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }, // Optional
  diagnosis: { type: String, required: true },
  prescription: { type: String, required: true },
  reportFile: { type: String }, // Path to the uploaded file
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
