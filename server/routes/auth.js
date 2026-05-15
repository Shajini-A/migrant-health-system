const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

// Migrant Registration
router.post('/register', async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const existingUser = await User.findOne({ phone });
    if (existingUser) return res.status(400).json({ error: 'Phone number already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, phone, password: hashedPassword, role: 'migrant' });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Generic Login (handles Admin, Migrant, and Doctor)
router.post('/login', async (req, res) => {
  try {
    const { phone, password, isDoctor, hospitalId, doctorId } = req.body;

    // Hardcoded Admin
    if (phone === 'admin' && password === 'admin123') {
      const token = jwt.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, role: 'admin', name: 'System Admin' });
    }

    if (isDoctor) {
      // Find doctor and populate hospital info
      const doctor = await Doctor.findOne({ doctorId }).populate('hospitalId');
      
      // Verify doctor exists AND the linked hospital's ID matches the one entered
      if (!doctor || !doctor.hospitalId || doctor.hospitalId.hospitalId !== hospitalId) {
        return res.status(401).json({ error: 'Invalid Doctor ID or Hospital ID' });
      }
      
      const validPass = await bcrypt.compare(password, doctor.password);
      if (!validPass) return res.status(401).json({ error: 'Invalid password' });
      
      const token = jwt.sign(
        { id: doctor._id, role: 'doctor', hospitalId: doctor.hospitalId._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
      );
      
      return res.json({ 
        token, 
        role: 'doctor', 
        name: doctor.name, 
        hospitalId: doctor.hospitalId._id, 
        doctorId: doctor._id 
      });
    } else {
      const user = await User.findOne({ phone });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) return res.status(401).json({ error: 'Invalid password' });

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, role: user.role, name: user.name, id: user._id });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
