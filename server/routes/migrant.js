const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const HealthRecord = require('../models/HealthRecord');
const upload = require('../middleware/upload');
const { verifyToken, verifyRole } = require('../middleware/auth');

router.use(verifyToken);
router.use(verifyRole(['migrant']));

// Get all hospitals (for booking dropdown)
router.get('/hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get doctors by hospital (for booking dropdown)
router.get('/doctors/:hospitalId', async (req, res) => {
  try {
    const doctors = await Doctor.find({ hospitalId: req.params.hospitalId });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Book Appointment
router.post('/appointments', async (req, res) => {
  try {
    const { doctorId, hospitalId, date } = req.body;
    const newAppointment = new Appointment({
      patientId: req.user.id,
      doctorId,
      hospitalId,
      date
    });
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(500).json({ error: 'Error booking appointment' });
  }
});

// Get My Appointments
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate('doctorId', 'name specialization')
      .populate('hospitalId', 'name location');
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload Past Medical Report
router.post('/records/past', upload.single('reportFile'), async (req, res) => {
  try {
    const { diagnosis, prescription } = req.body;
    const newRecord = new HealthRecord({
      patientId: req.user.id,
      diagnosis,
      prescription,
      reportFile: req.file ? req.file.path : null
    });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ error: 'Error uploading past record' });
  }
});

// Get My Health Records
router.get('/records', async (req, res) => {
  try {
    const records = await HealthRecord.find({ patientId: req.user.id })
      .populate('doctorId', 'name specialization')
      .populate('hospitalId', 'name');
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete/Cancel Appointment
router.delete('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, patientId: req.user.id });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment cancelled' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
