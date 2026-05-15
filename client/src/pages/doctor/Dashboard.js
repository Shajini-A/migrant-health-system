import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, Box } from '@mui/material';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/doctor/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/doctor/appointments/${id}`, { status });
      fetchAppointments();
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <>
      <Navbar title="Doctor Dashboard" />
      <Container>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h5">Appointments</Typography>
          <Button variant="contained" onClick={() => navigate('/doctor/upload-record')}>Upload Health Record</Button>
        </Box>
        
        <Paper sx={{ p: 2 }}>
          {appointments.length === 0 ? (
            <Typography>No appointments scheduled.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell>{new Date(app.date).toLocaleString()}</TableCell>
                    <TableCell>{app.patientId?.name}</TableCell>
                    <TableCell>{app.patientId?.phone}</TableCell>
                    <TableCell>
                      <Typography color={app.status === 'pending' ? 'orange' : app.status === 'approved' ? 'green' : 'red'}>
                        {app.status.toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {app.status === 'pending' && (
                        <>
                          <Button size="small" color="success" variant="outlined" sx={{ mr: 1 }} onClick={() => handleUpdateStatus(app._id, 'approved')}>Accept</Button>
                          <Button size="small" color="error" variant="outlined" onClick={() => handleUpdateStatus(app._id, 'rejected')}>Reject</Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default DoctorDashboard;
