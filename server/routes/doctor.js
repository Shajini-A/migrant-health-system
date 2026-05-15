const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Appointment = require('../models/Appointment');
const HealthRecord = require('../models/HealthRecord');
const upload = require('../middleware/upload');
const { verifyToken, verifyRole } = require('../middleware/auth');
const User = require('../models/User');

router.use(verifyToken);
router.use(verifyRole(['doctor']));

// Get Doctor's Appointments
router.get('/appointments', async (req, res) => {
  try {
    const doctorId = req.user.id;
    const appointments = await Appointment.find({ doctorId })
      .populate('patientId', 'name phone')
      .populate('hospitalId', 'name')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Appointment Status
router.put('/appointments/:id', async (req, res) => {
  try {
    const { status, newDate } = req.body;
    const updateData = { status };
    if (newDate) updateData.newDate = newDate;

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Upload Health Record
router.post('/records', upload.single('reportFile'), async (req, res) => {
  console.log('--- Upload Route Hit ---');
  console.log('Body:', req.body);
  console.log('File:', req.file);
  try {
    let { patientId, diagnosis, prescription } = req.body;
    const doctorId = req.user.id;
    const hospitalId = req.user.hospitalId;

    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID/Phone is required' });
    }

    let targetPatientId = patientId;

    // If it's NOT a 24-character hex string (standard MongoDB ID), treat as phone
    const isObjectId = mongoose.Types.ObjectId.isValid(patientId) && /^[0-9a-fA-F]{24}$/.test(patientId);
    
    if (!isObjectId) {
      const user = await User.findOne({ phone: patientId });
      if (!user) {
        return res.status(404).json({ error: `Patient not found with phone number: ${patientId}` });
      }
      targetPatientId = user._id;
    }

    const newRecord = new HealthRecord({
      patientId: targetPatientId,
      doctorId,
      hospitalId,
      diagnosis,
      prescription,
      reportFile: req.file ? req.file.path : null
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: err.message || 'Error creating record' });
  }
});

// Get Single Health Record
router.get('/records/:id', async (req, res) => {
  try {
    const record = await HealthRecord.findById(req.params.id)
      .populate('doctorId', 'name specialization doctorId')
      .populate('hospitalId', 'name location hospitalId')
      .populate('patientId', 'name phone');
    
    if (!record) return res.status(404).json({ error: 'Record not found' });
    
    // Authorization check: only the patient or a doctor can view it
    if (req.user.role === 'migrant' && record.patientId._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get ALL Records for the Doctor's Hospital
router.get('/records', async (req, res) => {
  try {
    const records = await HealthRecord.find({ hospitalId: req.user.hospitalId })
      .populate('patientId', 'name phone')
      .populate('doctorId', 'name')
      .sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
