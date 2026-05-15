const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  doctorId: { type: String, required: true, unique: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  specialization: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'doctor' }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
