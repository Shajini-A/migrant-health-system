import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Paper, Grid, MenuItem } from '@mui/material';
import Navbar from '../../components/Navbar';
import api from '../../api';

const AddDoctor = () => {
  const [hospitals, setHospitals] = useState([]);

  const [hId, setHId] = useState('');
  const [hName, setHName] = useState('');
  const [hLoc, setHLoc] = useState('');

  const [dName, setDName] = useState('');
  const [dId, setDId] = useState('');
  const [dHospital, setDHospital] = useState('');
  const [spec, setSpec] = useState('');
  const [password, setPassword] = useState('');

  const fetchHospitals = async () => {
    try {
      const res = await api.get('/admin/hospitals');
      setHospitals(res.data);
    } catch (err) {
      console.error('Error fetching hospitals', err);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const handleCreateHospital = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/hospitals', { hospitalId: hId, name: hName, location: hLoc });
      alert('Hospital created successfully!');
      setHId(''); setHName(''); setHLoc('');
      fetchHospitals();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error creating hospital';
      alert(errorMsg);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/doctors', { 
        name: dName, 
        doctorId: dId, 
        hospitalId: dHospital, 
        specialization: spec, 
        password 
      });
      alert('Doctor added successfully!');
      setDName(''); setDId(''); setDHospital(''); setSpec(''); setPassword('');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error adding doctor';
      alert(errorMsg);
    }
  };

  return (
    <>
      <Navbar title="Manage Hospitals & Doctors" />
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Create Hospital</Typography>
              <form onSubmit={handleCreateHospital}>
                <TextField fullWidth label="Hospital ID (e.g. H001)" margin="normal" value={hId} onChange={e=>setHId(e.target.value)} required />
                <TextField fullWidth label="Hospital Name" margin="normal" value={hName} onChange={e=>setHName(e.target.value)} required />
                <TextField fullWidth label="Location" margin="normal" value={hLoc} onChange={e=>setHLoc(e.target.value)} required />
                <Button variant="contained" type="submit" sx={{ mt: 2 }}>Create Hospital</Button>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Add Doctor</Typography>
              <form onSubmit={handleAddDoctor}>
                <TextField fullWidth label="Doctor Name" margin="normal" value={dName} onChange={e=>setDName(e.target.value)} required />
                <TextField fullWidth label="Doctor ID" margin="normal" value={dId} onChange={e=>setDId(e.target.value)} required />
                
                <TextField
                  select
                  fullWidth
                  label="Select Hospital"
                  margin="normal"
                  value={dHospital}
                  onChange={e => setDHospital(e.target.value)}
                  required
                >
                  {hospitals.map((h) => (
                    <MenuItem key={h._id} value={h._id}>
                      {h.name} ({h.hospitalId})
                    </MenuItem>
                  ))}
                </TextField>

                <TextField fullWidth label="Specialization" margin="normal" value={spec} onChange={e=>setSpec(e.target.value)} required />
                <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={e=>setPassword(e.target.value)} required />
                <Button variant="contained" type="submit" sx={{ mt: 2 }}>Add Doctor</Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AddDoctor;
