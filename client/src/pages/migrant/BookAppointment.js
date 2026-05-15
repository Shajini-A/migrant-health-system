import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button, MenuItem } from '@mui/material';
import Navbar from '../../components/Navbar';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await api.get('/migrant/hospitals');
        setHospitals(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHospitals();
  }, []);

  const handleHospitalChange = async (e) => {
    const hospitalId = e.target.value;
    setSelectedHospital(hospitalId);
    setSelectedDoctor('');
    try {
      const res = await api.get(`/migrant/doctors/${hospitalId}`);
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/migrant/appointments', {
        hospitalId: selectedHospital,
        doctorId: selectedDoctor,
        date
      });
      alert('Appointment booked successfully!');
      navigate('/migrant/dashboard');
    } catch (err) {
      alert('Error booking appointment');
    }
  };

  return (
    <>
      <Navbar title="Book Appointment" />
      <Container maxWidth="sm">
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>Book a new Appointment</Typography>
          <form onSubmit={handleSubmit}>
            <TextField select fullWidth label="Select Hospital" value={selectedHospital} onChange={handleHospitalChange} margin="normal" required>
              {hospitals.map((h) => (
                <MenuItem key={h._id} value={h._id}>{h.name} - {h.location}</MenuItem>
              ))}
            </TextField>

            <TextField select fullWidth label="Select Doctor" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} margin="normal" required disabled={!selectedHospital}>
              {doctors.map((d) => (
                <MenuItem key={d._id} value={d._id}>{d.name} ({d.specialization})</MenuItem>
              ))}
            </TextField>

            <TextField fullWidth type="datetime-local" label="Date & Time" InputLabelProps={{ shrink: true }} value={date} onChange={(e) => setDate(e.target.value)} margin="normal" required />

            <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 3 }}>Book Appointment</Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default BookAppointment;
