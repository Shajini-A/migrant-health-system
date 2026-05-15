const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const HealthRecord = require('../models/HealthRecord');
const { verifyToken, verifyRole } = require('../middleware/auth');

router.use(verifyToken);
router.use(verifyRole(['admin']));

// Create Hospital
router.post('/hospitals', async (req, res) => {
  try {
    const { hospitalId, name, location } = req.body;
    const newHospital = new Hospital({ hospitalId, name, location });
    await newHospital.save();
    res.status(201).json(newHospital);
  } catch (err) {
    console.error('Hospital Creation Error:', err);
    res.status(500).json({ error: err.message || 'Error creating hospital' });
  }
});

// Get all hospitals
router.get('/hospitals', async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add Doctor to Hospital
router.post('/doctors', async (req, res) => {
  try {
    const { name, doctorId, hospitalId, specialization, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newDoctor = new Doctor({ name, doctorId, hospitalId, specialization, password: hashedPassword });
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (err) {
    res.status(500).json({ error: 'Error adding doctor' });
  }
});

// Get Outbreaks
router.get('/outbreaks', async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const outbreaks = await HealthRecord.aggregate([
      { $match: { date: { $gte: sevenDaysAgo } } },
      { $group: {
          _id: { diagnosis: "$diagnosis", hospitalId: "$hospitalId" },
          count: { $sum: 1 }
      }},
      { $match: { count: { $gt: 5 } } },
      { $lookup: {
          from: 'hospitals',
          localField: '_id.hospitalId',
          foreignField: '_id',
          as: 'hospitalInfo'
      }},
      { $unwind: '$hospitalInfo' },
      { $project: {
          _id: 0,
          diagnosis: '$_id.diagnosis',
          hospitalName: '$hospitalInfo.name',
          hospitalId: '$hospitalInfo.hospitalId',
          count: 1
      }}
    ]);
    
    res.json(outbreaks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error fetching outbreaks' });
  }
});

// Get all doctors
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('hospitalId', 'name hospitalId');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete Doctor
router.delete('/doctors/:id', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
