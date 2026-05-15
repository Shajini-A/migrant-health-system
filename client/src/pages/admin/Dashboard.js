import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Button, Box, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const AdminDashboard = () => {
  const [outbreaks, setOutbreaks] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    // Fetch Outbreaks
    try {
      const outbreakRes = await api.get('/admin/outbreaks');
      setOutbreaks(outbreakRes.data);
    } catch (err) {
      console.error('Outbreak fetch failed:', err);
      setOutbreaks([]);
    }

    // Fetch Doctors
    try {
      const doctorRes = await api.get('/admin/doctors');
      setDoctors(doctorRes.data);
    } catch (err) {
      console.error('Doctor fetch failed:', err);
      setDoctors([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await api.delete(`/admin/doctors/${id}`);
        fetchData(); // Refresh list
      } catch (err) {
        alert('Error deleting doctor');
      }
    }
  };

  return (
    <>
      <Navbar title="Admin Dashboard" />
      <Container>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h4">System Overview</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/admin/add-doctor')}>Manage Doctors & Hospitals</Button>
        </Box>

        <Grid container spacing={3}>
          {/* Outbreak Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: '#fff3cd', mb: 4 }}>
              <Typography variant="h5" color="error" gutterBottom>🚨 Outbreak Alerts</Typography>
              {outbreaks.length === 0 ? (
                <Typography>No outbreaks detected in the last 7 days.</Typography>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Diagnosis</strong></TableCell>
                      <TableCell><strong>Hospital</strong></TableCell>
                      <TableCell><strong>Cases</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {outbreaks.map((alert, index) => (
                      <TableRow key={index}>
                        <TableCell>{alert.diagnosis}</TableCell>
                        <TableCell>{alert.hospitalName} ({alert.hospitalId})</TableCell>
                        <TableCell><Typography color="error" fontWeight="bold">{alert.count}</Typography></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Paper>
          </Grid>

          {/* Doctor Management Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>👨‍⚕️ Registered Doctors</Typography>
              {doctors.length === 0 ? (
                <Typography>No doctors registered yet.</Typography>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Name</strong></TableCell>
                      <TableCell><strong>Doctor ID</strong></TableCell>
                      <TableCell><strong>Specialization</strong></TableCell>
                      <TableCell><strong>Hospital</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {doctors.map((doc) => (
                      <TableRow key={doc._id}>
                        <TableCell>{doc.name}</TableCell>
                        <TableCell>{doc.doctorId}</TableCell>
                        <TableCell>{doc.specialization}</TableCell>
                        <TableCell>{doc.hospitalId?.name} ({doc.hospitalId?.hospitalId})</TableCell>
                        <TableCell>
                          <IconButton color="error" onClick={() => handleDeleteDoctor(doc._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AdminDashboard;
